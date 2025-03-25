import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  ActivityIndicator,
  Linking,
  RefreshControl,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import LeadStatus from "./LeadStatus";
import { useSelector, useDispatch } from "react-redux";
import {
  setAllContectMy,
  setLeadDatad,
  setMyLeadClosure,
  setMyLeadData,
  setMyLeadOpportunity,
  setMyLeadProspect,
  setMySatgeDataRedux,
  setTeamsLead,
} from "../../Redux/authSlice";
import store, { RootState } from "../../utils/store";
import {
  getAllMyLeadContactStage,
  getAllMyLeadStageLead,
  getAllUsersMyLead,
  getLeadStageClosure,
  getLeadStageOpportunity,
  getLeadStageProspect,
  getReminderCall,
} from "./LeadsService";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { LoginScreenNavigationProp } from "../type";
import { LeadsSkeleton } from "../../Global/Components/SkeletonStructures";
import LeadCard from "../../NewDesine/GlobalComponets/LeadCard";
import Communications from "react-native-communications";
import { getAllTeamLeads, getAllUsers, getPerosnalOffice, getReminder } from "./DashboardService";
import CustomCardLead from "../../NewDesine/GlobalComponets/CustomCardLead";
import CustomSearchBar from "../../NewDesine/GlobalComponets/CustomSearchBar";
import CustomFlipBar from "../../NewDesine/GlobalComponets/CustomFlipBar";
import AllFilterBottomSheetModel from "../../Global/PopAndModels/AllFilterBottomSheetModel";

function Leads() {
  const dispatch = useDispatch();
  const { currLead } = useSelector((state: RootState) => state.auth);
  const [selectedCard, setSelectedCard] = useState<number>(currLead || 1);
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [leadData, setLeadData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [dataMyLead, setDataMyLead] = useState<any[]>([]);
  const [filters, setFilters] = useState<any>({});
  const [filteredLeadsnew, setFilteredLeads] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 25,
    page: 0,
  });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isVisible, setIsVisible] = useState(false);
  const [selectedStages, setSelectedStages] = useState([]);
  const [teamLeadData, setTeamLeadData] = useState<any>([]);
  const [myLeadProspect, setLeadProspect] = useState<any>([]);
  const [myLeadStageOpportunity, setLeadStageOpportunity] = useState<any>([]);
  const [myLeadStageClosure, setLeadStageClosure] = useState<any>([]);
  const [myleadSatgeShow ,setMyLeadSatge] = useState<any>([])
  const [allContect ,setAllContectData] = useState<any>([])
  const [remider, setRemider] = useState<{ [key: string]: any }>({});
  const [userType,setUserType] = useState<string>("0")
  console.log(userType,'userTypeuserTypeuserType');

  const [tabFilters, setTabFilters] = useState<{
    [key: number]: {
      search: string;
      stage: string; 
      formLead: any[];
      selectedDateRange: { from: string; to: string };
      selectedFilters: any[]; 
    };
  }>({
    2: { search: "", stage: "", formLead: [], selectedDateRange: { from: "", to: "" }, selectedFilters: [] },
    3: { search: "", stage: "", formLead: [], selectedDateRange: { from: "", to: "" }, selectedFilters: [] },
    4: { search: "", stage: "", formLead: [], selectedDateRange: { from: "", to: "" }, selectedFilters: [] },
    5: { search: "", stage: "", formLead: [], selectedDateRange: { from: "", to: "" }, selectedFilters: [] },
    6: { search: "", stage: "", formLead: [], selectedDateRange: { from: "", to: "" }, selectedFilters: [] },
    7: { search: "", stage: "", formLead: [], selectedDateRange: { from: "", to: "" }, selectedFilters: [] },
  });
  
  const scrollViewRef = useRef<ScrollView>(null);
  useEffect(() => {
    if (!isVisible) {
      onRefresh();
    }
  }, [isVisible]);

  useFocusEffect(
    useCallback(() => {
      onRefresh();
    }, [])
  );
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      (async () => {
        if (isActive) await   getAllLeadsData(false, 0);
      })();

      return () => {
        isActive = false;
      };
    }, [searchQuery])
  );


  useEffect(() => {
    if (
      dataMyLead.length > 0 ||
      leadData.length > 0 ||
      teamLeadData.length > 0
    ) {
      handleReminder();
    }
  }, [dataMyLead, leadData, teamLeadData]);

  useEffect(()=>{
    getUserMatch()
  },[])

  useEffect(() => {
    getAllLeadsData(false, 0);
    handleReminder();
  }, [selectedCard]);
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      setLeadData([]);
      setDataMyLead([]);
      setDataLoaded(false);
      await getAllLeadsData(false, 0);
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
  };

    const getUserMatch = async() =>{
      try {
           const paylode = store.getState().auth?.userId;
        const resRole = await getPerosnalOffice(paylode);
        if(resRole.data.teamRoleName.toLowerCase()?.includes('presales')){
          setUserType("0")
        }
        else{
          setUserType("1")
        }
        
      } catch (error) {
        
      }
    }

  // const handleApplyFilters = (filters: any) => {
  //   setFilters(filters);
  //   setIsVisible(false);
  //   const selectedStages = filters.stage
  //     ? filters.stage.split(",").map((stage) => stage.trim())
  //     : [];
  //   setSelectedStages(selectedStages);
  //   const fetchFilteredLeads = async () => {
  //     try {
  //       const payload = {
  //         userId: store.getState().auth.userId,
  //         pageNo: 0,
  //         pageSize: paginationModel.pageSize,
  //         ...filters,
  //       };
  //       const res = await getAllUsersMyLead(payload);
  //       setFilteredLeads(res.data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   fetchFilteredLeads();
  // };




  const handleApplyFilters = async (filters: any) => {
    console.log(filters, 'Applied Filters:::::::::::::::::::', selectedCard);
    const selectedStages = filters.stage
        ? filters.stage.split(",").map((stage) => stage.trim())
        : [];
      // setSelectedStages(selectedStages);
    setTabFilters((prev) => ({
      ...prev,
      [selectedCard]: {
        ...prev[selectedCard],
        ...filters, 
        selectedFilters: selectedStages
      },
    }));

    try {
      await getAllLeadsData(false, 0, filters); 
    } catch (error) {
      console.error(error);
    }

    setIsVisible(false);
};
  const handleReminder = async () => {
    let leads = [];
    if (selectedCard === 1) {
      leads = leadData;
    }else if(selectedCard === 2){
      leads = allContect
    }
    
    else if (selectedCard === 3) {
      leads = dataMyLead;
    } else if (selectedCard === 7) {
      leads = myleadSatgeShow;
    }

    if (Array.isArray(leads) && leads.length > 0) {
      const reminderData: { [key: string]: any } = {};

      for (const lead of leads) {
        console.log(lead, "Processing lead for reminder");

        if (lead._id) {
          try {
            const response = await getReminderCall(lead._id);
            reminderData[lead._id] = response.data;
            console.log(response, `Reminder for ID: ${lead._id}`);
          } catch (error) {
            console.error(
              `Failed to fetch reminder for lead ${lead._id}`,
              error
            );
          }
        } else {
          console.error("Lead is missing _id", lead);
        }
      }

      setRemider(reminderData);
    } else {
      console.error("No leads available for selectedCard:", selectedCard);
    }
  };

  const getAllLeadsData = async (isLoadMore = false, pageNo: number, appliedFilters = tabFilters[selectedCard]) => {
   console.log(appliedFilters,'appliedFiltersappliedFiltersappliedFiltersappliedFiltersappliedFilters');
   
    if (isLoadMore && loadingMore) return;
    if (!isLoadMore && loading) return;
  
    try {
      if (isLoadMore) setLoadingMore(true);
      else setLoading(true);
  
      if (dataLoaded) return;
  
      const payload = {
        userId: store.getState().auth.userId,
        pageNo,
        start_date: "",
        end_date: "",
        search: searchQuery,
        pageSize: paginationModel.pageSize,
        ...appliedFilters,
      };
  console.log(payload,'payloadpayloadpayloadpayloadpayload');
  
      let responses;
  
      if (userType === "0") { 
        responses = await Promise.all([
          getAllUsersMyLead(payload),
          getLeadStageProspect(payload),
          getAllMyLeadContactStage(payload),
          getAllMyLeadStageLead(payload)
        ]);
      } else {
        responses = await Promise.all([
          getAllUsers(payload),
          getAllUsersMyLead(payload),
          getAllTeamLeads(payload),
          getLeadStageProspect(payload),
          getLeadStageOpportunity(payload),
          getLeadStageClosure(payload),
          getAllMyLeadContactStage(payload),
          getAllMyLeadStageLead(payload)
        ]);
      }
  
      if (userType === "0") {
        const [response2, response4,response7,response8] = responses;
        console.log(responses,"responsesresponsesresponses")
        setDataMyLead((prevData) => {
          const newData = [...prevData, ...(response2?.data || [])];
          return [...new Set(newData.map((item) => JSON.stringify(item)))].map((item) =>
            JSON.parse(item)
          );
        });
  
        setLeadProspect((prevData) => {
          const newData = [...prevData, ...(response4?.data || [])];
          return [...new Set(newData.map((item) => JSON.stringify(item)))].map((item) =>
            JSON.parse(item)
          );
        });

        setMyLeadSatge((prevData) => {
          const newData = [...prevData, ...(response8?.data || [])];
          return [...new Set(newData.map((item) => JSON.stringify(item)))].map((item) =>
            JSON.parse(item)
          );
        });
        setAllContectData((prevData) => {
          const newData = [...prevData, ...(response7?.data || [])];
          return [...new Set(newData.map((item) => JSON.stringify(item)))].map((item) =>
            JSON.parse(item)
          );
        });
      } else {
        const [response1, response2, response3, response4, response5, response6, response7 ,response8] = responses;
  
        setLeadData((prevData) => {
          const newData = [...prevData, ...(response1?.data || [])];
          return [...new Set(newData.map((item) => JSON.stringify(item)))].map((item) =>
            JSON.parse(item)
          );
        });
  
        setDataMyLead((prevData) => {
          const newData = [...prevData, ...(response2?.data || [])];
          return [...new Set(newData.map((item) => JSON.stringify(item)))].map((item) =>
            JSON.parse(item)
          );
        });
  
        setTeamLeadData((prevData: any) => {
          const newData = isLoadMore
            ? [...prevData, ...(response3?.data || [])]
            : [...(response3?.data || [])];
          return [...new Set(newData.map((item) => JSON.stringify(item)))].map((item) =>
            JSON.parse(item)
          );
        });
  
        setLeadProspect((prevData) => {
          const newData = [...prevData, ...(response4?.data || [])];
          return [...new Set(newData.map((item) => JSON.stringify(item)))].map((item) =>
            JSON.parse(item)
          );
        });
  
        setLeadStageOpportunity((prevData) => {
          const newData = [...prevData, ...(response5?.data || [])];
          return [...new Set(newData.map((item) => JSON.stringify(item)))].map((item) =>
            JSON.parse(item)
          );
        });
  
        setLeadStageClosure((prevData) => {
          const newData = [...prevData, ...(response6?.data || [])];
          return [...new Set(newData.map((item) => JSON.stringify(item)))].map((item) =>
            JSON.parse(item)
          );
        });
  
        setAllContectData((prevData) => {
          const newData = [...prevData, ...(response7?.data || [])];
          return [...new Set(newData.map((item) => JSON.stringify(item)))].map((item) =>
            JSON.parse(item)
          );
        });
        setMyLeadSatge((prevData) => {
          const newData = [...prevData, ...(response8?.data || [])];
          return [...new Set(newData.map((item) => JSON.stringify(item)))].map((item) =>
            JSON.parse(item)
          );
        });
      }
    } catch (error) {
      console.error("Error fetching leads data:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };
  
  const filteredLeads = useMemo(() => {
    const defaultNoData = [{ id: 1, name: "NO DATA FOUND" }];
    let leadsToFilter: any[] = [];
    let noStageMatch = false;
    switch (selectedCard) {
      case 1:
        leadsToFilter = leadData ?? [];
        break;
      case 2:
        leadsToFilter = allContect ?? [];
        break;
      case 3:
        leadsToFilter = dataMyLead ?? [];
        break;
      case 4:
        leadsToFilter = myLeadProspect ?? [];
        break;
      case 5:
        leadsToFilter = myLeadStageOpportunity ?? [];
        break;
      case 6:
        leadsToFilter = myLeadStageClosure ?? [];
        break;
      case 7:
        leadsToFilter = myleadSatgeShow ?? [];
        break;
      default:
        leadsToFilter = defaultNoData;
        break;
    }
    console.log(tabFilters,'filtersfiltersfiltersfiltersfiltersfilters::::::::::::');
    
    // if (filters.stage) {
    //   const stageArray = filters.stage.split(",").map((stage) => stage.trim());
    //   leadsToFilter = leadsToFilter.filter((lead) => {
    //     const isMatch = stageArray.includes(lead.stage);
    //     if (!isMatch && lead.stage) {
    //       noStageMatch = true;
    //     }
    //     return isMatch;
    //   });
    // }

    if (tabFilters?.[selectedCard]?.stage) {  
      const stageArray = tabFilters[selectedCard].stage.split(",").map((stage) => stage.trim());
      leadsToFilter = leadsToFilter.filter((lead) => {
        const isMatch = stageArray.includes(lead.stage);
        if (!isMatch && lead.stage) {
          noStageMatch = true;
        }
        return isMatch;
      });
    }

    if (searchQuery) {
      const firstThreeChars = searchQuery.substring(0, 3).toLowerCase();
      return leadsToFilter.filter(
        (lead) =>
          lead.leadName &&
          lead.leadName.toLowerCase().startsWith(firstThreeChars)
      );
    }
    return leadsToFilter;
  }, [
    selectedCard,
    leadData,
    dataMyLead,
    searchQuery,
    filters.stage,
    tabFilters?.[selectedCard]?.stage,
    myLeadStageClosure,
    myLeadProspect,
    myLeadStageOpportunity,
    teamLeadData,
    allContect,myleadSatgeShow
  ]);

  const handleDialPress = useCallback(async (phoneNumber) => {
    const url = `tel:${phoneNumber}`;
    // const url = 'tel:1234567890';
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.log("Phone dialer is not available");
      }
    } catch (err) {
      console.error("Error opening dialer:", err);
    }
  }, []);

  const handleCardDataLeads = (item: any) => {
    switch (selectedCard) {
      case 1:
        dispatch(setLeadDatad(item));
        break;
      case 2:
        dispatch(setAllContectMy(item)); ;
        break;
      case 3:
        dispatch(setMyLeadData(item));
        break;
      case 4:
        dispatch(setMyLeadProspect(item));
        break;
      case 5:
        dispatch(setMyLeadOpportunity(item));
        break;
      case 6:
        dispatch(setMyLeadClosure(item));
        break;
      case 7:
        dispatch(setMySatgeDataRedux(item));
        break;
      default:
        break;
    }
    navigation.navigate("LeadInfoScreen", { selectedCard });
  };

  const handleLoadMore = () => {
    if (!loadingMore) {
      setPaginationModel((prevModel) => {
        const newPage = prevModel.page + 1;
        getAllLeadsData(true, newPage);
        return { ...prevModel, page: newPage }; 
      });
    }
  };

  return (
    <View style={styles.mainCont}>
   <ScrollView
  contentContainerStyle={{ flexGrow: 1 }} 
  onScroll={({ nativeEvent }) => {
    if (dataLoaded) return;
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    if (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - 20
    ) {
      handleLoadMore();
    }
  }}
  scrollEventThrottle={16}
  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
>
        <View style={styles.content}>
          {/* <LeadStatus
            selectedCard={selectedCard}
            setSelectedCard={setSelectedCard}
            onSearchChange={(query) => setSearchQuery(query)}
          /> */}
          <CustomFlipBar
            selectedCard={selectedCard}
            setSelectedCard={setSelectedCard}
            leadData={leadData}
            dataMyLead={dataMyLead}
            teamLeadData={teamLeadData}
            myLeadProspect={myLeadProspect}
            myLeadStageOpportunity={myLeadStageOpportunity}
            myLeadStageClosure={myLeadStageClosure}
            allContect ={allContect}
            userType ={userType}
            myleadSatgeShow ={myleadSatgeShow}
          />
          <CustomSearchBar
            value={searchQuery}
            onChangeText={(query) => setSearchQuery(query)}
            onFilterPress={() => setIsVisible(true)}
          />
          {loading && !loadingMore ? (
            <LeadsSkeleton />
          ) : !filteredLeads || filteredLeads.length === 0 ? (
            <View style={styles.noDataFound}>
              <Text>No Data Found</Text>
            </View>
          ) : (
            filteredLeads.map((item, index) => {
              if (selectedCard === 0) {
                return (
                  <View style={styles.noDataFound} key={`${item.id}-${index}`}>
                    <Text>{item.name}</Text>
                  </View>
                );
              } else {
                return (
                  <View style={styles.newAliment} key={index}>
                    {/* <LeadCard
                      name={item.leadName}
                      location={item.form_name}
                      status={item.stage}
                      projectName={item.projecttype_name}
                      onCallPress={() => handleDialPress(item.leadPhone)}
                      onTextPress={() => handleCardDataLeads(item)}
                    /> */}

                    <CustomCardLead
                      name={item?.leadName ?? ""}
                      status={item?.stage ?? ""}
                      form_name={item?.form_name ?? ""}
                      dateTimeShow={item?.createdAt ?? ""}
                      priority={item?.priority ?? ""}
                      reminder={remider[item._id] ?? "No Reminder"}
                      onCallPress={() => handleDialPress(item?.leadPhone)}
                      onMorePress={() => console.log("More Options Pressed")}
                      onTextPress={() => handleCardDataLeads(item)}
                    />
                  </View>
                );
              }
            })
          )}
          {loadingMore && (
            <View style={styles.loadingMore}>
              <ActivityIndicator size={30} color="#0000ff" />
            </View>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={isVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsVisible(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        <View style={styles.bottomSheetContainer}>
          <AllFilterBottomSheetModel
            visible={isVisible}
            onClose={() => setIsVisible(false)}
            onApplyFilters={handleApplyFilters}
            selectedStagesLocal={tabFilters[selectedCard]?.selectedFilters ?? []}
            selectViewData
            selectedTab={selectedCard}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainCont: {
    backgroundColor: "#FFFFFF",
    height: "100%",
  },
  scrollViewContainer: {
    backgroundColor: "#FFFFFF",
    flexGrow: 1,
  },
  content: {
    backgroundColor: "#FFFFFF",
    // paddingHorizontal: 10,
  },
  loadingMore: {
    marginVertical: 20,
    alignItems: "center",
  },
  newAliment: {
    // marginHorizontal: 10,
  },
  noDataFound: {
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  bottomSheetContainer: {
    position: "absolute",
    width: "100%",
    backgroundColor: "white",
  },
  overlay: {
    flex: 1,
    backgroundColor: "white",
  },
});

export default Leads;
