import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  ActivityIndicator,
  Linking,
} from "react-native";
import LeadStatus from "./LeadStatus";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrLead, setLeadDatad } from "../../Redux/authSlice";
import store, { RootState } from "../../utils/store";
import { getAllUsers, getAllUsersMyLead } from "./LeadsService";
import { useNavigation } from "@react-navigation/native";
import { LoginScreenNavigationProp } from "../type";
import { LeadsSkeleton } from "../../Global/Components/SkeletonStructures";
import { getDataMylead } from "./DashboardService";

function Leads() {
  const dispatch = useDispatch();
  const { currLead } = useSelector((state: RootState) => state.auth);
  const [selectedCard, setSelectedCard] = useState<number>(currLead || 1);
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [leadData, setLeadData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [dataMyLead, setDataMyLead] = useState<any>([]);
  const [offialDetailState, setOffialDetailState] = useState<any>({});
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 25,
    page: 0,
  });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    getAllLeadsData();
  }, []);

  const payload = {
    userId: store.getState().auth.userId,
    lead_id: offialDetailState.team_id?.id,
    pageNo: paginationModel.page,
    pageSize: paginationModel.pageSize,
  };

  const getAllLeadsData = async (isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      const response = await getAllUsers(payload);
      setLeadData((prevLeads) => [...prevLeads, ...response.data]);
      const response2 = await getAllUsersMyLead(payload);
      setDataMyLead((prevLeads) => [...prevLeads, ...response2.data]);
      if (isLoadMore) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    } catch {
      setLoading(false);
      setLoadingMore(false);
    }
  };
  const getFilteredLeads = () => {
    let leadsToFilter = [];
    switch (selectedCard) {
      case 1:
        leadsToFilter = leadData;
        break;
      case 2:
        leadsToFilter = [];
        break;
      case 3:
        leadsToFilter = dataMyLead;
        break;
      default:
        leadsToFilter = [];
        break;
    }

    if (searchQuery) {
      return leadsToFilter.filter(
        (lead) =>
          lead.leadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.project_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return leadsToFilter;
  };

  const handleCardDataLeads = (item: any) => {
    dispatch(setLeadDatad(item));
    navigation.navigate("LeadInfoScreen");
  };

  const filteredLeads = getFilteredLeads();

  const handleLoadMore = () => {
    if (!loadingMore) {
      setPaginationModel((prevModel) => ({
        ...prevModel,
        page: prevModel.page + 1,
      }));
      getAllLeadsData(true);
    }
  };

  const scrollToCard = (index: number) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: index * 135, animated: true });
    }
  };

  const handleDialPress = () => {
    const phoneNumber = '1234567890'; 
    const url = `tel:${phoneNumber}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          console.log('Phone dialer is not available');
        }
      })
      .catch((err) => console.error('Error opening dialer:', err));
  };


  return (
    <>
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
            filteredLeads?.map((item, index) => (
              <View key={`${item._id}-${index}`} style={styles.cardContainer}>
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => handleCardDataLeads(item)}
                >
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{item.stage}</Text>
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.name}>{item.leadName}</Text>
                    <Text style={styles.location}>{item.form_name}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.phoneIcon} onPress={handleDialPress}>
                  <MaterialCommunityIcons
                    name="phone-outline"
                    size={24}
                    color="black"
                  />
                </TouchableOpacity>
              </View>
            ))
          )}
          {loadingMore && (
            <View style={styles.loadingMore}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    backgroundColor: "white",
    flexGrow: 1,
    // paddingVertical: 20,
  },
  content: {
    backgroundColor: "white",
    paddingHorizontal: 10,
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingHorizontal: 10,
    // marginHorizontal: 18,
    marginVertical: 10,
    paddingVertical: 10,
  },
  card: {
    flex: 1,
  },
  textContainer: {
    paddingHorizontal: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  location: {
    fontSize: 14,
    color: "#888",
  },
  phoneIcon: {
    height: 50,
    width: 50,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  loadingMore: {
    marginVertical: 20,
    alignItems: "center",
  },
  statusBadge: {
    backgroundColor: "#FF6B6B",
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
    margin: 6,
  },
  statusText: {
    color: "#FFF",
    fontSize: 12,
  },
});

export default Leads;
