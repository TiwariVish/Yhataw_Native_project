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
} from "react-native";
import LeadStatus from "./LeadStatus";
import { useSelector, useDispatch } from "react-redux";
import { setLeadDatad, setMyLeadData } from "../../Redux/authSlice";
import store, { RootState } from "../../utils/store";
import { getAllUsersMyLead } from "./LeadsService";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { LoginScreenNavigationProp } from "../type";
import { LeadsSkeleton } from "../../Global/Components/SkeletonStructures";
import LeadCard from "../../NewDesine/GlobalComponets/LeadCard";
import Communications from "react-native-communications";
import { getAllUsers } from "./DashboardService";
import CustomCardLead from "../../NewDesine/GlobalComponets/CustomCardLead";
import CustomSearchBar from "../../NewDesine/GlobalComponets/CustomSearchBar";
import CustomFlipBar from "../../NewDesine/GlobalComponets/CustomFlipBar";

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
  const [refreshing, setRefreshing] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 25,
    page: 0,
  });
  const [searchQuery, setSearchQuery] = useState<string>("");

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    getAllLeadsData(false, 1);
  }, []);

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
      console.error("Error during refresh:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const getAllLeadsData = async (isLoadMore = false, pageNo: number) => {
    try {
      if (isLoadMore) setLoadingMore(true);
      else setLoading(true);
      if (dataLoaded) return;
      const payload = {
        userId: store.getState().auth.userId,
        pageNo,
        pageSize: paginationModel.pageSize,
      };

      const [response1, response2] = await Promise.all([
        getAllUsers(payload),
        getAllUsersMyLead(payload),
      ]);

      setLeadData((prev) => [...prev, ...response1.data]);
      setDataMyLead((prev) => [...prev, ...response2.data]);
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
    switch (selectedCard) {
      case 1:
        leadsToFilter = leadData;
        break;
      case 2:
        leadsToFilter = defaultNoData;
        break;
      case 3:
        leadsToFilter = dataMyLead;
        break;
      case 4:
        leadsToFilter = defaultNoData;
        break;
      case 5:
        leadsToFilter = defaultNoData;
        break;
      case 6:
        leadsToFilter = [];
        break;
      default:
        leadsToFilter = [{ id: 1, name: "NO DATA FOUND" }];
        break;
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
  }, [selectedCard, leadData, dataMyLead, searchQuery]);

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

  // =========================================
  // const handleDialPress = (phoneNumber) => {
  //   const args = {
  //     number: phoneNumber,
  //     prompt: true,
  //   };

  //   call(args).catch((err) => {
  //     console.error("Error opening dialer:", err);
  //   });
  // };
  // ==================================================
  //   const handleDialPress = useCallback((phoneNumber) => {
  //     alert(phoneNumber)
  //     Communications.phonecall(phoneNumber, false);
  // }, []);

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
      default:
        break;
    }
    navigation.navigate("LeadInfoScreen");
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
          <CustomFlipBar  selectedCard={selectedCard}
            setSelectedCard={setSelectedCard}  leadData = {leadData}  dataMyLead ={dataMyLead}/>
          <CustomSearchBar
            value={searchQuery}
            onChangeText={(query) => setSearchQuery(query)}
            onFilterPress={() => console.log("Filter button pressed")}
          />
          {loading && !loadingMore ? (
            <LeadsSkeleton />
          ) : (
            filteredLeads.map((item, index) => {
              if (
                selectedCard === 2 ||
                selectedCard === 4 ||
                selectedCard === 5
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
                      name={item.leadName}
                      status={item.stage}
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
});

export default Leads;
