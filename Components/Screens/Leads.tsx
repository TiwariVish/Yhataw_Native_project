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
  setLeadDatad,
  setMyLeadClosure,
  setMyLeadData,
  setMyLeadOpportunity,
  setMyLeadProspect,
  setTeamsLead,
} from "../../Redux/authSlice";
import store, { RootState } from "../../utils/store";
import { getAllUsersMyLead, getLeadStageClosure, getLeadStageOpportunity, getLeadStageProspect } from "./LeadsService";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { LoginScreenNavigationProp } from "../type";
import { LeadsSkeleton } from "../../Global/Components/SkeletonStructures";
import LeadCard from "../../NewDesine/GlobalComponets/LeadCard";
import Communications from "react-native-communications";
import { getAllTeamLeads, getAllUsers } from "./DashboardService";
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
  const [myLeadProspect,setLeadProspect] = useState<any>([])
const [myLeadStageOpportunity,setLeadStageOpportunity] = useState<any>([])
const [myLeadStageClosure,setLeadStageClosure] = useState<any>([])

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    getAllLeadsData(false, 0);
  }, []);
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

  const handleApplyFilters = (filters: any) => {
    setFilters(filters);
    setIsVisible(false);
    const selectedStages = filters.stage
      ? filters.stage.split(",").map((stage) => stage.trim())
      : [];
    setSelectedStages(selectedStages);
    const fetchFilteredLeads = async () => {
      try {
        const payload = {
          userId: store.getState().auth.userId,
          pageNo: 0,
          pageSize: paginationModel.pageSize,
          ...filters,
        };
        const res = await getAllUsersMyLead(payload);
        setFilteredLeads(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFilteredLeads();
  };

  const getAllLeadsData = async (isLoadMore = false, pageNo: number) => {
    try {
      if (isLoadMore) setLoadingMore(true);
      else setLoading(true);
      if (dataLoaded) return;
      const payload = {
        userId: store.getState().auth.userId,
        pageNo,
        start_date:"",
        end_date: "",
        pageSize: paginationModel.pageSize,
        ...filters,
      };

      const [response1, response2, response3,response4,response5,response6] = await Promise.all([
        getAllUsers(payload),
        getAllUsersMyLead(payload),
        getAllTeamLeads(payload),
        getLeadStageProspect(payload),
        getLeadStageOpportunity(payload),
        getLeadStageClosure(payload)

      ]);
      setTeamLeadData(response3?.data || []);
      setLeadProspect(response4?.data || [])
      setLeadStageOpportunity(response5.data || [])
      setLeadStageClosure(response6.data || [])
    
      setLeadData((prev) => [...prev, ...response1.data]);
      // setDataMyLead((prev) => [...prev, ...response2.data]);
      setDataMyLead(response2?.data || []);
      

      setDataLoaded(false);
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
        leadsToFilter = defaultNoData;
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
        leadsToFilter = teamLeadData ?? [];
        break;
      default:
        leadsToFilter = defaultNoData;
        break;
    }
    if (filters.stage) {
      const stageArray = filters.stage.split(",").map((stage) => stage.trim());
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
  }, [selectedCard, leadData, dataMyLead, searchQuery, filters.stage ,myLeadStageClosure,myLeadProspect,myLeadStageOpportunity,teamLeadData]);

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
        "";
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
        dispatch(setTeamsLead(item));
        break;
      default:
        break;
    }
    navigation.navigate("LeadInfoScreen", {selectedCard});
  };

  const handleLoadMore = () => {
    const totalDataLength = leadData.length + dataMyLead.length;
    if (!loadingMore && totalDataLength >= 25) {
      setPaginationModel((prevModel) => ({
        ...prevModel,
        page: prevModel.page + 1,
      }));
      getAllLeadsData(true, paginationModel.page + 1);
    }
  };

  return (
    <View style={styles.mainCont}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContainer}
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          if (
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - 20
          ) {
            handleLoadMore();
          }
        }}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
            myLeadStageOpportunity = {myLeadStageOpportunity}
            myLeadStageClosure = {myLeadStageClosure}
          />
          <CustomSearchBar
            value={searchQuery}
            onChangeText={(query) => setSearchQuery(query)}
            onFilterPress={() => setIsVisible(true)}
          />
          {loading && !loadingMore ? (
            <LeadsSkeleton />
          ) : !filteredLeads ||filteredLeads.length === 0 ? (
            <View style={styles.noDataFound}>
              <Text>No Data Found</Text>
            </View>
          ) : (
            filteredLeads.map((item, index) => {
              if (
                selectedCard === 2
              ) {
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
                      onCallPress={() => handleDialPress(item.leadPhone)}
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
            selectedStagesLocal={selectedStages}
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
