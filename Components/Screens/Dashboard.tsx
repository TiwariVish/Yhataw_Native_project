import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import CustomCard from "../../Global/Components/CustomCard";
import Footer from "../../Global/Components/Footer";
import { LoginScreenNavigationProp } from "../type"; // Import the types
import {
  addBanner,
  getDataAllLead,
  getDataAttendance,
  getDataMyAttendance,
  getDataMylead,
  getDataProject,
} from "./DashboardService";
import { locationType } from "../../Models/Interface";
import store, { RootState } from "../../utils/store";
import { setLeadId } from "../../Redux/authSlice";
import { useDispatch } from "react-redux";
import { getPerosnalDetails } from "./MyProfileService";
import { DashboardSkeleton } from "../../Global/Components/SkeletonStructures";
import { useSelector } from "react-redux";
import { globalStyles } from "../../GlobalCss/GlobalStyles";

const staticData = {
  leads: [
    {
      id: 2,
      content: "New",
      cardColor: "#D4FFEA",
      calendarBackgroundColor: "#009900",
      leadDataKey: "lead_total_new_count",
      myleadKey: "lead_my_new_count",
      lead_my_pipeline_count: "",
    },
    {
      id: 4,
      content: "Site Visit",
      cardColor: "#99e6ff",
      calendarBackgroundColor: "#1a1aff",
      leadDataKey: "",
      myleadKey: "",
      lead_my_pipeline_count: "",
    },
    {
      id: 5,
      content: "Pipeline",
      cardColor: "#FFF3DF",
      calendarBackgroundColor: "#ffff00",
      leadDataKey: "lead_total_pipeline_count",
      myleadKey: "lead_my_pipeline_count",
    },
    {
      id: 3,
      content: "Visit Cancelled",
      cardColor: "#D4FFEA",
      calendarBackgroundColor: "#009900",
      leadDataKey: "",
      myleadKey: "",
      lead_my_pipeline_count: "lead_my_pipeline_count",
    },
    {
      id: 1,
      content: "Visit Done",
      cardColor: "#D4FFEA",
      calendarBackgroundColor: "#009900",
      leadDataKey: "lead_total_visit_done_count",
      myleadKey: "",
      visit_done_count: "lead_total_visit_done_count",
    },
    {
      id: 6,
      content: "Not Answered",
      cardColor: "#FFEFEC",
      calendarBackgroundColor: "#cf6363",
      leadDataKey: "lead_my_not_answered_count",
      myleadKey: "lead_my_not_answered_count",
      visit_done_count: "lead_total_visit_done_count",
    },
    {
      id: 7,
      content: "Not Intrested",
      cardColor: "#FFEFEC",
      calendarBackgroundColor: "#cf6363",
      leadDataKey: "lead_my_not_intrested_count",
      myleadKey: "lead_my_not_intrested_count",
      visit_done_count: "lead_total_visit_done_count",
    },
    {
      id: 8,
      content: "Call Back",
      cardColor: "#FFF3DF",
      calendarBackgroundColor: "#ffff00",
      leadDataKey: "lead_total_call_back_count",
      myleadKey: "lead_my_call_back_count",
      visit_done_count: "lead_total_visit_done_count",
    },
  ],
  attendance: [
    {
      id: 1,
      content: "Present",
      attendanceKey: "attendence_present_today",
      countMy_Attendance: "attendence_my_current_month_present",
    },
    {
      id: 2,
      content: "Absent",
      attendanceKey: "attendence_absent_today",
      countMy_Attendance: "attendence_my_current_month_absent",
    },
    {
      id: 3,
      content: "Late",
      attendanceKey: "attendence_late_today",
      countMy_Attendance: "attendence_my_current_month_late",
    },
    {
      id: 4,
      content: "Leave",
      attendanceKey: "attendence_leave_today",
      countMy_Attendance: "attendence_my_current_month_leave",
    },
  ],
  myProjects: [
    { id: 1, content: "Commercial", projectKey: "projects_commercial" },
    { id: 2, content: "Residential", projectKey: "projects_residencial" },
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

  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [dashboardDataMyLead, setDashboardDataMyLead] = useState<any>([]);
  const [dashboardDataProject, setDashboardDataProject] = useState<any>([]);
  const [dashboardDataAttendance, setDashboardDataAttendance] = useState<any>(
    []
  );
  const [dashboardDataAllLead, setDashboardDataAllLead] = useState<any>([]);
  const [dashboardView, setDashboardView] = useState<any>([
    "HR",
    "CRM",
    "MY-Dashboard",
    "ADMIN",
  ]);

  const [isBanner, setIsBanner] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const userId = store.getState().auth;
  const { authenticated, role, privileges } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    // if (permission?.ADMIN || permission.CRM) {
      getValuepermission();
    // }
    // if (
    //   permission?.ADMIN ||
    //   permission.HR ||
    //   permission["MY-Dashboard"] ||
    //   permission.CRM
    // ) {
      fetchMy_Attendance();
    // }
    // if (permission["MY-Dashboard"]) {
      fetchMyDashboardData();
    // }
    fetchDashboardCRM();
    fetchUserData();
  }, [userId]);

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
    const response = await getDataMylead();
    setDashboardDataMyLead(response?.data[0] || []);
    const response2 = await getDataProject();
    setDashboardDataProject(response2?.data[0] || []);
  };

  const fetchDashboardCRM = async () => {
    try {
      const response = await getDataAllLead();
      setDashboardDataAllLead(response?.data[0] || []);
    } catch {}
  };

  const fetchUserData = async () => {
    try {
      const response = await getPerosnalDetails(store.getState().auth?.userId);
      const res = await addBanner();
      setIsBanner(res?.data);
      setUserData(response.data);
    } catch (error: any) {
      console.error("Error fetching user details:", error);
    }
  };
  const navigateToSection = (id: number) => {
    dispatch(setLeadId(id));
    navigation.navigate("Leads");
    setModalVisible(false);
  };

  const handleProfile = () => {
    navigation.navigate("MyProfile");
  };

  const [isFooterVisible, setFooterVisible] = useState(true);
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        if (offsetY > 100) {
          setFooterVisible(false);
        } else {
          setFooterVisible(true);
        }
      },
    }
  );

  const check = () => {
    navigation.navigate("ErrorPage");
  };


  const onRefresh = async () => {
    setRefreshing(true);
    try {
      console.log();
      
      await getValuepermission();
      await fetchMyDashboardData();
      await fetchDashboardCRM();
      await fetchUserData();
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
          <ScrollView onScroll={handleScroll} scrollEventThrottle={16}  refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            {/* Header section */}
            <View style={styles.header}>
              <View style={styles.imageContainer}>
                <Image
                  source={require("../../assets/Logo.png")}
                  style={styles.image}
                />
              </View>
              <View style={styles.textContainer}>
                <Text style={[styles.name,globalStyles.fontfm, globalStyles.h4]} allowFontScaling={false}>{userData?.name}</Text>
                <Text style={styles.role}>
                  {userData?.position}
                </Text>
              </View>
            </View>

            {/* Horizontal cards section */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll1}
            >
              {isBanner.map((item) => (
                <View key={item.id}>
                  <Image source={{ uri: item.image }} style={styles.card} />
                </View>
              ))}
            </ScrollView>

            {/* Leads section */}
            {permission?.ADMIN || permission.CRM ? (
              <>
                <View style={styles.row}>
                  <View style={styles.textContainerAll}>
                    <Text style={[styles.name,globalStyles.h6,globalStyles.fontfm]} allowFontScaling={false}>All Leads</Text>
                    <Text style={[globalStyles.h7,globalStyles.fontfm,styles.role]} allowFontScaling={false}>
                      {dashboardData.allLead.lead_total_count}
                    </Text>
                  </View>
                  <View style={styles.iconFord}>
                    <AntDesign
                      name="right"
                      size={20}
                      color="black"
                      onPress={() => navigateToSection(1)}
                    />
                  </View>
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
                        <CustomCard
                          cardContent={<Text>{item.content}</Text>}
                          cardColor={item.cardColor}
                          calendarBackgroundColor={item.calendarBackgroundColor}
                          calendarText={`${
                            dashboardData.allLead[item.leadDataKey] || 0
                          }`}
                        />
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            ) : (
              ""
            )}

            {permission["MY-Dashboard"] ? (
              <>
                <View style={styles.row}>
                  <View style={styles.textContainerAll}>
                    <Text style={[styles.name,globalStyles.h6,globalStyles.fontfm]} allowFontScaling={false}>My Leads</Text>
                    <Text style={[globalStyles.h7,globalStyles.fontfm,styles.role]} allowFontScaling={false}>
                      {dashboardDataMyLead.lead_my_total_count}
                    </Text>
                  </View>
                  <View style={styles.iconFord}>
                    <AntDesign
                      name="right"
                      size={20}
                      color="black"
                      onPress={() => navigateToSection(3)}
                    />
                  </View>
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
                        <CustomCard
                          cardContent={<Text>{item.content}</Text>}
                          cardColor={item.cardColor}
                          calendarBackgroundColor={item.calendarBackgroundColor}
                          calendarText={`${
                            dashboardDataMyLead[item.myleadKey] || 0
                          }`}
                        />
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            ) : (
              ""
            )}

            {/* Attendance section */}
            {permission?.ADMIN || permission.HR ? (
              <>
                <View style={styles.row}>
                  <View style={styles.textContainerAll}>
                    <Text style={[styles.name,globalStyles.h6,globalStyles.fontfm]} allowFontScaling={false}>All Attendance</Text>
                    <Text style={[globalStyles.h7,globalStyles.fontfm,styles.role]} allowFontScaling={false}>
                      {dashboardData.attendance.attendence_total_emp} day
                    </Text>
                  </View>
                  <View style={styles.iconFord}>
                    {/* <AntDesign name="right" size={24} color="black" /> */}
                  </View>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.horizontalScroll}
                >
                  {staticData.attendance.map((item) => (
                    <View key={item.id} style={styles.cardContainer}>
                      <CustomCard
                        cardContent={<Text>{item.content}</Text>}
                        calendarText={`${
                          dashboardData.attendance[item.attendanceKey] || 0
                        }`}
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
                    <Text style={[styles.name,globalStyles.h6,globalStyles.fontfm]} allowFontScaling={false}>My Attendance</Text>
                    <Text style={[globalStyles.h7,globalStyles.fontfm,styles.role]} allowFontScaling={false}>
                      {dashboardDataAttendance.attendence_my_current_month} day
                    </Text>
                  </View>
                  <View style={styles.iconFord}>
                    <AntDesign
                      name="right"
                      size={20}
                      color="black"
                      onPress={() => check()}
                    />
                  </View>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.horizontalScroll}
                >
                  {staticData.attendance.map((item) => (
                    <View key={item.id} style={styles.cardContainer}>
                      <CustomCard
                        cardContent={<Text>{item.content}</Text>}
                        calendarText={`${
                          dashboardDataAttendance[item.countMy_Attendance] || 0
                        }`}
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
                  <View style={styles.textContainerAll}>
                    <Text style={[styles.name,globalStyles.h6,globalStyles.fontfm]} allowFontScaling={false}>All Project</Text>
                    <Text style={[globalStyles.h7,globalStyles.fontfm,styles.role]} allowFontScaling={false}>
                      {dashboardData.project.projects_total} Total
                    </Text>
                  </View>
                  <View style={styles.iconFord}>
                    {/* <AntDesign name="right" size={24} color="black" /> */}
                  </View>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.horizontalScroll}
                >
                  {staticData.myProjects.map((item) => (
                    <View key={item.id} style={styles.cardContainer}>
                      <CustomCard
                        cardContent={<Text>{item.content}</Text>}
                        calendarText={`${
                          dashboardData.project[item.projectKey] || 0
                        }`}
                      />
                    </View>
                  ))}
                </ScrollView>
              </>
            ) : (
              ""
            )}
            {permission["MY-Dashboard"] ? (
              <>
                <View style={styles.row}>
                  <View style={styles.textContainerAll}>
                    <Text style={[styles.name,globalStyles.h6,globalStyles.fontfm]} allowFontScaling={false}>My Project</Text>
                    <Text style={[globalStyles.h7,globalStyles.fontfm,styles.role]} allowFontScaling={false}>
                      {dashboardData.project.projects_total} Total
                    </Text>
                  </View>
                  <View style={styles.iconFord}>
                    {/* <AntDesign name="right" size={24} color="black" /> */}
                  </View>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.horizontalScroll}
                >
                  {staticData.myProjects.map((item) => (
                    <View key={item.id} style={styles.cardContainer}>
                      <CustomCard
                        cardContent={<Text>{item.content}</Text>}
                        calendarText={`${
                          dashboardData.project[item.projectKey] || 0
                        }`}
                      />
                    </View>
                  ))}
                </ScrollView>
              </>
            ) : (
              ""
            )}
          </ScrollView>
        </View>
      )}
      {isFooterVisible && <Footer navigate={handleProfile} />}
    </>
  );
};

const styles = StyleSheet.create({
  contmain: {
    backgroundColor: "white",
    height: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginTop: 20,
  },
  imageContainer: {
    marginRight: 12,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 35,
    height: 35,
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
    marginLeft: 15,
  },
  role: {
    // fontSize: 14,
    // color: "gray",
    marginLeft: 25,
    paddingTop:5
  },
  card: {
    // backgroundColor: "gray",
    // borderColor: "gray",
    // borderWidth: 0,
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
    // margin:5
    paddingHorizontal: "2%"
  },
  horizontalScroll1:{
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
});

export default Dashboard;
