import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
  RefreshControl,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { LoginScreenNavigationProp } from "../type";
import {
  getAllTeamLeads,
  getAllUsers,
  getDataAllLead,
  getDataAttendance,
  getDataMyAttendance,
  getDataMylead,
  getDataProject,
  getPerosnalOffice,
  getTeamList,
  getTeamUserWise,
  getTeamWiseMember,
} from "./DashboardService";
import { locationType } from "../../Models/Interface";
import store, { RootState } from "../../utils/store";
import { selectRole, setLeadId } from "../../Redux/authSlice";
import { useDispatch } from "react-redux";
import { getPerosnalDetails } from "./MyProfileService";
import { DashboardSkeleton } from "../../Global/Components/SkeletonStructures";
import { useSelector } from "react-redux";
import { globalStyles } from "../../GlobalCss/GlobalStyles";
import CustomCardNew from "../../NewDesine/GlobalComponets/CustomCardNew";
import FotterDseine from "../../NewDesine/GlobalComponets/FotterDseine";
import CustomBigCard from "../../NewDesine/GlobalComponets/CustomBigCard";
import Footer from "../../Global/Components/Footer";
import {
  getAllMyLeadContactStage,
  getAllMyLeadStageLead,
  getAllUsersMyLead,
  getLeadStageOpportunity,
  getLeadStageProspect,
} from "./LeadsService";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const projectData = [
  {
    id: "PN0001265",
    title: "Medical App (iOS native)",
    createdDate: "Sep 12, 2020",
    priority: "Medium",
    projectData: {
      tasks: 40,
      activeTasks: 13,
      assignees: [
        { id: 1, name: "any", imageUrl: require("../../assets/user_icon.png") },
        { id: 2, name: "any", imageUrl: require("../../assets/user_icon.png") },
      ],
    },
  },
  {
    id: "PN0001435",
    title: "Medical App (iOS native)",
    createdDate: "Sep 12, 2020",
    priority: "High",
    projectData: {
      tasks: 40,
      activeTasks: 13,
      assignees: [
        { id: 1, imageUrl: require("../../assets/user_icon.png") },
        { id: 2, imageUrl: require("../../assets/user_icon.png") },
        { id: 3, imageUrl: require("../../assets/user_icon.png") },
      ],
    },
  },
];

const staticData = {
  leads: [
    {
      id: 7,
      content: "Lead",
      cardColor: "#E3C9FF",
      calendarBackgroundColor: "#E3C9FF",
      leadDataKey: "",
      myleadKey: "total",
      lead_my_pipeline_count: "",
    },

    {
      id: 2,
      content: "Contact",
      cardColor: "#E8B86D",
      calendarBackgroundColor: "#E8B86D",
      leadDataKey: "lead_total_new_count",
      myleadKey: "total",
      lead_my_pipeline_count: "",
    },
    {
      id: 4,
      content: "Prospect",
      cardColor: "#99e6ff",
      calendarBackgroundColor: "#91DDCF",
      leadDataKey: "",
      myleadKey: "total",
      lead_my_pipeline_count: "",
    },
    {
      id: 5,
      content: "Opportunity",
      cardColor: "#FFF3DF",
      calendarBackgroundColor: "#F19ED2",
      leadDataKey: "lead_total_pipeline_count",
      myleadKey: "total",
    },

    {
      id: 6,
      content: "Closure",
      cardColor: "#FFEFEC",
      calendarBackgroundColor: "#F6B0B0",
      leadDataKey: "lead_my_not_answered_count",
      myleadKey: "lead_my_not_answered_count",
      visit_done_count: "lead_total_visit_done_count",
    },
  ],
  attendance: [
    {
      id: 1,
      content: "Present",
      attendanceKey: "attendence_present_today",
      countMy_Attendance: "attendence_my_current_month_present",
      calendarBackgroundColor: "#98C7D9",
    },
    {
      id: 2,
      content: "Absent",
      attendanceKey: "attendence_absent_today",
      countMy_Attendance: "attendence_my_current_month_absent",
      calendarBackgroundColor: "#B5E7AC",
    },
    {
      id: 3,
      content: "Late",
      attendanceKey: "attendence_late_today",
      countMy_Attendance: "attendence_my_current_month_late",
      calendarBackgroundColor: "#E3C9FF",
    },
    {
      id: 4,
      content: "Leave",
      attendanceKey: "attendence_leave_today",
      countMy_Attendance: "attendence_my_current_month_leave",
      calendarBackgroundColor: "#FF9B9B",
    },
  ],
  myProjects: [
    // { id: 1, content: "Commercial", projectKey: "projects_commercial" },
    // { id: 2, content: "Residential", projectKey: "projects_residencial" },
    {
      id: "PN0001265",
      title: "Medical App (iOS native)",
      createdDate: "Sep 12, 2020",
      priority: "Medium",
      projectData: {
        tasks: 40,
        activeTasks: 13,
        assignees: [
          {
            id: 1,
            name: "any",
            imageUrl: require("../../assets/user_icon.png"),
          },
          {
            id: 2,
            name: "any",
            imageUrl: require("../../assets/user_icon.png"),
          },
        ],
      },
    },
    {
      id: "PN0001435",
      title: "Medical App (iOS native)",
      createdDate: "Sep 12, 2020",
      priority: "High",
      projectData: {
        tasks: 40,
        activeTasks: 13,
        assignees: [
          { id: 1, imageUrl: require("../../assets/user_icon.png") },
          { id: 2, imageUrl: require("../../assets/user_icon.png") },
          { id: 3, imageUrl: require("../../assets/user_icon.png") },
        ],
      },
    },
  ],
};

interface CustomProps {
  handleClose?: () => void;
  location: locationType;
}

const Dashboard: React.FC<CustomProps> = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const dispatch = useDispatch();
  const [dashboardData, setDashboardData] = useState<any>({
    project: [],
    allLead: [],
    attendance: [],
  });
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 25,
    page: 0,
  });
  const [dashboardAllLead, setDashboardAllLead] = useState<any>([]);
  const [memberdropdownItems, setMemberDropdownItems] = useState<any>([]);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [dashboardDataMyLead, setDashboardDataMyLead] = useState<any>([]);
  const [dashboardDataProject, setDashboardDataProject] = useState<any>([]);
  const [dashboardDataAttendance, setDashboardDataAttendance] = useState<any>(
    []
  );
  const [teamLeadData, setTeamLeadData] = useState<any>([]);
  const [dashboardDataAllLead, setDashboardDataAllLead] = useState<any>([]);
  const [dashboardView, setDashboardView] = useState<any>([
    "HR",
    "CRM",
    "MY-Dashboard",
    "ADMIN",
  ]);

  const [teamData, setTeamData] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamWiseMember, setTeamWiseMember] = useState([]);
  const roleFromRedux = useSelector(selectRole);
  const [userRole, setUserRole] = useState<any>();
  const [refreshing, setRefreshing] = useState(false);
  const [userType, setUserType] = useState<string>("0");
  const [myleadSatgeShow, setMyLeadSatge] = useState<any>([]);
  const [allContect, setAllContectData] = useState<any>([]);
  const [myLeadProspect, setLeadProspect] = useState<any>([]);
   const [myLeadStageOpportunity, setLeadStageOpportunity] = useState<any>([]);
  

  const userId = store.getState().auth;
  const { authenticated, role, privileges } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    getUserMatch();
  }, []);

  useEffect(() => {
    if (userType === "0") {
      featchAllData();
    }
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const permission = getPermissionForView();
        const apiCallBasedOnPermissionForView = [];
        if (permission.ADMIN || permission.CRM) {
          apiCallBasedOnPermissionForView.push(getValuepermission());
          apiCallBasedOnPermissionForView.push(fetchMy_Attendance());
        }
        if (permission.HR || permission["MY-Dashboard"]) {
          apiCallBasedOnPermissionForView.push(fetchMy_Attendance());
          // apiCallBasedOnPermissionForView.push(fetchMyDashboardData());
        }
        apiCallBasedOnPermissionForView.push(fetchDashboardCRM());
        apiCallBasedOnPermissionForView.push(fetchUserData());

        await Promise.all(apiCallBasedOnPermissionForView);
      } catch (error) {
        console.error("Error in useEffect:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    getDataAllLeadData();
    getMemberLeadStage();
  }, []);
  const getDataAllLeadData = async () => {
    try {
      const payload = {
        userId: store.getState().auth.userId,
        startDate: "",
        endDate: "",
        page: paginationModel.pageSize,
        pageSize: paginationModel.pageSize,
        teamId: "",
        search: "",
      };

      const resLead = await getAllUsers(payload);
      setDashboardAllLead(resLead.metadata[0]);
    } catch (error) {}
  };

  const getMemberLeadStage = async () => {
    try {
      const res = await getTeamList();
      setMemberDropdownItems(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getPermissionForView = () => {
    const permissionObj: Record<string, boolean> = {};
    dashboardView?.forEach((view: string) => {
      const currVal = privileges[view];
      permissionObj[view] = currVal?.length ? true : false || false;
    });
    return permissionObj;
  };
  // console.log(
  //   getPermissionForView(),
  //   "log for privalages in the dashboard :::::",
  //   privileges
  // );
  const permission = getPermissionForView();
  const getValuepermission = async () => {
    setLoading(true);
    try {
      const [allLead, project, attendance] = await Promise.all([
        getDataAllLead(userId),
        getDataProject(),
        getDataAttendance(),
      ]);
      setDashboardData({
        allLead: allLead?.data[0] || [],
        project: project?.data[0] || [],
        attendance: attendance?.data[0] || [],
      });

      const res2 = await getTeamUserWise(store.getState().auth?.userId);
      setTeamData(res2.data);
    } catch (error) {
      console.error("Error fetching data", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchMy_Attendance = async () => {
    try {
      const response = await getDataMyAttendance(store.getState().auth?.userId);
      setDashboardDataAttendance(response?.data[0] || []);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const fetchMyDashboardData = async () => {
    try {
      const payload = {
        userId: store.getState().auth.userId,
        pageNo: "",
        pageSize: paginationModel.pageSize,
      };
      const [myLeads, projects, teamLead] = await Promise.all([
        getAllUsersMyLead(payload),
        getDataProject(),
        getAllTeamLeads(payload),
      ]);
      setDashboardDataMyLead(myLeads?.data || []);
      setDashboardDataProject(projects?.data[0] || []);
      setTeamLeadData(teamLead?.data || []);
    } catch (error) {
      console.error("Error fetching my dashboard data", error);
    }
  };

  const featchAllData = async () => {
    try {
      const payload = {
        userId: store.getState().auth.userId,
        pageNo: "",
        pageSize: paginationModel.pageSize,
        start_date: "",
        end_date: "",
      };
      const response1 = await getAllUsersMyLead(payload);
      setDashboardDataMyLead(response1?.metadata || []);
      const response2 = await getAllMyLeadStageLead(payload);
      setMyLeadSatge(response2?.metadata || []);
      const response3 = await getAllMyLeadContactStage(payload);
      setAllContectData(response3?.metadata || []);
        const response4 = await getLeadStageProspect(payload)
        setLeadProspect(response4?.metadata || [])
        const response5  =  await getLeadStageOpportunity(payload)
        setLeadStageOpportunity(response5?.metadata || [])
    } catch (error) {}
  };

  const fetchData = async () => {
    try {
      const payload = {
        userId: store.getState().auth.userId,
        pageNo: "",
        pageSize: paginationModel.pageSize,
      };

      const response2 = await getAllTeamLeads(payload);
      setTeamLeadData(response2?.data || []);
    } catch (error) {}
  };

  const fetchDashboardCRM = async () => {
    try {
      const response = await getDataAllLead();
      setDashboardDataAllLead(response?.data[0] || []);
    } catch (error) {
      console.error("Error fetching dashboard CRM data", error);
    }
  };

  const fetchUserData = async () => {
    try {
      const paylode = store.getState().auth?.userId;
      const response = await getPerosnalDetails(paylode);
      setUserData(response.data);
      const resRole = await getPerosnalOffice(paylode);
      setUserRole(resRole.data);
    } catch (error: any) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleCardClick = async (team) => {
    setSelectedTeam(team);
    try {
      const response = await getTeamWiseMember(team.id);
      setTeamWiseMember(response.data);
    } catch {}
  };

  const getUserMatch = async () => {
    try {
      const paylode = store.getState().auth?.userId;
      const resRole = await getPerosnalOffice(paylode);
      if (resRole.data.teamRoleName.toLowerCase()?.includes("presales")) {
        setUserType("0");
      } else {
        setUserType("1");
      }
    } catch (error) {}
  };

  const navigateToSection = (id: number) => {
    if (id > 8) return;
    dispatch(setLeadId(id));
    navigation.navigate("Leads");
    setModalVisible(false);
  };

  const navigationTeamLead = () => {
    navigation.navigate("TeamLead", { selectedView: 2 });
  };
  const allLeadNavigations = () => {
    navigation.navigate("AllLeadScreen", { selectedView: 1 });
  };

  const handleProfile = () => {
    navigation.navigate("MyProfile");
  };

  const navigateToTeams = (selectedTeam: any) => {
    navigation.navigate("AllTeamList", { allTeams: selectedTeam });
    // navigation.navigate("AllTeamList");
  };

  const [isFooterVisible, setFooterVisible] = useState(true);
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        if (offsetY > 250) {
          setFooterVisible(false);
        } else {
          setFooterVisible(true);
        }
      },
    }
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await getValuepermission();
      // await fetchMyDashboardData();
      await fetchDashboardCRM();
      await fetchUserData();
      await handleCardClick("");
    } catch (error) {
      console.error("Error during refresh:", error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <>
      {loading ? (
        <DashboardSkeleton />
      ) : (
        <View style={styles.contmain}>
          <ScrollView
            onScroll={handleScroll}
            scrollEventThrottle={16}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {/* Header section */}
            <View style={styles.header}>
              <View style={styles.imageContainer}>
                <Image
                  source={require("../../assets/pulse_logo12.png")}
                  style={styles.image}
                />
              </View>
              <View style={styles.textContainer}>
                <Text
                  style={[globalStyles.fs1, globalStyles.h5, globalStyles.tc]}
                  allowFontScaling={false}
                >
                  {userData?.name}
                </Text>
                <Text
                  style={[globalStyles.h8, globalStyles.fs3, globalStyles.tc1]}
                  allowFontScaling={false}
                >
                  {/* {roleFromRedux} */}
                  {userRole?.hierarchyName}
                </Text>
              </View>
            </View>

            {/* Horizontal cards section */}

            {/* <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll1}
            >
              {isBanner.map((item) => (
                <View key={item.id}>
                  <Image source={{ uri: item.image }} style={styles.card} />
                </View>
              ))}
            </ScrollView> */}
            {/* {permission?.ADMIN || permission.CRM ? (
              <>
                <View style={styles.row}>
                  <View style={styles.textContainerAll}>
                    <Text
                      style={[
                        styles.leadData,
                        globalStyles.fs1,
                        globalStyles.h5,
                        globalStyles.tc,
                      ]}
                      allowFontScaling={false}
                    >
                      All Leads
                    </Text>
                    <Text
                      style={[
                        globalStyles.h8,
                        globalStyles.fs3,
                        globalStyles.tc2,
                        styles.role,
                      ]}
                      allowFontScaling={false}
                    >
                      {dashboardAllLead?.total}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.viewAllContainer}
                    onPress={() => allLeadNavigations()}
                  >
                    <Text
                      style={[
                        styles.viewAll,
                        globalStyles.h7,
                        globalStyles.fontfm,
                        globalStyles.tc3,
                      ]}
                      allowFontScaling={false}
                    >
                      View all
                    </Text>
                    <Feather
                      name="chevron-right"
                      size={24}
                      color="#3F8CFF"
                      style={styles.icon}
                    />
                  </TouchableOpacity>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.horizontalScroll}
                >
                  {staticData.leads.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => {
                        navigateToSection(Number(item.id));
                      }}
                    >
                      <View style={styles.cardContainer}>
                        <CustomCardNew
                          id={item.id}
                          title={item.content}
                          count={`${
                            dashboardData.allLead[item.leadDataKey] || 0
                          }`}
                          iconName="calendar"
                          iconBackgroundColor={item.calendarBackgroundColor}
                          onCardPress={() => navigateToSection(Number(item.id))}
                        />
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            ) : (
              ""
            )} */}

            {permission?.ADMIN || permission.CRM ? (
              <>
                <TouchableOpacity onPress={() => allLeadNavigations()}>
                  <View style={styles.container}>
                    <View style={styles.newCard}>
                      <View style={styles.textContainer}>
                        <Text
                          style={[
                            globalStyles.fs1,
                            globalStyles.h7,
                            globalStyles.tc,
                          ]}
                          allowFontScaling={false}
                        >
                          All Leads
                        </Text>
                        <Text
                          style={[
                            globalStyles.fs1,
                            globalStyles.h7,
                            globalStyles.tc,
                            styles.role,
                          ]}
                          allowFontScaling={false}
                        >
                          {dashboardAllLead?.total}
                        </Text>
                      </View>
                      <View style={styles.iconCircle}>
                        <FontAwesome5
                          name="user-alt"
                          size={24}
                          color="#8080ff"
                        />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </>
            ) : (
              ""
            )}

            {permission["MY-Dashboard"] ? (
              <>
                <View style={styles.row}>
                  <View style={styles.textContainerAll}>
                    <Text
                      style={[
                        styles.leadData,
                        globalStyles.fs1,
                        globalStyles.h5,
                        globalStyles.tc,
                      ]}
                      allowFontScaling={false}
                    >
                      My Leads
                    </Text>
                    <Text
                      style={[
                        globalStyles.h8,
                        globalStyles.fs3,
                        globalStyles.tc2,
                        styles.role,
                      ]}
                      allowFontScaling={false}
                    >
                      {dashboardDataMyLead?.total}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.viewAllContainer}
                    onPress={() => navigateToSection(3)}
                  >
                    <Text
                      style={[
                        styles.viewAll,
                        globalStyles.h7,
                        globalStyles.fontfm,
                        globalStyles.tc3,
                      ]}
                      allowFontScaling={false}
                    >
                      View all
                    </Text>
                    <Feather
                      name="chevron-right"
                      size={24}
                      color="#007bff"
                      style={styles.icon}
                    />
                  </TouchableOpacity>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.horizontalScroll}
                >
                  {staticData.leads
                    .filter(
                      (item) =>
                        (userType !== "1" || item.id !== 2) &&
                        (userType !== "0" || (item.id !== 5 && item.id !== 6))
                    )
                    .map((item) => {
                      let finalCount = 0;
                      if (item.id === 7) {
                        finalCount = myleadSatgeShow[item.myleadKey] || 0;
                      } else if (item.id === 2) {
                        finalCount = allContect[item.myleadKey] || 0;
                      }else if(item.id === 4){
                        finalCount = myLeadProspect[item.myleadKey] || 0
                      }else if(item.id === 5){
                        finalCount = myLeadStageOpportunity[item.myleadKey] || 0
                      }
                      return (
                        <TouchableOpacity
                          key={item.id}
                          onPress={() => {
                            navigateToSection(Number(item.id));
                          }}
                        >
                          <View style={styles.cardContainer}>
                            <CustomCardNew
                              id={item.id}
                              title={item.content}
                              count={`${finalCount}`}
                              iconName="calendar"
                              iconBackgroundColor={item.calendarBackgroundColor}
                              onCardPress={() =>
                                navigateToSection(Number(item.id))
                              }
                            />
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                </ScrollView>
              </>
            ) : (
              ""
            )}

            {permission["MY-Dashboard"] &&
            privileges["Team Leads"]?.length > 0 ? (
              <>
                <View style={styles.row}>
                  {/* <View style={styles.textContainerAll}>
                    <Text
                      style={[
                        styles.leadData,
                        globalStyles.fs1,
                        globalStyles.h5,
                        globalStyles.tc,
                      ]}
                      allowFontScaling={false}
                    >
                      Team Leads
                    </Text>
                    <Text
                      style={[
                        globalStyles.h8,
                        globalStyles.fs3,
                        globalStyles.tc2,
                        styles.role,
                      ]}
                      allowFontScaling={false}
                    >
                      {teamLeadData?.length}
                    </Text>
                  </View> */}
                  {/* <TouchableOpacity
                    style={styles.viewAllContainer}
                    // onPress={() => navigateToSection(7)}
                    onPress={()=>navigationTeamLead()}
                  >
                    <Text
                      style={[
                        styles.viewAll,
                        globalStyles.h7,
                        globalStyles.fontfm,
                        globalStyles.tc3,
                      ]}
                      allowFontScaling={false}
                    >
                      View all
                    </Text>
                    <Feather
                      name="chevron-right"
                      size={24}
                      color="#007bff"
                      style={styles.icon}
                    />
                  </TouchableOpacity> */}
                </View>
                {/* <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.horizontalScroll}
                > */}
                {/* {staticData.leads.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => {
                        navigateToSection(Number(item.id));
                      }}
                    >
                      <View style={styles.cardContainer}>
                        <CustomCardNew
                          id={item.id}
                          title={item.content}
                          count={`${dashboardDataMyLead[item.myleadKey] || 0}`}
                          iconName="calendar"
                          iconBackgroundColor={item.calendarBackgroundColor}
                          onCardPress={() => navigateToSection(Number(item.id))}
                        />
                      </View>
                    </TouchableOpacity>
                  ))} */}
                <TouchableOpacity onPress={() => navigationTeamLead()}>
                  <View style={styles.container}>
                    <View style={styles.newCard}>
                      <View style={styles.textContainer}>
                        <Text
                          style={[
                            globalStyles.fs1,
                            globalStyles.h7,
                            globalStyles.tc,
                          ]}
                          allowFontScaling={false}
                        >
                          Team Leads
                        </Text>
                        <Text
                          style={[
                            globalStyles.fs1,
                            globalStyles.h7,
                            globalStyles.tc,
                            styles.role,
                          ]}
                          allowFontScaling={false}
                        >
                          {teamLeadData?.length}
                        </Text>
                      </View>
                      <View style={styles.iconCircle}>
                        <FontAwesome5
                          name="user-alt"
                          size={24}
                          color="#8080ff"
                        />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
                {/* </ScrollView> */}
              </>
            ) : (
              ""
            )}

            {permission?.ADMIN || permission.CRM ? (
              <>
                <View style={styles.row}>
                  <View style={styles.textContainerAll}>
                    <Text
                      style={[
                        styles.leadData,
                        globalStyles.fs1,
                        globalStyles.h5,
                        globalStyles.tc,
                      ]}
                      allowFontScaling={false}
                    >
                      All Team
                    </Text>
                    <Text
                      style={[
                        globalStyles.h8,
                        globalStyles.fs3,
                        globalStyles.tc2,
                        styles.role,
                      ]}
                      allowFontScaling={false}
                    >
                      {memberdropdownItems.length}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.viewAllContainer}
                    onPress={() => navigateToTeams(1)}
                  >
                    <Text
                      style={[
                        styles.viewAll,
                        globalStyles.h7,
                        globalStyles.fontfm,
                        globalStyles.tc3,
                      ]}
                      allowFontScaling={false}
                    >
                      View all
                    </Text>
                    <Feather
                      name="chevron-right"
                      size={24}
                      color="#3F8CFF"
                      style={styles.icon}
                    />
                  </TouchableOpacity>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.horizontalScroll}
                >
                  {memberdropdownItems.map((item) => (
                    <TouchableOpacity key={item._id}>
                      <View style={styles.cardContainer}>
                        <CustomCardNew
                          id={item._id}
                          title={item.team_name}
                          count=""
                          // onCardPress={handleCardClick}
                          onCardPress={navigateToTeams}
                        />
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {selectedTeam && (
                  <>
                    <View style={styles.row}>
                      <View style={styles.textContainerAll}>
                        <Text
                          style={[
                            styles.leadData,
                            globalStyles.fs1,
                            globalStyles.h5,
                            globalStyles.tc,
                          ]}
                          allowFontScaling={false}
                        >
                          Team Members
                        </Text>
                        <Text
                          style={[
                            globalStyles.h8,
                            globalStyles.fs3,
                            globalStyles.tc2,
                            styles.role,
                          ]}
                          allowFontScaling={false}
                        >
                          {teamWiseMember.length}
                        </Text>
                      </View>
                      {/* <TouchableOpacity style={styles.viewAllContainer}>
                        <Text
                          style={[
                            styles.viewAll,
                            globalStyles.h6,
                            globalStyles.fontfm,
                          ]}
                          allowFontScaling={false}
                        >
                          View all
                        </Text>
                        <Feather
                          name="chevron-right"
                          size={24}
                          color="#007bff"
                          style={styles.icon}
                        />
                      </TouchableOpacity> */}
                    </View>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      style={styles.horizontalScroll}
                    >
                      {teamWiseMember.map((item) => {
                        const usersArray = Array.isArray(item.users)
                          ? item.users
                          : [item.users];
                        return usersArray.map((user) => {
                          const userOfficesArray = Array.isArray(
                            item.user_offices
                          )
                            ? item.user_offices
                            : [item.user_offices];

                          const userOffice = userOfficesArray.find(
                            (office) => office.userId === user._id
                          );

                          return (
                            <View key={user._id} style={styles.cardContainer}>
                              <CustomCardNew
                                id={user._id}
                                title={user.name}
                                post={
                                  userOffice ? userOffice.designation : "N/A"
                                }
                                postCounter={
                                  userOffice ? userOffice.emp_type : "N/A"
                                }
                                count=""
                                imageUrl={user.profile_image}
                              />
                            </View>
                          );
                        });
                      })}
                    </ScrollView>
                  </>
                )}
              </>
            ) : (
              ""
            )}

            {/* Attendance section */}
            {permission?.ADMIN || permission.HR ? (
              <>
                <View style={styles.row}>
                  <View style={styles.textContainerAll}>
                    <Text
                      style={[
                        styles.leadData,
                        globalStyles.fs1,
                        globalStyles.h5,
                        globalStyles.tc,
                      ]}
                      allowFontScaling={false}
                    >
                      All Attendance
                    </Text>
                    <Text
                      style={[
                        globalStyles.h8,
                        globalStyles.fs3,
                        globalStyles.tc2,
                        styles.role,
                      ]}
                      allowFontScaling={false}
                    >
                      {dashboardData.attendance.attendence_total_emp} day
                    </Text>
                  </View>
                  <View style={styles.iconFord}>
                    {/* <AntDesign
                      name="right"
                      size={24}
                      color="black"
                      onPress={() => testing()}
                    /> */}
                  </View>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.horizontalScroll}
                >
                  {staticData.attendance.map((item) => (
                    <View key={item.id} style={styles.cardContainer}>
                      {/* <CustomCard
                        cardContent={<Text>{item.content}</Text>}
                        calendarText={`${
                          dashboardData.attendance[item.attendanceKey] || 0
                        }`}
                      /> */}

                      <CustomCardNew
                        id={item.id}
                        title={item.content}
                        count={`${
                          dashboardData.attendance[item.attendanceKey] || 0
                        }`}
                        iconName="calendar"
                        iconBackgroundColor={item.calendarBackgroundColor}
                      />
                    </View>
                  ))}
                </ScrollView>
              </>
            ) : (
              ""
            )}

            {permission?.ADMIN ||
            permission.HR ||
            permission["MY-Dashboard"] ||
            permission.CRM ? (
              <>
                <View style={styles.row}>
                  <View style={styles.textContainerAll}>
                    <Text
                      style={[
                        styles.leadData,
                        globalStyles.fs1,
                        globalStyles.h5,
                        globalStyles.tc,
                      ]}
                      allowFontScaling={false}
                    >
                      My Attendance
                    </Text>
                    <Text
                      style={[
                        globalStyles.h8,
                        globalStyles.fs3,
                        globalStyles.tc2,
                        styles.role,
                      ]}
                      allowFontScaling={false}
                    >
                      {dashboardDataAttendance.attendence_my_current_month} day
                    </Text>
                  </View>
                  <View style={styles.iconFord}>
                    {/* <AntDesign
                      name="right"
                      size={20}
                      color="black"
                    
                    /> */}
                  </View>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.horizontalScroll}
                >
                  {staticData.attendance.map((item) => (
                    <View key={item.id} style={styles.cardContainer}>
                      {/* <CustomCard
                        cardContent={<Text>{item.content}</Text>}
                        calendarText={`${
                          dashboardDataAttendance[item.countMy_Attendance] || 0
                        }`}
                      /> */}

                      <CustomCardNew
                        id={item.id}
                        title={item.content}
                        count={`${
                          dashboardDataAttendance[item.countMy_Attendance] || 0
                        }`}
                        iconName="calendar"
                        iconBackgroundColor={item.calendarBackgroundColor}
                      />
                    </View>
                  ))}
                </ScrollView>
              </>
            ) : (
              ""
            )}

            {/* Projects section */}
            {permission?.ADMIN || permission.CRM ? (
              <>
                <View style={styles.row}>
                  {/* <View style={styles.textContainerAll}>
                    <Text
                      style={[
                        styles.leadData,
                        globalStyles.fs1, globalStyles.h5,globalStyles.tc
                      ]}
                      allowFontScaling={false}
                    >
                      All Project
                    </Text>
                    <Text
                      style={[
                        globalStyles.h8,
                        globalStyles.fs3,
                        globalStyles.tc2,
                        styles.role,
                      ]}
                      allowFontScaling={false}
                    >
                      {dashboardData.project.projects_total} Total
                    </Text>
                  </View> */}
                  <View style={styles.iconFord}>
                    {/* <AntDesign name="right" size={24} color="black" /> */}
                  </View>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.horizontalScroll}
                >
                  {/* {staticData.myProjects.map((item) => (
                    <View key={item.id} style={styles.cardContainer}>
                      <CustomCard
                        cardContent={<Text>{item.content}</Text>}
                        calendarText={`${
                          dashboardData.project[item.projectKey] || 0
                        }`}
                      />
                    </View>
                  ))} */}

                  {/* <View style={styles.leadsContainer}>
                    {staticData.myProjects.map((project) => (
                      <CustomBigCard
                        key={project.id}
                        id={project.id}
                        title={project.title}
                        createdDate={project.createdDate}
                        projectData={project.projectData}
                        style={styles.cardSpacing}
                        onPress={() =>
                          console.log(`Card Pressed: ${project.id}`)
                        }
                      />
                    ))}
                  </View> */}
                </ScrollView>
              </>
            ) : (
              ""
            )}
            {permission["MY-Dashboard"] ? (
              <>
                <View style={styles.row}>
                  {/* <View style={styles.textContainerAll}>
                    <Text
                      style={[
                        styles.leadData,
                        globalStyles.fs1, globalStyles.h5,globalStyles.tc
                      ]}
                      allowFontScaling={false}
                    >
                      My Project
                    </Text>
                    <Text
                      style={[
                        globalStyles.h8,
                        globalStyles.fs3,
                        globalStyles.tc2,
                        styles.role,
                      ]}
                      allowFontScaling={false}
                    >
                      {dashboardData.project.projects_total} Total
                    </Text>
                  </View> */}
                  <View style={styles.iconFord}>
                    {/* <AntDesign name="right" size={24} color="black" /> */}
                  </View>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.horizontalScroll}
                >
                  {/* {staticData.myProjects.map((item) => (
                    <View key={item.id} style={styles.cardContainer}>
                      <CustomCard
                        cardContent={<Text>{item.content}</Text>}
                        calendarText={`${
                          dashboardData.project[item.projectKey] || 0
                        }`}
                      />
                    </View>
                  ))} */}
                  {/* <View style={styles.leadsContainer}>
                    {projectData.map((project) => (
                      <CustomBigCard
                        key={project.id}
                        id={project.id}
                        title={project.title}
                        createdDate={project.createdDate}
                        projectData={project.projectData}
                        style={styles.cardSpacing}
                        onPress={() =>
                          console.log(`Card Pressed: ${project.id}`)
                        }
                      />
                    ))}
                  </View> */}
                </ScrollView>
              </>
            ) : (
              ""
            )}
          </ScrollView>
        </View>
      )}
      {isFooterVisible && (
        // <Footer navigate={handleProfile} onHomePress={onRefresh} />
        <FotterDseine navigate={handleProfile} onHomePress={onRefresh} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  contmain: {
    backgroundColor: "#FFFFFF",
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginTop: 30,
  },
  imageContainer: {
    marginRight: 12,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 35,
    height: 40,
  },
  textContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    flex: 1,
  },
  textContainerAll: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
  },
  name: {
    marginLeft: 10,
  },
  role: {
    padding: 10,
  },
  leadData: {
    marginLeft: 20,
    padding: 5,
  },
  card: {
    padding: 10,
    margin: 10,
    borderRadius: 8,
    height: 150,
    width: 390,
  },
  cardContainer: {
    margin: 8,
  },
  horizontalScroll: {
    flexDirection: "row",
    paddingHorizontal: "2%",
  },
  horizontalScroll1: {
    flexDirection: "row",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  iconFord: {
    marginRight: 20,
  },
  viewAllContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAll: {
    marginRight: 10,
  },
  icon: {
    marginRight: 15,
  },
  leadsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  cardSpacing: {
    marginHorizontal: 8,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  newCard: {
    width: "95%",
    minHeight: 154,
    backgroundColor: "#fff",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // ✅ Creates space between text and icon
    paddingHorizontal: 20,
    shadowColor: "#000000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f4ff",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Dashboard;
