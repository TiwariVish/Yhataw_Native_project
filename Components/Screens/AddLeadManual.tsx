import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { globalStyles } from "../../GlobalCss/GlobalStyles";
import {
  getAllForms,
  getAllSource,
  getAllTeamLeads,
  getTeamList,
} from "./DashboardService";
import {
  getAllTeamDataProject,
  getOfficeDetails,
  getStage,
} from "./LeadInfoScreenService";
import store from "../../utils/store";
import CustomModal from "../../Global/PopAndModels/CustomModel";
import { Checkbox } from "react-native-paper";
import { registerEmployee } from "./AllTeamListService";
import { useNavigation } from "@react-navigation/native";
import { LoginScreenNavigationProp } from "../type";
import { Dropdown } from "react-native-element-dropdown";
const AddLeadManual = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [selectedForm, setSelectedForm] = useState("");
  const [allForms, setAllForms] = useState<any[]>([]);
  const [developerName, setDeveloperName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState("");
  const [leadDetails, setLeadDetails] = useState({
    email: "",
    name: "",
    phone: "",
    stage: "",
    source: "",
  });
  const [teams, setTeams] = useState<any>([]);
  const [value, setValue] = useState(selectedForm);
  const [teamMemberAssine, setTeamMemberAssine] = useState<any>([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [userType, setUserType] = useState<string>("0");
  const [allStageData, setAllData] = useState<any[]>([]);
  const [allSourceType, setAllsourceType] = useState<any>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [memberModalVisible, setMemberModalVisible] = useState(false);
  const [stageModalVisible, setStageModalVisible] = useState(false);
  const [checkedTeams, setCheckedTeams] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [selectedTeamsText, setSelectedTeamsText] = useState<any>([]);
  const [selectedNamesUser, setselectedNamesUser] = useState<any>([]);
  const fetchAllData = useCallback(async () => {
    try {
      const payload = { pageNo: 0, pageSize: 25, search: "" };
      const formData = await getAllForms(payload);
      if (formData?.data) {
        setAllForms(formData.data);
      }
    } catch (error) {
      console.error("Error fetching forms:", error);
    }
  }, []);

  const filterStagesByIsSale = (stages: any[], isSale: number): any[] => {
    return stages
      .map((stage) => {
        const subStages = filterStagesByIsSale(
          stage.sub_Stage_name || [],
          isSale
        );

        if (
          stage.isSale === isSale ||
          stage.isSale === -1 ||
          subStages.length > 0
        ) {
          return {
            ...stage,
            sub_Stage_name: subStages,
          };
        }

        return null;
      })
      .filter((stage) => stage !== null);
  };

  const fetchStageData = async () => {
    const stageData = await getStage();

    const userData = store.getState().auth.userId;
    const response = await getOfficeDetails(userData);
    const teamRoleName = response.data.teamRoleName.toLowerCase();
    let filteredStageData;
    if (teamRoleName.includes("presales")) {
      filteredStageData = filterStagesByIsSale(stageData.data, 0);
      setUserType("0");
    } else if (teamRoleName.includes("sales")) {
      filteredStageData = filterStagesByIsSale(stageData.data, 1);
      setUserType("1");
    } else {
      filteredStageData = stageData.data;
    }
    setAllData(filteredStageData);
  };

  const getAllSourceData = async () => {
    const response = await getAllSource();
    setAllsourceType(response.data);
  };
  useEffect(() => {
    fetchAllData();
    fetchStageData();
    getAllSourceData();
    getAllTeams();
  }, [fetchAllData]);

  const handleFormChange = (itemValue: string) => {
    setSelectedForm(itemValue);
    if (itemValue) {
      const selectedFormData = allForms.find((form) => form._id === itemValue);
      if (selectedFormData) {
        setDeveloperName(selectedFormData.developer_name || "");
        setProjectName(selectedFormData.project_name || "");
        setProjectType(selectedFormData.projecttype_name || "");
      }
    } else {
      setDeveloperName("");
      setProjectName("");
      setProjectType("");
    }
  };
  const openModal = () => {
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };
  const closeMemberModal = () => setMemberModalVisible(false);
  const openMemberModal = () => setMemberModalVisible(true);
  const closeStageModal = () => setStageModalVisible(false);
  const openStageModal = () => setStageModalVisible(true);

  const getAllTeams = async () => {
    try {
      const teamRes = await getTeamList();
      setTeams(teamRes.data);
      const response1 = await getAllTeamDataProject();
      const assignToData = response1.data.flatMap((team: any) => {
        const subTeams =
          team.sub_teams?.map((subTeam: any) => ({
            id: subTeam._id,
            label: subTeam.team_name,
            selected: subTeam?.is_available,
            isParent: false,
            teamMembers: subTeam.team_members.length
              ? subTeam.team_members.map((member: any) => {
                  return {
                    id: member.userId,
                    label: member.users[0].name,
                    selected: 0,
                  };
                })
              : null,
          })) || [];

        const mainTeam = {
          id: team._id,
          label: team.team_name,
          selected: team?.is_available,
          isParent: true,
          teamMembers: team.team_members.length
            ? team.team_members.map((member: any) => {
                return {
                  id: member.userId,
                  label: member.users[0].name,
                  selected: 0,
                };
              })
            : null,
        };
        return [mainTeam, ...subTeams];
      });
      setTeamMemberAssine(assignToData);
    } catch (error) {}
  };

  // const toggleCheckbox = (teamId, teamName, isParent = false) => {
  //   setCheckedTeams((prev) => {
  //     let updatedCheckedTeams = { ...prev };
  //     updatedCheckedTeams[teamId] = !updatedCheckedTeams[teamId];
  //     const selectedTeams = teams
  //       .flatMap((team) => [team, ...(team.sub_teams || [])])
  //       .filter((team) => updatedCheckedTeams[team._id]);
  //     const selectedNames = selectedTeams
  //       .map((team) => team.team_name)
  //       .join(", ");
  //     setSelectedTeamsText(selectedNames);
  //     const selectedMembers = selectedTeams.flatMap((team) => {
  //       const matchingTeam = teamMemberAssine.find((t) => t.id === team._id);
  //       return matchingTeam && matchingTeam.teamMembers
  //         ? matchingTeam.teamMembers
  //         : [];
  //     });

  //     if (selectedMembers.length > 0) {
  //       console.log(selectedMembers, "Filtered Team Members");
  //       setFilteredMembers(selectedMembers);
  //     } else {
  //       console.log("No Team Members found for selected teams.");
  //       setFilteredMembers([]);
  //     }
  //     return updatedCheckedTeams;
  //   });
  // };

  const toggleCheckbox = (teamId, teamName, isParent = false) => {
    setCheckedTeams((prev) => {
      let updatedCheckedTeams = { ...prev };

      const toggleTeam = (id, value) => {
        updatedCheckedTeams[id] = value;
      };

      if (isParent) {
        const parentTeam = teams.find((team) => team._id === teamId);
        const newState = !updatedCheckedTeams[teamId];
        toggleTeam(teamId, newState);

        if (parentTeam && parentTeam.sub_teams) {
          parentTeam.sub_teams.forEach((subTeam) => {
            toggleTeam(subTeam._id, newState);
          });
        }
      } else {
        const newState = !updatedCheckedTeams[teamId];
        toggleTeam(teamId, newState);
        const parentTeam = teams.find((team) =>
          team.sub_teams?.some((subTeam) => subTeam._id === teamId)
        );

        if (parentTeam) {
          const allChildrenChecked = parentTeam.sub_teams.every(
            (subTeam) => updatedCheckedTeams[subTeam._id]
          );
          toggleTeam(parentTeam._id, allChildrenChecked);
        }
      }
      const selectedTeamsData = teams
        .flatMap((team) => [team, ...(team.sub_teams || [])])
        .filter((team) => updatedCheckedTeams[team._id])
        .map((team) => ({
          id: team._id,
          name: team.team_name,
        }));

      setSelectedTeamsText(selectedTeamsData);

      const selectedMembers = selectedTeamsData.flatMap((team) => {
        const matchingTeam = teamMemberAssine.find((t) => t.id === team.id);
        return matchingTeam && matchingTeam.teamMembers
          ? matchingTeam.teamMembers
          : [];
      });

      setFilteredMembers(selectedMembers.length > 0 ? selectedMembers : []);

      return updatedCheckedTeams;
    });
  };

  const toggleMemberSelection = (id) => {
    setFilteredMembers((prevMembers) => {
      const updatedMembers = prevMembers.map((member) =>
        member.id === id ? { ...member, selected: !member.selected } : member
      );
      const selectedMembers = updatedMembers
        .filter((member) => member.selected)
        .map((member) => ({ id: member.id, name: member.label }));

      setselectedNamesUser(selectedMembers);
      return updatedMembers;
    });
  };

  const handleSubStageSelect = (subStageName: string) => {
    setLeadDetails((prev) => ({ ...prev, stage: subStageName }));
    closeStageModal();
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = { name: "", email: "", phone: "" };

    if (!leadDetails.name.trim()) {
      newErrors.name = "Please enter name";
      isValid = false;
    }
    if (!leadDetails.email.trim()) {
      newErrors.email = "Please enter email";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(leadDetails.email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }
    if (!leadDetails.phone.trim()) {
      newErrors.phone = "Please enter phone number";
      isValid = false;
    } else if (!/^\d{10}$/.test(leadDetails.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const postEmployeeLead = async () => {
    if (!validateForm()) return;
    try {
      const idTeam = selectedTeamsText.map((item: any) => {
        return `'${item.id}'`;
      });
      const idMembers = selectedNamesUser.map((item: any) => {
        return `'${item.id}'`;
      });
      const body = {
        leadName: leadDetails.name,
        formId: selectedForm,
        form_name:
          allForms.find((form) => form._id === selectedForm)?.form_name || "",
        dynamicFields: [],
        leadEmail: leadDetails.email,
        leadPhone: leadDetails.phone,
        AssignTo: idTeam.join(",") || "NA",
        AssignToUser: idMembers.join(",") || "NA",
        stage: leadDetails.stage,
        source: leadDetails.source,
        developerId: allForms.find((dev) => dev._id === selectedForm)
          ?.developerId,
        developer_name: developerName,
        project_name: projectName,
        projecttypeId: allForms.find((pro) => pro._id === selectedForm)
          ?.projecttypeId,
        projectId: allForms.find((prof) => prof._id === selectedForm)
          ?.projectId,
        projecttype_name: projectType,
      };
      const response = await registerEmployee(body);
      navigation.navigate("Leads");
    } catch (error) {}
  };

  return (
    <View style={styles.container}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <Text
          style={[
            styles.label,
            globalStyles.fs1,
            globalStyles.h5,
            globalStyles.tc,
          ]}
          allowFontScaling={false}
        >
          Select Form
        </Text>
        {/* <View style={styles.pickerContainer}>
          <Picker selectedValue={selectedForm} onValueChange={handleFormChange}>
            <Picker.Item label="Select a form" value="" />
            {allForms.map((form, index) => (
              <Picker.Item
                key={index}
                label={form.form_name}
                value={form._id}
              />
            ))}
          </Picker>
        </View> */}

        <View style={styles.containerForm}>
          <Dropdown
            itemContainerStyle={{ paddingVertical: -10, paddingHorizontal: 0 }}
            style={styles.dropdown}
            data={allForms.map((form) => ({
              label: form.form_name,
              value: form._id,
            }))}
            labelField="label"
            valueField="value"
            placeholder="Select Your Form Name"
            search
            searchPlaceholder="Search..."
            value={value}
            onChange={(item) => {
              setValue(item.value);
              handleFormChange(item.value);
            }}
          />
        </View>

        {selectedForm && (
          <>
            <Text
              style={[
                styles.label,
                globalStyles.fs1,
                globalStyles.h8,
                globalStyles.tc,
              ]}
              allowFontScaling={false}
            >
              Developer Name
            </Text>
            <TextInput
              style={styles.inputSelected}
              placeholder="Enter Developer Name"
              value={developerName}
              onChangeText={setDeveloperName}
              editable={false}
            />

            <Text
              style={[
                styles.label,
                globalStyles.fs1,
                globalStyles.h8,
                globalStyles.tc,
              ]}
              allowFontScaling={false}
            >
              Project Name
            </Text>
            <TextInput
              style={styles.inputSelected}
              placeholder="Enter Project Name"
              value={projectName}
              onChangeText={setProjectName}
              editable={false}
            />

            <Text
              style={[
                styles.label,
                globalStyles.fs1,
                globalStyles.h8,
                globalStyles.tc,
              ]}
              allowFontScaling={false}
            >
              Project Type
            </Text>
            <TextInput
              style={styles.inputSelected}
              placeholder="Enter Project Type"
              value={projectType}
              onChangeText={setProjectType}
              editable={false}
            />

            <Text
              style={[
                styles.label,
                globalStyles.fs1,
                globalStyles.h8,
                globalStyles.tc,
              ]}
              allowFontScaling={false}
            >
              Assigned To
            </Text>
            <TouchableOpacity onPress={openModal}>
              <TextInput
                style={styles.input}
                placeholder="Select Options"
                editable={false}
                value={
                  selectedTeamsText.length > 0
                    ? selectedTeamsText.map((team) => team.name).join(", ")
                    : ""
                }
              />
            </TouchableOpacity>

            <Text
              style={[
                styles.label,
                globalStyles.fs1,
                globalStyles.h8,
                globalStyles.tc,
              ]}
              allowFontScaling={false}
            >
              Assigned To Member
            </Text>
            <TouchableOpacity onPress={openMemberModal}>
              <TextInput
                style={styles.input}
                placeholder="Select Options"
                editable={false}
                value={
                  selectedNamesUser.length > 0
                    ? selectedNamesUser.map((user) => user.name).join(",")
                    : ""
                }
              />
            </TouchableOpacity>
            <Text
              style={[
                styles.label,
                globalStyles.fs1,
                globalStyles.h5,
                globalStyles.tc,
              ]}
              allowFontScaling={false}
            >
              Lead Details
            </Text>

            <Text
              style={[
                styles.label,
                globalStyles.fs1,
                globalStyles.h8,
                globalStyles.tc,
              ]}
              allowFontScaling={false}
            >
              Enter Name
              <Text style={{ color: "red" }}> *</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Name"
              value={leadDetails.name}
              onChangeText={(text) =>
                setLeadDetails((prev) => ({ ...prev, name: text }))
              }
              editable={true}
            />
            {errors.name ? (
              <Text style={{ color: "red" }}>{errors.name}</Text>
            ) : null}

            <Text
              style={[
                styles.label,
                globalStyles.fs1,
                globalStyles.h8,
                globalStyles.tc,
              ]}
              allowFontScaling={false}
            >
              Enter Email
              <Text style={{ color: "red" }}> *</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Email"
              value={leadDetails.email}
              onChangeText={(text) =>
                setLeadDetails((prev) => ({ ...prev, email: text }))
              }
              keyboardType="email-address"
            />
            {errors.email ? (
              <Text style={{ color: "red" }}>{errors.email}</Text>
            ) : null}

            <Text
              style={[
                styles.label,
                globalStyles.fs1,
                globalStyles.h8,
                globalStyles.tc,
              ]}
              allowFontScaling={false}
            >
              Enter Phone
              <Text style={{ color: "red" }}> *</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Phone Number"
              value={leadDetails.phone}
              onChangeText={(text) =>
                setLeadDetails((prev) => ({ ...prev, phone: text }))
              }
              keyboardType="phone-pad"
              maxLength={12}
            />
            {errors.phone ? (
              <Text style={{ color: "red" }}>{errors.phone}</Text>
            ) : null}

            <Text
              style={[
                styles.label,
                globalStyles.fs1,
                globalStyles.h8,
                globalStyles.tc,
              ]}
              allowFontScaling={false}
            >
              Select Stage
            </Text>
            <TouchableOpacity onPress={openStageModal}>
              <TextInput
                style={styles.input}
                placeholder="Select Stage"
                editable={false}
                value={leadDetails.stage}
              />
            </TouchableOpacity>
            <Text
              style={[
                styles.label,
                globalStyles.fs1,
                globalStyles.h8,
                globalStyles.tc,
              ]}
              allowFontScaling={false}
            >
              Select Source
            </Text>
            {/* <View style={styles.pickerContainer}>
              <Picker
                selectedValue={leadDetails.source}
                onValueChange={(itemValue) =>
                  setLeadDetails((prev) => ({ ...prev, source: itemValue }))
                }
              >
                <Picker.Item label="Select a source" value="" />
                {allSourceType.map((source) => (
                  <Picker.Item
                    key={source._id}
                    label={source.source_name}
                    value={source.source_name}
                  />
                ))}
              </Picker>
            </View> */}

            <View style={styles.containerForm}>
              <Dropdown
                itemContainerStyle={{
                  paddingVertical: -10,
                  paddingHorizontal: 0,
                }}
                style={styles.dropdown}
                data={allSourceType.map((source) => ({
                  label: source.source_name,
                  value: source.source_name,
                }))}
                labelField="label"
                valueField="value"
                placeholder="Select a source"
                value={leadDetails.source}
                onChange={(item) =>
                  setLeadDetails((prev) => ({ ...prev, source: item.value }))
                }
              />
            </View>
            <TouchableOpacity style={styles.button} onPress={postEmployeeLead}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
      <CustomModal isVisible={modalVisible} onClose={closeModal}>
        <View style={{ padding: 10, maxHeight: 500 }}>
          <ScrollView>
            {teams.map((team) => (
              <View key={team._id} style={{ marginBottom: 10 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 3,
                  }}
                >
                  <Checkbox
                    status={checkedTeams[team._id] ? "checked" : "unchecked"}
                    onPress={() =>
                      toggleCheckbox(team._id, team.team_name, true)
                    }
                  />
                  <Text
                    onPress={() =>
                      toggleCheckbox(team._id, team.team_name, true)
                    }
                    style={{ marginLeft: 5 }}
                  >
                    {team.team_name}
                  </Text>
                </View>

                {team.sub_teams.map((subTeam) => (
                  <View
                    key={subTeam._id}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingLeft: 20,
                    }}
                  >
                    <View style={{ transform: [{ scale: 0.7 }] }}>
                      <Checkbox
                        status={
                          checkedTeams[subTeam._id] ? "checked" : "unchecked"
                        }
                        onPress={() =>
                          toggleCheckbox(subTeam._id, subTeam.team_name)
                        }
                      />
                    </View>
                    <Text
                      onPress={() =>
                        toggleCheckbox(subTeam._id, subTeam.team_name)
                      }
                      style={{ marginLeft: 5 }}
                    >
                      {subTeam.team_name}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </ScrollView>
        </View>
      </CustomModal>

      <CustomModal isVisible={memberModalVisible} onClose={closeMemberModal}>
        <View style={{ padding: 10, maxHeight: 500 }}>
          <ScrollView>
            {filteredMembers?.map((member) => (
              <TouchableOpacity
                key={member.id}
                onPress={() => toggleMemberSelection(member.id)}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <View style={{ transform: [{ scale: 0.8 }] }}>
                    <Checkbox
                      status={member.selected ? "checked" : "unchecked"}
                    />
                  </View>
                  <Text style={{ marginLeft: 10, fontSize: 16 }}>
                    {member.label}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </CustomModal>

      <CustomModal isVisible={stageModalVisible} onClose={closeStageModal}>
        <View style={{ padding: 10, maxHeight: 500 }}>
          <ScrollView>
            {allStageData?.map((stage) => (
              <View key={stage._id} style={{ marginBottom: 10 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 3,
                  }}
                >
                  <Text
                    style={[globalStyles.h7, globalStyles.fs1, globalStyles.tc]}
                    allowFontScaling={false}
                  >
                    {stage.stage_Name}
                  </Text>
                </View>
                {stage.sub_Stage_name?.map((subStage) => (
                  <View
                    key={subStage._id}
                    style={{
                      flexDirection: "row",
                      paddingLeft: 20,
                      paddingVertical: 5,
                    }}
                  >
                    <TouchableOpacity
                      key={subStage._id}
                      onPress={() => handleSubStageSelect(subStage.stage_Name)}
                    >
                      <Text
                        style={[
                          globalStyles.h8,
                          globalStyles.fs3,
                          globalStyles.tc,
                          { paddingVertical: 4, paddingHorizontal: 8 },
                        ]}
                        allowFontScaling={false}
                      >
                        {subStage.stage_Name}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ))}
          </ScrollView>
        </View>
      </CustomModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  label: {
    marginBottom: 10,
    textAlign: "left",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
    height: 40,
  },
  inputSelected: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
    height: 40,
    backgroundColor : "#f5f5f5"
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  dropdown: {
    height: 40,
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    backgroundColor: "white",
  },
  containerForm: {
    width: "100%",
    marginTop: 5,
  },
});

export default AddLeadManual;
