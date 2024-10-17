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
import { getAllUsers, getAllUsersMyLead } from "./LeadsService";
import { useNavigation } from "@react-navigation/native";
import { LoginScreenNavigationProp } from "../type";
import { LeadsSkeleton } from "../../Global/Components/SkeletonStructures";
import LeadCard from "../../NewDesine/GlobalComponets/LeadCard";

function Leads() {
  const dispatch = useDispatch();
  const { currLead } = useSelector((state: RootState) => state.auth);
  const [selectedCard, setSelectedCard] = useState<number>(currLead || 1);
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [leadData, setLeadData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [dataMyLead, setDataMyLead] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 25,
    page: 0,
  });
  const [searchQuery, setSearchQuery] = useState<string>("");

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    getAllLeadsData(false, 0);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      setLeadData([]);
      setDataMyLead([]);
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
      return leadsToFilter.filter((lead) =>
        lead.leadName.toLowerCase().startsWith(firstThreeChars)
      );
    }
    return leadsToFilter;
  }, [selectedCard, leadData, dataMyLead, searchQuery]);

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
    if (!loadingMore) {
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
          <LeadStatus
            selectedCard={selectedCard}
            setSelectedCard={setSelectedCard}
            onSearchChange={(query) => setSearchQuery(query)}
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
                  <View key={`${item.id}-${index}`}>
                    <Text>{item.name}</Text>
                  </View>
                );
              } else {
                return (
                  <View style={styles.newAliment} key={index}>
                    <LeadCard
                      imageUrl={require("../../assets/photo.png")}
                      name={item.leadName}
                      location={item.form_name}
                      status={item.stage}
                      projectName={item.projecttype_name}
                      onCallPress={() => handleDialPress(item.leadPhone)}
                      onTextPress={() => handleCardDataLeads(item)}
                    />
                  </View>
                );
              }
            })
          )}
          {loadingMore && (
            <View style={styles.loadingMore}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainCont: {
    backgroundColor: "#F4F9FD",
    height: "100%",
  },
  scrollViewContainer: {
    backgroundColor: "#F4F9FD",
    flexGrow: 1,
  },
  content: {
    backgroundColor: "#F4F9FD",
    paddingHorizontal: 10,
  },
  loadingMore: {
    marginVertical: 20,
    alignItems: "center",
  },
  newAliment: {
    marginHorizontal: 10,
  },
});

export default Leads;
