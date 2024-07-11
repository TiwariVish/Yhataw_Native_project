import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import LeadStatus from "./LeadStatus";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const leads = [
  {
    id: 1,
    content: "Bishwajit Mukherjee",
    location: "Godrej-Meridian, Gurugram, Haryana",
  },
  {
    id: 2,
    content: "Jemson Aderson",
    location: "Godrej-Meridian, Gurugram, Haryana",
  },
  {
    id: 3,
    content: "Adam Jamppaa",
    location: "Godrej-Meridian, Gurugram, Haryana",
  },
  { id: 4, content: "John Doe", location: "123 Main St, Anytown, USA" },
  { id: 5, content: "Jane Smith", location: "456 Oak Ave, Springfield, USA" },
  {
    id: 6,
    content: "Michael Johnson",
    location: "789 Elm Rd, Metro City, USA",
  },
];

function Leads() {
  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.content}>
        <LeadStatus />
        {leads.map((item) => (
          <View key={item.id} style={styles.cardContainer}>
            <TouchableOpacity style={styles.card}>
              <View style={styles.textContainer}>
                <Text style={styles.name}>{item.content}</Text>
                <Text style={styles.location}>{item.location}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.phoneIcon}>
              <MaterialCommunityIcons
                name="phone-outline"
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
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
