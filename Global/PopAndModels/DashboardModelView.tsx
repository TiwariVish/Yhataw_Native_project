import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { color } from "@mui/system";

const data = [
  {
    id: 1,
    name: "My Leads",
    image: require("../../assets/myLeads.png"),
    color: { backgroundColor: "#e4c49b" },
  },
  {
    id: 2,
    name: "Planned Site Visit",
    color: { backgroundColor: "#d1ecf1" },
    image: require("../../assets/plannedSiteVisit.png"),
  },
  {
    id: 3,
    name: "Walk-in Site Visit",
    color: { backgroundColor: "#eea891" },
    image: require("../../assets/customericon.png"),
  },
  {
    id: 4,
    name: "Customer Feedback",
    color: { backgroundColor: "#66cc94" },
    image: require("../../assets/customericon.png"),
  },
];

const DashboardModelView = () => { 
  // { navigateToSection }
  return (
    <ScrollView>
      <View>
        <Text style={styles.title}>Browse Category</Text>
      </View>
      {data.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[styles.card, item.color]}
          // onPress={() => navigateToSection(item)}
        >
          <Image source={item.image} style={styles.image} />
          <View style={styles.textContainer}>
            <Text style={styles.name}>{item.name}</Text>
          </View>
          <AntDesign name="arrowright" size={30} color="black" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 8,
    width: 360,
    height: 125,
    elevation: 5,
    margin: 10,
  },
  image: {
    width: 100,
    height: 95,
    borderRadius: 10,
    marginLeft: 5,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 18,
  },
  position: {
    fontSize: 14,
    color: "#666",
  },
});

export default DashboardModelView;
