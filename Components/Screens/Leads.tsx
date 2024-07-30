import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from "react-native";
import LeadStatus from "./LeadStatus";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { selectCurrLead, setLeadDatad } from "../../Redux/authSlice";
import { useSelector } from "react-redux";
import store, { RootState } from "../../utils/store";
import { getAllTeamData, getAllUsers } from "./LeadsService";
import { useNavigation } from "@react-navigation/native";
import { LoginScreenNavigationProp } from "../type";
import { useDispatch } from "react-redux";

function Leads() {
  const dispatch = useDispatch();

  const { currLead } = useSelector((state: RootState) => state.auth);
  const [selectedCard, setSelectedCard] = useState<number>(currLead || 1);
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [leadData, setLeadData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [offialDetailState, setOffialDetailState] = useState<any>({});
   const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 25,
    page: 0,
  });
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
  const id = open ? "simple-popover" : undefined;
  useEffect(() => {
    getAllLeadsData(id)
  }, []);

  

  const payload = {
    userId: store.getState().auth.userId,
    lead_id:offialDetailState.team_id?.id,
    pageNo: paginationModel.page,
    pageSize: paginationModel.pageSize,
  };

  const getAllLeadsData = async(id: any) =>{
    try{
      setLoading(true);
      const response = await getAllUsers(payload);
      // setLeadData(response.data);
      setLeadData(prevLeads => [...prevLeads, ...response.data]);
      setLoading(false);
    }
    catch{
      setLoading(false);
    }
  }
  console.log(leadData,'leadDataleadData================');

  const handleCardDataLeads = (item: any) => {
    console.log(item,":::::::::::::::::::");
    // setLeadData(item);
    dispatch(setLeadDatad(item));
    navigation.navigate("LeadInfoScreen");
  };
  

  const filteredLeads = getFilteredLeads();

  return (
    <>
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.content}>
        <LeadStatus selectedCard={selectedCard} setSelectedCard={setSelectedCard} />
        {filteredLeads?.map((item) => (
          <View key={item.id} style={styles.cardContainer}>
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
        ))}
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
});

export default Leads;
