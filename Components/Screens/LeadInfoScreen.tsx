import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { RootState } from "../../utils/store";
import ReminderBottomSheetModal from "../../Global/PopAndModels/ReminderBottomSheetModal";
import {
  assignToMembers,
  changeStage,
  getAllLeadHistory,
  getAllStage,
  getAllTeamData,
  getAllTeamMembersData,
  getTeamList,
} from "./LeadInfoScreenService";
import StatusPop from "../../Global/PopAndModels/StatusPop";
import MemberPopOver from "../../Global/PopAndModels/MemberPopOver";
import AssignedMemberPop from "../../Global/PopAndModels/AssignedMemberPop";
import { getReminder } from "./DashboardService";
import RemarkPop from "../../Global/PopAndModels/RemarkPop";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { LoginScreenNavigationProp, RootStackParamList } from "../type";
import { globalStyles } from "../../GlobalCss/GlobalStyles";
import FlipButtonBar from "../../Global/Components/FlipButtonBar";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { getRemark, getReminderCall } from "./LeadsService";

const leadInfoStatus = [
  { id: 1, content: "Lead Info" },
  { id: 2, content: "Activities" },
  { id: 3, content: "Reminder" },
  { id: 4, content: "Notes" },
];

interface Member {
  id: string;
  name: string;
}

const LeadInfoScreen = () => {
  type RouteProps = RouteProp<RootStackParamList, "LeadInfoScreen">;
  const route = useRoute<RouteProps>();
  const selectedCardDataShow = route.params?.selectedCard || null;
  const {
    leadData,
    myLeadData,
    teamLeadData,
    myLeadProspectShow,
    myLeadOpportunity,
    myLeadClosure,
    allContectMy,
  } = useSelector((state: RootState) => state.auth);

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
  const [isAllAssinetoMember, setAllAssineTomember] = useState([]);
  const [leadHistory, setLeadHistory] = useState<any>([]);
  const [allRemiderSet, setAllRemiderSet] = useState<any>([]);
  const [allNoteSet, setAllNoteSet] = useState<any>([]);

  const check = isAllAssinetoMember
    .map((item) =>
      item.sub_teams.flatMap((sub) => sub.team_members.map((mem) => mem.userId))
    )
    .flat();

  const [isMemberModalVisible, setMemberModalVisible] = useState(false);
  const [isassineMemberModalVisible, setisassineMemberModalVisible] =
    useState(false);
  const { privileges } = useSelector((state: RootState) => state.auth);
  const [dashboardView] = useState<any>(["HR", "CRM", "MY-Dashboard", "ADMIN"]);
  const [allReminder, setAllRemider] = useState<any>([]);
  const [newRemarks, setNewRemarks] = useState([]);
  const [userData, setUserData] = useState<any[]>([]);
  const [reminderLeads, setRemiderLeads] = useState([]);
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const assignToIds = leadData.AssignTo.map((item) => item._id);

  useEffect(() => {
    getLeadStage();
    getAllTeamDataMember();
    fetchMemberLeadStage(assignToIds, leadData._id);
    historyResponse();
  }, []);

  useEffect(() => {
    handleReminder();
  }, []);

  const fetchMemberLeadStage = async (ids: string[], id: string) => {
    try {
      const payload = {
        team_id: ids,
        lead_id: id,
      };
      const res = await getAllTeamMembersData(payload);
      if (!res.data || !Array.isArray(res.data)) {
        console.error("Invalid data structure returned from the API");
        return;
      }
      const members = res.data
        .map((team) =>
          team.team_members.map((member) => ({
            ...member,
            name: member.users[0].name,
            checked: member.is_available === 1,
          }))
        )
        .flat();
      setUserData(members);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const getPermissionForView = () => {
    const permissionObj: Record<string, boolean> = {};
    dashboardView.forEach((view: string) => {
      const currVal = privileges[view];
      permissionObj[view] = currVal?.length ? true : false;
    });
    return permissionObj;
  };

  const permission = getPermissionForView();
  const privilegesData = getPermissionForView();

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
  const truncateText = (text: string, limit: number) => {
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  const handleSelectedTeamsChange = (teams: string[]) => {
    setSelectedTeams(teams);
    setMemberModalVisible(true);
  };

  const onSelectMember = (member: any[]) => {
    const selectedMembers = Array.isArray(member)
      ? member.map((m) => ({ id: m._id, name: m.name }))
      : [];

    setAssignedToMembers((prevMembers) => {
      const selectedIds = selectedMembers.map((m) => m.id);
      const updatedMembers = prevMembers.filter((prevMember) =>
        selectedIds.includes(prevMember.id)
      );
      const uniqueMembers = [
        ...updatedMembers,
        ...selectedMembers.filter(
          (newMember) =>
            !updatedMembers.some((member) => member.id === newMember.id)
        ),
      ];
      return uniqueMembers;
    });
  };

  const handleCardPress = (id: number) => {
    setSelectedCards([id]);
  };

  const handleCare_addRemark = async (newRemark: any) => {
    setNewRemarks((prevRemarks) => [...prevRemarks, newRemark]);
  };

  const getAllTeamDataMember = async () => {
    try {
      const res = await getAllTeamData(leadData._id);

      setAllAssineTomember(res.data);
    } catch (error) {}
  };

  const handleReminder = async () => {
    let selectedData;

    if (selectedCardDataShow === 1) {
      selectedData = leadData;
    } else if (allContectMy === 2) {
      selectedData = allContectMy;
    } else if (selectedCardDataShow === 3) {
      selectedData = myLeadData;
    } else if (selectedCardDataShow === 4 || selectedCardDataShow === 5) {
      selectedData = myLeadOpportunity;
    } else if (selectedCardDataShow === 6) {
      selectedData = myLeadClosure;
    } else {
      selectedData = teamLeadData;
    }

    try {
      if (selectedData?._id) {
        const response = await getReminderCall(selectedData._id);
        setAllRemiderSet(response.data);
        const res = await getRemark(selectedData._id);
        setAllNoteSet(res.data);
      } else {
        console.warn("Invalid data: _id is missing");
      }
    } catch (error) {
      console.error("Error fetching reminder:", error);
    }
  };

  const historyResponse = async () => {
    const selectedData =
      selectedCardDataShow === 1
        ? leadData
        : selectedCardDataShow === 3
        ? myLeadData
        : selectedCardDataShow === 4
        ? myLeadOpportunity
        : selectedCardDataShow === 5
        ? myLeadOpportunity
        : selectedCardDataShow === 6
        ? myLeadClosure
        : teamLeadData;

    if (selectedData && selectedData._id) {
      try {
        const res = await getAllLeadHistory(selectedData._id);
        setLeadHistory(res.data);
        console.log(res, "Lead History Response");
      } catch (error) {
        console.error("Error fetching lead history:", error);
      }
    } else {
      console.error("Invalid lead data: Missing _id");
    }
  };

  const handleChangeStage = async () => {
    try {
      let statusChanged = false;
      let membersChanged = false;
      const waitCallApi = [];
      const selectedLeadData =
        selectedCardDataShow === 1
          ? leadData
          : selectedCardDataShow === 2
          ? allContectMy
          : selectedCardDataShow === 3
          ? myLeadData
          : selectedCardDataShow === 4
          ? myLeadOpportunity
          : selectedCardDataShow === 5
          ? myLeadOpportunity
          : selectedCardDataShow === 6
          ? myLeadClosure
          : teamLeadData;

      if (
        selectedLeadData?._id &&
        selectedStatus &&
        selectedStatus !== selectedLeadData?.stage
      ) {
        const bodyForStageChange = {
          id: selectedLeadData?._id,
          stage: selectedStatus,
        };
        waitCallApi.push(changeStage(bodyForStageChange));
        statusChanged = true;
      } else if (leadData?._id && assignedToMembers) {
        const currentAssignedIds = leadData.AssignTo.map((item) => item._id);
        // const newAssignedIds = assignedToMembers.map((member) => member.id);
        // const newAssignedIds = userData.map((mem) =>mem.userId)

        const newAssignedIds = userData
          .filter((mem) =>
            assignedToMembers.some((assigned) => assigned.id === mem._id)
          )
          .map((mem) => mem.userId);

        const membersAreSame =
          currentAssignedIds.length === newAssignedIds.length &&
          currentAssignedIds.every((id) => newAssignedIds.includes(id));
        if (!membersAreSame) {
          const assignedToUserIds = newAssignedIds
            .map((id) => `'${id}'`)
            .join(",");
          const bodyForAssignMembers = {
            id: leadData._id,
            AssignToUser: assignedToUserIds,
          };
          waitCallApi.push(assignToMembers(bodyForAssignMembers));
          membersChanged = true;
        }
      }
      await Promise.all(waitCallApi);
      if (statusChanged && membersChanged) {
        alert(
          "Your status and member assignment have been changed successfully."
        );
      } else if (statusChanged) {
        alert("Your status has been changed successfully.");
      } else if (membersChanged) {
        alert("Your member assignment has been changed successfully.");
      } else {
        alert("No changes detected.");
      }
      if (statusChanged || membersChanged) {
        if (selectedCardDataShow === 1) {
          navigation.navigate("AllLeadScreen");
        } else if (![3, 4, 5, 6].includes(selectedCardDataShow)) {
          navigation.navigate("TeamLead");
        } else {
          navigation.navigate("Leads");
        }
      }
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
        <View style={styles.container}>
  {/* First Row */}
  <View style={styles.row}>
    <View style={styles.item}>
      <Text style={[globalStyles.h7, globalStyles.fontfm, globalStyles.tc2]} allowFontScaling={false}>
        Lead ID
      </Text>
      <Text style={[globalStyles.h6, globalStyles.fs1, globalStyles.tc, styles.value]} allowFontScaling={false}>
        {data.uid}
      </Text>
    </View>

    <View style={styles.item}>
      <Text style={[globalStyles.h7, globalStyles.fontfm, globalStyles.tc2]} allowFontScaling={false}>
        Project
      </Text>
      <Text
        style={[globalStyles.h6, globalStyles.fs1, globalStyles.tc, styles.value]}
        allowFontScaling={false}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {data.form_name.split(" ").length < 2
          ? data.form_name
          : data.form_name.split(" ").slice(0, 2).join(" ") + "..."}
      </Text>
    </View>

    <View style={[styles.item, { justifyContent: "flex-end",alignItems: "flex-end" }]}>
      <Text style={[globalStyles.h7, globalStyles.fontfm, globalStyles.tc2]} allowFontScaling={false}>
        Source
      </Text>
      <Text style={[globalStyles.h6, globalStyles.fs1, globalStyles.tc, styles.value]} allowFontScaling={false}>
        {data.source}
      </Text>
    </View>
  </View>

  {/* Second Row - Contact Us Section */}
  <View style={styles.contactContainer}>
    <Text style={[globalStyles.h6, globalStyles.fs1, globalStyles.tc]} allowFontScaling={false}>
      Contact Us
    </Text>
    <View style={styles.contactInfo}>
      <View style={styles.infoRow}>
        <FontAwesome name="phone" size={16} color="#0078FF" />
        <Text
          style={[globalStyles.h7, globalStyles.fs2, styles.valueContent, globalStyles.tc]}
          allowFontScaling={false}
        >
          {(selectedCards.includes(2) && permission.ADMIN) || permission.CRM ? leadData.leadPhone : myLeadData.leadPhone}
        </Text>
      </View>
      <View style={styles.infoRow}>
        <FontAwesome name="envelope" size={16} color="#0078FF" />
        <Text
          style={[globalStyles.h7, globalStyles.fs2, styles.valueContent, globalStyles.tc]}
          allowFontScaling={false}
        >
          {(selectedCards.includes(2) && permission.ADMIN) || permission.CRM ? leadData.leadEmail : myLeadData.leadEmail}
        </Text>
      </View>
    </View>
  </View>
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

            {permission?.ADMIN ||
            permission.CRM ||
            selectedCardDataShow === null ? (
              <>
                <View>
                  <Text
                    style={[
                      globalStyles.h7,
                      globalStyles.fontfm,
                      styles.dropdownText,
                    ]}
                    allowFontScaling={false}
                  >
                    Assigned To
                  </Text>
                  <TouchableOpacity
                    style={[styles.dropdown]}
                    onPress={() => setMemberModalVisible(true)}
                  >
                    <Text
                      style={[
                        globalStyles.h7,
                        globalStyles.fontfm,
                        globalStyles.tc,
                      ]}
                      allowFontScaling={false}
                    >
                      {selectedTeams.length > 0
                        ? selectedTeams.join(", ")
                        : "Select Team"}
                    </Text>
                    <Icon
                      name="chevron-down-outline"
                      size={24}
                      style={[
                        styles.dropdownIcon,
                        openDropdown === 1 && styles.dropdownIconOpen,
                      ]}
                    />
                  </TouchableOpacity>
                  <Text
                    style={[
                      globalStyles.h7,
                      globalStyles.fontfm,
                      styles.dropdownText,
                    ]}
                    allowFontScaling={false}
                  >
                    Assigned To Member
                  </Text>
                  <TouchableOpacity
                    style={[styles.dropdown]}
                    onPress={() => setisassineMemberModalVisible(true)}
                  >
                    <Text
                      style={[
                        globalStyles.h7,
                        globalStyles.fontfm,
                        globalStyles.tc,
                        styles.textWrap,
                      ]}
                      allowFontScaling={false}
                    >
                      {assignedToMembers.length > 0
                        ? assignedToMembers
                            .map((member) => member.name)
                            .join(", ")
                        : "Assigned To Member"}
                    </Text>
                    <Icon
                      name="chevron-down-outline"
                      size={24}
                      style={[
                        styles.dropdownIcon,
                        openDropdown === 2 && styles.dropdownIconOpen,
                      ]}
                    />
                  </TouchableOpacity>
                </View>
              </>
            ) : null}
            {selectedCardDataShow === 2 || selectedCardDataShow === 3 || selectedCardDataShow === 1 ? (
              <View>
                <Text
                  style={[
                    globalStyles.h7,
                    globalStyles.fontfm,
                    styles.dropdownText,
                  ]}
                  allowFontScaling={false}
                >
                  Status
                </Text>
                <TouchableOpacity
                  style={[styles.dropdown]}
                  onPress={() => handleStatusSelect("")}
                >
                  <Text
                    style={[
                      globalStyles.h7,
                      globalStyles.fontfm,
                      globalStyles.tc,
                    ]}
                    allowFontScaling={false}
                  >
                    {selectedStatus || "Select Status"}
                  </Text>
                  <Icon
                    name="chevron-down-outline"
                    size={24}
                    style={[
                      styles.dropdownIcon,
                      openDropdown === 3 && styles.dropdownIconOpen,
                    ]}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              ""
            )}
          </View>
        )}

        {selectedCards.includes(2) && leadHistory.length > 0
          ? leadHistory.map((item: any, index: number) => (
              <View key={index} style={styles.itemContainer}>
                {/* Timeline Indicator */}
                <View style={styles.timeline}>
                  <Feather name="circle" size={10} color="#007bff" />
                  {index !== leadHistory.length - 1 && (
                    <View style={styles.line} />
                  )}
                </View>

                {/* Content */}
                <View style={styles.content}>
                  <Text style={styles.title}>{item.new_value}</Text>
                  <Text style={styles.description}>
                    Lead status changed by {item?.users[0]?.name}
                  </Text>
                  <Text style={styles.time}>
                    {" "}
                    {new Date(item.updatedAt).toLocaleString()}
                  </Text>
                </View>
              </View>
            ))
          : ""}

        {selectedCards.includes(3) && (
          <View style={[styles.containerRem, { width: "100%" }]}>
            {/* Header Section */}
            <View style={styles.headerRem}>
              <Text
                style={[globalStyles.h6, globalStyles.fs1, globalStyles.tc]}
                allowFontScaling={false}
              >
                Reminders
              </Text>
              <TouchableOpacity onPress={() => setRminderIsVisible(true)}>
                <Text
                  style={[
                    globalStyles.h7,
                    globalStyles.fontfm,
                    globalStyles.tc3,
                  ]}
                  allowFontScaling={false}
                >
                  Add New
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal contentContainerStyle={{ flexGrow: 1 }}>
              <View
                style={{
                  minWidth: "100%",
                  alignItems: "center",
                  marginTop: 20,
                }}
              >
                <View style={[styles.row, styles.mytableHeade]}>
                  <Text
                    style={[globalStyles.h7, globalStyles.fs1, { flex: 1 }]}
                    allowFontScaling={false}
                  >
                    Title
                  </Text>
                  <Text
                    style={[
                      globalStyles.h7,
                      globalStyles.fs1,
                      { flex: 1, textAlign: "center" },
                    ]}
                    allowFontScaling={false}
                  >
                    User Name
                  </Text>
                  <Text
                    style={[
                      globalStyles.h7,
                      globalStyles.fs1,
                      { flex: 1, textAlign: "right" },
                    ]}
                    allowFontScaling={false}
                  >
                    Date
                  </Text>
                </View>

                {allRemiderSet.map((item) => (
                  <View
                    key={item.id}
                    style={[
                      styles.row,
                      { justifyContent: "space-between", width: "100%" },
                    ]}
                  >
                    <Text
                      style={[
                        globalStyles.h8,
                        globalStyles.fs1,
                        { width: 110 },
                      ]}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      allowFontScaling={false}
                    >
                      {truncateText(item.title, 15)}
                    </Text>

                    <View
                      style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={[
                          globalStyles.h8,
                          globalStyles.fs1,
                          { textAlign: "center" },
                        ]}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        allowFontScaling={false}
                      >
                        {item.user_name}
                      </Text>
                    </View>

                    <Text
                      style={[
                        globalStyles.h8,
                        globalStyles.fs1,
                        { flex: 1, textAlign: "right" },
                      ]}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      allowFontScaling={false}
                    >
                      {item.date}
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {selectedCards.includes(4) && (
          <View style={[styles.containerRem, { width: "100%" }]}>
            {/* Header Section */}
            <View style={styles.headerRem}>
              <Text
                style={[globalStyles.h6, globalStyles.fs1, globalStyles.tc]}
                allowFontScaling={false}
              >
                Note
              </Text>
              <TouchableOpacity onPress={() => setIsVisible(true)}>
                <Text
                  style={[
                    globalStyles.h7,
                    globalStyles.fontfm,
                    globalStyles.tc3,
                  ]}
                  allowFontScaling={false}
                >
                  Add Note
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal contentContainerStyle={{ flexGrow: 1 }}>
              <View
                style={{
                  minWidth: "100%",
                  alignItems: "center",
                  marginTop: 20,
                }}
              >
                <View style={[styles.row, styles.mytableHeade]}>
                  <Text
                    style={[globalStyles.h7, globalStyles.fs1, { flex: 1 }]}
                    allowFontScaling={false}
                  >
                    Note
                  </Text>
                  <Text
                    style={[
                      globalStyles.h7,
                      globalStyles.fs1,
                      { flex: 1, textAlign: "center" },
                    ]}
                    allowFontScaling={false}
                  >
                    User Name
                  </Text>
                  <Text
                    style={[
                      globalStyles.h7,
                      globalStyles.fs1,
                      { flex: 1, textAlign: "right" },
                    ]}
                    allowFontScaling={false}
                  >
                    Date
                  </Text>
                </View>

                {allNoteSet.map((item) => (
                  <View
                    key={item.id}
                    style={[
                      styles.row,
                      { justifyContent: "space-between", width: "100%" },
                    ]}
                  >
                    <Text
                      style={[
                        globalStyles.h8,
                        globalStyles.fs1,
                        { width: 110 },
                      ]}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      allowFontScaling={false}
                    >
                      {truncateText(item.notes, 15)}
                    </Text>

                    <View
                      style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={[
                          globalStyles.h8,
                          globalStyles.fs1,
                          { textAlign: "center" },
                        ]}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        allowFontScaling={false}
                      >
                        {item.user_name}
                      </Text>
                    </View>

                    <Text
                      style={[
                        globalStyles.h8,
                        globalStyles.fs1,
                        { flex: 1, textAlign: "right" },
                      ]}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      allowFontScaling={false}
                    >
                      {item.date}
                    </Text>
                  </View>
                ))}
              </View>
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
                      style={[globalStyles.h8, globalStyles.tc4]}
                      allowFontScaling={false}
                    >
                      {leadData.stage.charAt(0).toUpperCase() +
                        leadData.stage.slice(1)}
                    </Text>
                  </View>
                  <Text
                    style={[globalStyles.h6, globalStyles.fs1, globalStyles.tc]}
                    allowFontScaling={false}
                  >
                    {leadData.leadName}
                  </Text>
                  <Text
                    style={[
                      globalStyles.tc2,
                      globalStyles.h8,
                      globalStyles.tc2,
                    ]}
                    allowFontScaling={false}
                  >
                    {leadData.project_name}
                  </Text>
                  <Text
                    style={[
                      globalStyles.tc2,
                      globalStyles.h8,
                      globalStyles.tc2,
                    ]}
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
            //           <View style={styles.header}>
            //             <View style={styles.headerLeft}>
            //               <View style={styles.statusBadge}>
            //                 <Text
            //                   style={[globalStyles.h8, globalStyles.tc4]}
            //                   allowFontScaling={false}
            //                 >
            //                 {myLeadData?.stage
            // ? myLeadData.stage.charAt(0).toUpperCase() + myLeadData.stage.slice(1)
            // : ""}
            //                 </Text>
            //               </View>
            //               <Text
            //                 style={[globalStyles.h2, globalStyles.fs1]}
            //                 allowFontScaling={false}
            //               >
            //                 {myLeadData.leadName}
            //               </Text>
            //               <Text
            //                 style={[globalStyles.h7, globalStyles.fontfm]}
            //                 allowFontScaling={false}
            //               >
            //                 {myLeadData.project_name}
            //               </Text>
            //               <Text
            //                 style={[globalStyles.h7, globalStyles.fontfm]}
            //                 allowFontScaling={false}
            //               >
            //                 {myLeadData.projecttype_name}
            //               </Text>
            //             </View>
            //             <TouchableOpacity
            //               onPress={() => handleDialPress(myLeadData.leadPhone)}
            //             >
            //               <View style={styles.callIconCircle}>
            //                 <Feather name="phone-call" size={24} color="#00C853" />
            //               </View>
            //             </TouchableOpacity>
            //           </View>)}

            (() => {
              const selectedLeadData =
                selectedCardDataShow === 2
                  ? allContectMy
                  : selectedCardDataShow === 3
                  ? myLeadData
                  : selectedCardDataShow === 4
                  ? myLeadProspectShow
                  : selectedCardDataShow === 5
                  ? myLeadOpportunity
                  : selectedCardDataShow === 6
                  ? myLeadClosure
                  : selectedCardDataShow === null
                  ? teamLeadData
                  : "";

              return (
                <View style={styles.header}>
                  <View style={styles.headerLeft}>
                    <View style={styles.statusBadge}>
                      <Text
                        style={[globalStyles.h8, globalStyles.tc4]}
                        allowFontScaling={false}
                      >
                        {selectedLeadData?.stage
                          ? selectedLeadData?.stage.charAt(0).toUpperCase() +
                            selectedLeadData?.stage.slice(1)
                          : ""}
                      </Text>
                    </View>
                    <Text
                      style={[globalStyles.h2, globalStyles.fs1]}
                      allowFontScaling={false}
                    >
                      {selectedLeadData?.leadName ?? ""}
                    </Text>
                    <Text
                      style={[globalStyles.h7, globalStyles.fontfm]}
                      allowFontScaling={false}
                    >
                      {selectedLeadData?.project_name ?? ""}
                    </Text>
                    <Text
                      style={[globalStyles.h7, globalStyles.fontfm]}
                      allowFontScaling={false}
                    >
                      {selectedLeadData?.projecttype_name ?? ""}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      if (selectedLeadData?.leadPhone) {
                        handleDialPress(selectedLeadData.leadPhone);
                      } else {
                        console.warn("Lead phone number is missing");
                      }
                    }}
                  >
                    <View style={styles.callIconCircle}>
                      <Feather name="phone-call" size={24} color="#00C853" />
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })()
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
        selectedMembers={assignedToMembers}
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
        onSubmit={(newReminder) => {
          handleNewReminder(newReminder);
          handleReminder(); 
        }}

        selectedCardDataShow={selectedCardDataShow}
      />

      <RemarkPop
        visible={isVisible}
        onClose={() => setIsVisible(false)}
        onSubmit={(newRemark) => {
          handleCare_addRemark(newRemark);
          handleReminder(); 
        }}
        selectedCardDataShow={selectedCardDataShow}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    padding: 10,
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
    backgroundColor: "#FF8690",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    marginBottom: 3,
    minWidth: 67,
    minHeight: 23,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    marginHorizontal: 10,
  },
  selectedCard: {
    backgroundColor: "#3D48E5",
  },
  infoContainer: {
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
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
    minHeight: 42,
  },
  textWrap: {
    flex: 1,
    flexWrap: "wrap",
    alignItems: "center",
  },

  dropdownIcon: {
    marginLeft: 10,
    color: "#0078FF",
    alignItems: "center",
  },
  dropdownIconOpen: {
    transform: [{ rotate: "180deg" }],
  },
  value: {
    marginVertical: 15,
  },
  contactContainer: {
    backgroundColor: "#FFFFFF",
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
  dropdownText: {
    padding: 5,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    // marginBottom: 20,
  },
  timeline: {
    alignItems: "center",
    width: 20,
    marginTop :20
  },
  line: {
    height: 40,
    width: 2,
    backgroundColor: "#007bff",
    marginTop: 5,
  },
  content: {
    flex: 1,
    paddingLeft: 10,
    marginTop:20
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
  time: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },

  mytableHeade: {
    justifyContent: "space-between",
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 5,
  },
  item: {
    width: "33%", // Adjust width so three items fit in one row
  },

});

export default LeadInfoScreen;
