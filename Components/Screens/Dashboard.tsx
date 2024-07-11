import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import CustomCard from "../../Global/Components/CustomCard";
import Footer from "../../Global/Components/Footer";
import DashboardModelView from "../../Global/PopAndModels/DashboardModelView";
import { LoginScreenNavigationProp } from "../type"; // Import the types

const data = [
  { id: 1, content: "Card 1" },
  { id: 2, content: "Card 2" },
  { id: 3, content: "Card 3" },
];

const leads = [
  {
    id: "1",
    content: "New Leads",
    cardColor: "#ffa899",
    calendarBackgroundColor: "#ff2600",
  },
  {
    id: "2",
    content: "Site Visit",
    cardColor: "#99e6ff",
    calendarBackgroundColor: "#1a1aff",
  },
  {
    id: "3",
    content: "Pipeline",
    cardColor: "#c1f0c1",
    calendarBackgroundColor: "#009900",
  },
  {
    id: "4",
    content: "Cancelled",
    cardColor: "#c1f0c1",
    calendarBackgroundColor: "#009900",
  },
  {
    id: "5",
    content: "Done",
    cardColor: "#c1f0c1",
    calendarBackgroundColor: "#009900",
  },
];

const attendance = [
  { id: 1, content: "Present" },
  { id: 2, content: "Absent" },
  { id: 3, content: "Late" },
  { id: 4, content: "Leave" },
];

const myProjects = [
  { id: 1, content: "Commercial" },
  { id: 2, content: "Residential" },
];
const Dashboard = () => {
  const [dashboardDataAllLead, setDashboardDataAllLead] = useState<any>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigation = useNavigation<LoginScreenNavigationProp>();

  useEffect(() => {
    // getDataAllLead();
  }, []);

  const navigateToSection = (item) => {
    navigation.navigate("Leads");
    setModalVisible(false);
    console.log("Navigate to:", item.content);
  };

  const hadleprofile = () => {
    navigation.navigate("MyProfile");
  };

  const handleCardClick = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  return (
    <>
      <ScrollView>
        {/* Header section */}
        <View style={styles.row}>
          <View style={styles.cont}>
            <Image
              source={require("../../assets/crm_icon.png")}
              style={styles.image}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.name}>Vishal Tiwari</Text>
            <Text style={styles.role}>Sales Executive</Text>
          </View>
        </View>

        {/* Horizontal cards section */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
        >
          {data.map((item) => (
            <View key={item.id} style={styles.card}>
              <Text>{item.content}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Leads section */}
        <View style={[styles.row, styles.footer]}>
          <View style={styles.textContainer}>
            <Text style={styles.name}>All Leads</Text>
            <Text style={styles.role}>54657 total</Text>
          </View>
          <AntDesign name="right" size={24} color="black" />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
        >
          {leads.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleCardClick(item)}
            >
              <View style={styles.cardContainer}>
                <CustomCard
                  cardContent={<Text>{item.content}</Text>}
                  cardColor={item.cardColor}
                  calendarBackgroundColor={item.calendarBackgroundColor}
                  calendarText={""}
                />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Attendance section */}
        <View style={[styles.row, styles.footer]}>
          <View style={styles.textContainer}>
            <Text style={styles.name}>All Attendance</Text>
            <Text style={styles.role}>days 31</Text>
          </View>
          <AntDesign name="right" size={24} color="black" />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
        >
          {attendance.map((item) => (
            <View key={item.id} style={styles.cardContainer}>
              <CustomCard
                cardContent={<Text>{item.content}</Text>}
                calendarText={""}
              />
            </View>
          ))}
        </ScrollView>

        {/* Projects section */}
        <View style={[styles.row, styles.footer]}>
          <View style={styles.textContainer}>
            <Text style={styles.name}>My Project</Text>
            <Text style={styles.role}>days 31</Text>
          </View>
          <AntDesign name="right" size={24} color="black" />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
        >
          {myProjects.map((item) => (
            <View key={item.id} style={styles.cardContainer}>
              <CustomCard
                cardContent={<Text>{item.content}</Text>}
                calendarText={""}
              />
            </View>
          ))}
        </ScrollView>
      </ScrollView>

      {/* Modal section */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <DashboardModelView navigateToSection={navigateToSection} />
              {/* <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Footer navigate={hadleprofile} />
    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    margin: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    margin: 15,
    justifyContent: "space-between",
  },
  image: {
    width: 35,
    height: 35,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  role: {
    fontSize: 14,
    color: "gray",
  },
  cont: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "gray",
    borderColor: "gray",
    borderWidth: 1,
    padding: 16,
    margin: 15,
    borderRadius: 8,
    height: 135,
    width: 350,
  },
  horizontalScroll: {
    flexDirection: "row",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 415,
    height: 627,
    marginTop: 225,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#2196F3",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Dashboard;
