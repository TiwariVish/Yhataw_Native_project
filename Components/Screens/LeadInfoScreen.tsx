import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { RootState } from "../../utils/store";
import ReminderBottomSheetModal from "../../Global/PopAndModels/ReminderBottomSheetModal";
import {
  assignToMembers,
  changeStage,
  getAllStage,
  getTeamList,
} from "./LeadInfoScreenService";
import StatusPop from "../../Global/PopAndModels/StatusPop";
import MemberPopOver from "../../Global/PopAndModels/MemberPopOver";
import AssignedMemberPop from "../../Global/PopAndModels/AssignedMemberPop";
import { getReminder } from "./DashboardService";
import RemarkPop from "../../Global/PopAndModels/RemarkPop";
import { useNavigation } from "@react-navigation/native";
import { LoginScreenNavigationProp } from "../type";
import { globalStyles } from "../../GlobalCss/GlobalStyles";
import FlipButtonBar from "../../Global/Components/FlipButtonBar";
import { Feather, FontAwesome } from "@expo/vector-icons";

const leadInfoStatus = [
  { id: 1, content: "Lead Info" },
  { id: 2, content: "Contact" },
  { id: 3, content: "Reminder" },
  { id: 4, content: "Site Visit" },
  { id: 5, content: "Remark" },
];

interface Member {
  id: string;
  name: string;
}

const LeadInfoScreen = () => {
  const { leadData } = useSelector((state: RootState) => state.auth);
  const { myLeadData } = useSelector((state: RootState) => state.auth);
  const [selectedCards, setSelectedCards] = useState<number[]>([1]);
  const [isVisible, setIsVisible] = useState(false);
  const [rminderisVisible, setRminderIsVisible] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [dropdownData, setDropdownData] = useState<any>([]);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [assignedToMembers, setAssignedToMembers] = useState<Member[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [dropdownItems, setDropdownItems] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isMemberModalVisible, setMemberModalVisible] = useState(false);
  const [isassineMemberModalVisible, setisassineMemberModalVisible] =
    useState(false);
  const { privileges } = useSelector((state: RootState) => state.auth);
  const [dashboardView] = useState<any>(["HR", "CRM", "MY-Dashboard", "ADMIN"]);
  const [allReminder, setAllRemider] = useState<any>([]);
  const [newRemarks, setNewRemarks] = useState([]);
  const [reminderLeads, setRemiderLeads] = useState([]);
  const navigation = useNavigation<LoginScreenNavigationProp>();

  useEffect(() => {
    getLeadStage();
  }, []);

  const getPermissionForView = () => {
    const permissionObj: Record<string, boolean> = {};
    dashboardView.forEach((view: string) => {
      const currVal = privileges[view];
      permissionObj[view] = currVal?.length ? true : false;
    });
    return permissionObj;
  };

  const permission = getPermissionForView();

  const getLeadStage = async () => {
    try {
      const [stageResponse, teamResponse, reminderResponse] = await Promise.all(
        [getAllStage(), getTeamList(), getReminder("")]
      );
      setDropdownData(stageResponse.data);
      setDropdownItems(teamResponse.data);
      setAllRemider(reminderResponse.data);
    } catch (error) {
      console.error("Error fetching lead stage:", error);
    }
  };

  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status);
    setModalVisible(true);
  };

  const handleSelectedTeamsChange = (teams: string[]) => {
    setSelectedTeams(teams);
    setMemberModalVisible(true);
  };


  const onSelectMember = (member: any) => {
    const selectedMembers: Member[] = 
      Array.isArray(member) && member.length > 0
        ? member.map((m) => ({ id: m._id, name: m.name }))
        : [];
    setAssignedToMembers((prevMembers) => {
      const selectedIds = selectedMembers.map(m => m.id);
      const uniqueMembers = [
        ...prevMembers,
        ...selectedMembers.filter(newMember => 
          !prevMembers.some(prevMember => prevMember.id === newMember.id)
        )
      ];
  
      return uniqueMembers;
    });
  };

  const handleCardPress = (id: number) => {
    setSelectedCards([id]);
  };

  const handleCare_addRemark = async (newRemark: any) => {
    setNewRemarks((prevRemarks) => [...prevRemarks, newRemark]);
    console.log("Remark Submitted: ", newRemark);
  };

  const handleChangeStage = async () => {
    try {
      let statusChanged = false;
      let membersChanged = false;
      const waitCallApi = [];

      if (myLeadData?._id && selectedStatus) {
        const bodyForStageChange = {
          id: myLeadData?._id,
          stage: selectedStatus,
        };
        waitCallApi.push(changeStage(bodyForStageChange));
        statusChanged = true;
      }

      if (leadData?._id && assignedToMembers && assignedToMembers.length > 0) {
        const assignedToUserIds = assignedToMembers
          .map((member) => member.id)
          .map((id) => `'${id}'`)
          .join(",");
        const bodyForAssignMembers = {
          id: leadData._id,
          AssignToUser: assignedToUserIds,
        };
        waitCallApi.push(assignToMembers(bodyForAssignMembers));
        membersChanged = true;
      }

      await Promise.all(waitCallApi);
  
      if (statusChanged && membersChanged) {
        alert("Your status and member assignment have been changed successfully.");
      } else if (statusChanged) {
        alert("Your status has been changed successfully.");
      } else if (membersChanged) {
        alert("Your member has been changed successfully.");
      }
      
      navigation.navigate("Leads");
    } catch (error) {
      console.error("Failed to process change or assign member:", error);
    }
  };

  const handleDialPress = useCallback((phoneNumber) => {
    const url = `tel:${phoneNumber}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          console.log("Phone dialer is not available");
        }
      })
      .catch((err) => console.error("Error opening dialer:", err));
  }, []);

  const handleNewReminder = async (newReminder: any) => {
    setRemiderLeads((prev) => [...prev, newReminder]);
  };
  const renderContent = () => {
    const renderLeadInfo = (data) => (
      <>
        <View>
          <Text
            style={[globalStyles.h5, globalStyles.fontfm]}
            allowFontScaling={false}
          >
            Lead ID
          </Text>
          <Text
            style={[globalStyles.h7, globalStyles.fontfm, styles.value]}
            allowFontScaling={false}
          >
            {data.uid}
          </Text>
        </View>
        <View>
          <Text
            style={[globalStyles.h5, globalStyles.fontfm]}
            allowFontScaling={false}
          >
            Project
          </Text>
          <Text
            style={[globalStyles.h7, globalStyles.fontfm, styles.value]}
            allowFontScaling={false}
          >
            {data.form_name}
          </Text>
        </View>
        <View>
          <Text
            style={[globalStyles.h5, globalStyles.fontfm]}
            allowFontScaling={false}
          >
            Source
          </Text>
          <Text
            style={[globalStyles.h7, globalStyles.fontfm, styles.value]}
            allowFontScaling={false}
          >
            {data.source}
          </Text>
        </View>
      </>
    );
    return (
      <>
        {selectedCards.includes(1) && (
          <View style={styles.infoContainer}>
            {permission?.ADMIN || permission.CRM ? (
              <View style={styles.row}>{renderLeadInfo(leadData)}</View>
            ) : (
              <View style={styles.row}>{renderLeadInfo(myLeadData)}</View>
            )}

            {permission?.ADMIN || permission.CRM ? (
              <>
                <Text
                  style={[globalStyles.h7, globalStyles.fontfm]}
                  allowFontScaling={false}
                >
                  Assigned To
                </Text>
                <TouchableOpacity
                  style={[styles.dropdown, styles.value]}
                  onPress={() => setMemberModalVisible(true)}
                >
                  <Text style={styles.dropdownText}>
                  {selectedTeams.length > 0 ? selectedTeams.join(', ') : "Select Team"}
                  </Text>
                  <Icon
                    name="chevron-down-outline"
                    size={20}
                    style={[
                      styles.dropdownIcon,
                      openDropdown === 1 && styles.dropdownIconOpen,
                    ]}
                  />
                </TouchableOpacity>
                <Text
                  style={[globalStyles.h7, globalStyles.fontfm]}
                  allowFontScaling={false}
                >
                  Assigned To Member
                </Text>
                <TouchableOpacity
                  style={[styles.dropdown, styles.value]}
                  onPress={() =>  setisassineMemberModalVisible(true)}
                >
                  <Text style={styles.dropdownText}>
                    {assignedToMembers.length > 0
                      ? assignedToMembers
                          .map((member) => member.name)
                          .join(", ")
                      : "Assigned To Member"}
                  </Text>
                  <Icon
                    name="chevron-down-outline"
                    size={20}
                    style={[
                      styles.dropdownIcon,
                      openDropdown === 2 && styles.dropdownIconOpen,
                    ]}
                  />
                </TouchableOpacity>
              </>
            ) : null}

            <Text
              style={[globalStyles.h7, globalStyles.fontfm]}
              allowFontScaling={false}
            >
              Status
            </Text>
            <TouchableOpacity
              style={[styles.dropdown, styles.value]}
              onPress={() => handleStatusSelect("")}
            >
              <Text style={styles.dropdownText}>
                {selectedStatus || "Select Status"}
              </Text>
              <Icon
                name="chevron-down-outline"
                size={20}
                style={[
                  styles.dropdownIcon,
                  openDropdown === 3 && styles.dropdownIconOpen,
                ]}
              />
            </TouchableOpacity>
          </View>
        )}

        {selectedCards.includes(2) && (
          <View style={styles.contactContainer}>
            <Text
              style={[globalStyles.h5, globalStyles.fontfm]}
              allowFontScaling={false}
            >
              Contact Info
            </Text>
            <View style={styles.contactInfo}>
              <View style={styles.infoRow}>
                <FontAwesome name="phone" size={16} color="#0078FF" />
                <Text
                  style={[
                    globalStyles.h7,
                    globalStyles.fontfm,
                    styles.valueContent,
                  ]}
                  allowFontScaling={false}
                >
                  {(selectedCards.includes(2) && permission.ADMIN) ||
                  permission.CRM
                    ? leadData.leadPhone
                    : myLeadData.leadPhone}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <FontAwesome name="envelope" size={16} color="#0078FF" />
                <Text
                  style={[
                    globalStyles.h7,
                    globalStyles.fontfm,
                    styles.valueContent,
                  ]}
                  allowFontScaling={false}
                >
                  {(selectedCards.includes(2) && permission.ADMIN) ||
                  permission.CRM
                    ? leadData.leadEmail
                    : myLeadData.leadEmail}
                </Text>
              </View>
            </View>
          </View>
        )}
        {selectedCards.includes(3) && (
          <View style={styles.containerRem}>
            <View style={styles.headerRem}>
              <Text
                style={[globalStyles.h5, globalStyles.fontfm]}
                allowFontScaling={false}
              >
                Reminders
              </Text>
              <TouchableOpacity onPress={() => setRminderIsVisible(true)}>
                <Text
                  style={[globalStyles.h7, globalStyles.fontfm, styles.addNew]}
                  allowFontScaling={false}
                >
                  Add New
                </Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.remindersList}>
              {reminderLeads.map((reminder, index) => (
                <View key={index} style={styles.reminderItem}>
                  <Text
                    style={[globalStyles.h7, globalStyles.fontfm]}
                    allowFontScaling={false}
                  >
                    {reminder.data.date}
                  </Text>
                  <Text
                    style={[globalStyles.h7, globalStyles.fontfm]}
                    allowFontScaling={false}
                  >
                    {reminder.data.title}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {selectedCards.includes(4) && (
          <View>
            <Text>NO DATA FOUND</Text>
          </View>
        )}
        {selectedCards.includes(5) && (
          <View style={styles.containerRem}>
            <View style={styles.headerRem}>
              <Text
                style={[globalStyles.h5, globalStyles.fontfm]}
                allowFontScaling={false}
              >
                Remark
              </Text>
              <TouchableOpacity onPress={() => setIsVisible(true)}>
                <Text
                  style={[globalStyles.h7, globalStyles.fontfm, styles.addNew]}
                  allowFontScaling={false}
                >
                  Add Remark
                </Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.remindersList}>
              {newRemarks.map((reminder, index) => (
                <View key={index} style={styles.reminderItem}>
                  <Text
                    style={[globalStyles.h7, globalStyles.fontfm]}
                    allowFontScaling={false}
                  >
                    {reminder.data.notes}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          {permission?.ADMIN || permission.CRM ? (
            <>
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <View style={styles.statusBadge}>
                    <Text
                      style={[styles.statusText, globalStyles.h8]}
                      allowFontScaling={false}
                    >
                      {leadData.stage}
                    </Text>
                  </View>
                  <Text
                    style={[globalStyles.h4, globalStyles.fs1]}
                    allowFontScaling={false}
                  >
                    {leadData.leadName}
                  </Text>
                  <Text
                    style={[globalStyles.h7, globalStyles.fontfm]}
                    allowFontScaling={false}
                  >
                    {leadData.project_name}
                  </Text>
                  <Text
                    style={[globalStyles.h7, globalStyles.fontfm]}
                    allowFontScaling={false}
                  >
                    {leadData.projecttype_name}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleDialPress(leadData.leadPhone)}
                >
                  <View style={styles.callIconCircle}>
                    <Feather name="phone-call" size={24} color="#00C853" />
                  </View>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <View style={styles.statusBadge}>
                  <Text
                    style={[styles.statusText, globalStyles.h8]}
                    allowFontScaling={false}
                  >
                    {myLeadData.stage}
                  </Text>
                </View>
                <Text
                  style={[globalStyles.h2, globalStyles.fs1]}
                  allowFontScaling={false}
                >
                  {myLeadData.leadName}
                </Text>
                <Text
                  style={[globalStyles.h7, globalStyles.fontfm]}
                  allowFontScaling={false}
                >
                  {myLeadData.project_name}
                </Text>
                <Text
                  style={[globalStyles.h7, globalStyles.fontfm]}
                  allowFontScaling={false}
                >
                  {myLeadData.projecttype_name}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleDialPress(myLeadData.leadPhone)}
              >
                <View style={styles.callIconCircle}>
                  <Feather name="phone-call" size={24} color="#00C853" />
                </View>
              </TouchableOpacity>
            </View>
          )}

          <FlipButtonBar
            segments={leadInfoStatus.map((item) => item.content)}
            style={{}}
            selectedSegment={
              selectedCards.length > 0
                ? leadInfoStatus[selectedCards[0] - 1]?.content
                : ""
            }
            onSegmentChange={(selectedContent) => {
              const selectedCard = leadInfoStatus.find(
                (item) => item.content === selectedContent
              );
              if (selectedCard) {
                handleCardPress(selectedCard.id);
              }
            }}
          />

          {renderContent()}
        </ScrollView>

        {selectedCards.includes(1) && (
          <View style={styles.submitButtonContainer}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                (selectedStatus ||
                  (assignedToMembers && assignedToMembers.length > 0)) &&
                  styles.activeSubmitButton,
              ]}
              onPress={() => handleChangeStage()}
              disabled={
                !(
                  selectedStatus ||
                  (assignedToMembers && assignedToMembers.length > 0)
                )
              }
            >
              <Text
                style={[
                  styles.submitButtonText,
                  globalStyles.h6,
                  globalStyles.fontfm,
                ]}
                allowFontScaling={false}
              >
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <AssignedMemberPop
        visible={isassineMemberModalVisible}
        onClose={() => setisassineMemberModalVisible(false)}
        onStatusSelect={onSelectMember}
        selectedMembers = {assignedToMembers}
      />
      <MemberPopOver
        visible={isMemberModalVisible}
        onClose={() => setMemberModalVisible(false)}
        onStatusSelect={handleSelectedTeamsChange}
      />
      <StatusPop
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onStatusSelect={handleStatusSelect}
      />
      <ReminderBottomSheetModal
        visible={rminderisVisible}
        onClose={() => setRminderIsVisible(false)}
        onSubmit={handleNewReminder}
      />

      <RemarkPop
        visible={isVisible}
        onClose={() => setIsVisible(false)}
        onSubmit={handleCare_addRemark}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F9FD",
  },
  scrollView: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  date: {
    color: "#888",
  },
  statusBadge: {
    backgroundColor: "#FF6B6B",
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
    marginTop: 5,
  },
  statusText: {
    color: "#FFF",
  },
  icon: {
    marginHorizontal: 10,
  },
  selectedCard: {
    backgroundColor: "#3D48E5",
  },
  infoContainer: {
    marginBottom: 20,
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 15,
    shadowColor: "transparent",
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  dropdownText: {
    color: "#333",
  },
  dropdownIcon: {
    marginLeft: 10,
    color: "#0078FF",
  },
  dropdownIconOpen: {
    transform: [{ rotate: "180deg" }],
  },
  value: {
    marginTop: 5,
  },
  contactContainer: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 15,
    shadowColor: "transparent",
  },
  contactInfo: {
    marginTop: 10,
  },
  valueContent: {
    marginLeft: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
  },
  containerRem: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 15,
    shadowColor: "transparent",
    marginBottom: 20,
  },
  headerRem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  remindersList: {
    maxHeight: 200,
  },
  reminderItem: {
    marginBottom: 15,
  },
  submitButtonContainer: {
    padding: 20,
  },
  submitButton: {
    height: 48,
    backgroundColor: "#C4C4C4",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  activeSubmitButton: {
    backgroundColor: "#3D48E5",
  },
  submitButtonText: {
    color: "white",
  },
  addNew: {
    color: "#3D48E5",
    fontWeight: "bold",
  },

  leftpush: {
    marginLeft: 30,
  },
  callIconCircle: {
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#00C853",
  },
});

export default LeadInfoScreen;
