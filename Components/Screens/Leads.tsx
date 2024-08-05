import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, ActivityIndicator } from "react-native";
import LeadStatus from "./LeadStatus";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrLead, setLeadDatad } from "../../Redux/authSlice";
import store, { RootState } from "../../utils/store";
import { getAllUsers } from "./LeadsService";
import { useNavigation } from "@react-navigation/native";
import { LoginScreenNavigationProp } from "../type";
import { LeadsSkeleton } from "../../Global/Components/SkeletonStructures";

function Leads() {
  const dispatch = useDispatch();
  const { currLead } = useSelector((state: RootState) => state.auth);
  const [selectedCard, setSelectedCard] = useState<number>(currLead || 1);
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [leadData, setLeadData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [offialDetailState, setOffialDetailState] = useState<any>({});
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 25,
    page: 0,
  });

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
    switch (selectedCard) {
      case 1:
        return leadData;
      case 2:
        return leadData;
      default:
        return leadData;
    }
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

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.scrollViewContainer}
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 20) {
            handleLoadMore();
          }
        }}
        scrollEventThrottle={16}
      >
        <View style={styles.content}>
          <LeadStatus selectedCard={selectedCard} setSelectedCard={setSelectedCard} />
          {loading && !loadingMore ? (
            <LeadsSkeleton />
          ) : (
            filteredLeads?.map((item,index) => (
              <View  key={`${item._id}-${index}`} style={styles.cardContainer}>
                <TouchableOpacity style={styles.card} onPress={() => handleCardDataLeads(item)}>
                  <View style={styles.textContainer}>
                    <Text style={styles.name}>{item.leadName}</Text>
                    <Text style={styles.location}>{item.form_name}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.phoneIcon}>
                  <MaterialCommunityIcons name="phone-outline" size={24} color="black" />
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
    flexGrow: 1,
    paddingVertical: 20,
  },
  content: {
    paddingHorizontal: 10,
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingHorizontal: 15,
    marginHorizontal: 18,
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
});

export default Leads;
