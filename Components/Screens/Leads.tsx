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
import {
  selectCurrLead,
  setLeadDatad,
  setMyLeadData,
} from "../../Redux/authSlice";
import store, { RootState } from "../../utils/store";
import { getAllUsers, getAllUsersMyLead } from "./LeadsService";
import { useNavigation } from "@react-navigation/native";
import { LoginScreenNavigationProp } from "../type";
import { LeadsSkeleton } from "../../Global/Components/SkeletonStructures";
import { getDataMylead } from "./DashboardService";
import { globalStyles } from "../../GlobalCss/GlobalStyles";

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
    getAllLeadsData(false,0);
  }, []);

  const getAllLeadsData = async (isLoadMore = false,pageNo:any) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      let payload = {
        userId: store.getState().auth.userId,
        lead_id: offialDetailState.team_id?.id,
        pageNo: pageNo,
        pageSize: paginationModel.pageSize,
      };
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
        leadsToFilter = [{ id: 1, name: 'NO DATA FOUNDS' }];
        break;
      case 3:
        leadsToFilter = dataMyLead;
        break;
      case 4:
        leadsToFilter = [{ id: 1, name: 'NO DATA FOUNDS' }];
        break;
      case 5:
        leadsToFilter = [{ id: 1, name: 'NO DATA FOUNDS' }];
        break;
      case 6:
        leadsToFilter = [];
        break;
      default:
        leadsToFilter = [];
        break;
    }

    if (searchQuery) {
      const firstChar = searchQuery.charAt(0).toLowerCase(); 
      return leadsToFilter.filter(
        (lead) =>
          lead.leadName.toLowerCase().startsWith(firstChar) 
        // || lead.project_name.toLowerCase().includes(searchQuery.toLowerCase())
        
      );
  
    }

    return leadsToFilter;
  };

  const handleCardDataLeads = (item: any) => {
    switch (selectedCard) {
      case 1:
        dispatch(setLeadDatad(item));
        navigation.navigate("LeadInfoScreen");
        break;
      case 2:
        "";
        break;
      case 3:
        dispatch(setMyLeadData(item));
        navigation.navigate("LeadInfoScreen");
        break;
    }
    // dispatch(setLeadDatad(item));
    // dispatch(setMyLeadData(item))
    // navigation.navigate("LeadInfoScreen");
  };

  const filteredLeads = getFilteredLeads();



  const handleLoadMore = (pageToGo:any) => {
    if (!loadingMore) {
      setPaginationModel((prevModel) => ({
        ...prevModel,
        page:pageToGo,
      }));
      getAllLeadsData(true,pageToGo);
    }
  };

  const scrollToCard = (index: number) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: index * 135, animated: true });
    }
  };

  const handleDialPress = (phoneNumber) => {
    // const phoneNumber = '1234567890';
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
  };

  return (
    <>
      <View style={styles.mainCont}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContainer}
          onScroll={({ nativeEvent }) => {
            const { layoutMeasurement, contentOffset, contentSize } =
              nativeEvent;
            if (
              layoutMeasurement.height + contentOffset.y >=
              contentSize.height - 20
            ) {
              handleLoadMore(paginationModel.page+1);
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
              filteredLeads?.map((item, index) => {
                if (selectedCard === 2) {
                  return (
                    <View key={`${item.id}-${index}`}>
                      <Text >{item.name}</Text>
                    </View>
                  );
                }

                else if(selectedCard === 4){
                  return (
                    <View key={`${item.id}-${index}`}>
                      <Text >{item.name}</Text>
                    </View>
                  );
                }

                else if(selectedCard === 5){
                  return (
                    <View key={`${item.id}-${index}`}>
                      <Text >{item.name}</Text>
                    </View>
                  );
                }
                
                else {
                  return (
                    <>
                    <View key={`${item._id}-${index}`} style={styles.cardContainer}>
                      <TouchableOpacity
                        style={styles.card}
                        onPress={() => handleCardDataLeads(item)}
                      >
                        <View style={styles.statusBadge}>
                          <Text style={[styles.statusText,globalStyles.h8]} allowFontScaling={false}>{item.stage}</Text>
                        </View>
                        <View style={styles.textContainer}>
                          <Text style={[globalStyles.h5,globalStyles.fontfm]} allowFontScaling={false}>{item.leadName}</Text>
                          <Text style={[globalStyles.h7,globalStyles.fontfm]} allowFontScaling={false}>{item.form_name}</Text>
                          <Text style={[globalStyles.h7,globalStyles.fontfm]} allowFontScaling={false}>
                            {item.projecttype_name}
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.phoneIcon}
                        onPress={() => handleDialPress(item.leadPhone)}
                      >
                        <MaterialCommunityIcons
                          name="phone-outline"
                          size={24}
                          color="black"
                        />
                      </TouchableOpacity>
                    </View>
                       <View style={styles.border}></View>
                       </>
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
    </>
  );
}

const styles = StyleSheet.create({
  mainCont: {
    backgroundColor: "white",
    height: "100%",
  },
  scrollViewContainer: {
    backgroundColor: "white",
    flexGrow: 1,
  },
  content: {
    backgroundColor: "white",
    paddingHorizontal: 10,
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  card: {
    flex: 1,
  },
  textContainer: {
    paddingHorizontal: 10,
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
  },
  border:{
      borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginTop:10
  }
});

export default Leads;
