import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons"; 
import CustomCardNew from "../GlobalComponets/CustomCardNew"; 
import FotterDseine from "../GlobalComponets/FotterDseine";
import CustomBigCard from "../GlobalComponets/CustomBigCard";

const DashboardNew = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Shawn Stone",
      post: "Middle",
      imageUrl: require("../../assets/photo.png"),
      avatarColor: "#ff6f61",
    },
    {
      id: 2,
      name: "Randy Delgado",
      post: "Junior",
      imageUrl: require("../../assets/user_icon.png"),
      avatarColor: "#4caf50",
    },
    {
      id: 3,
      name: "Emily Johnson",
      post: "Junior",
      imageUrl: require("../../assets/user_icon.png"),
      avatarColor: "#2196f3",
    },
    {
      id: 4,
      name: "Sarah Lee",
      post: "Junior",
      imageUrl: require("../../assets/user_icon.png"),
      avatarColor: "#ff9800",
    },
    {
      id: 5,
      name: "Tom Smith",
      post: "Junior",
      imageUrl: require("../../assets/action_button.png"),
      avatarColor: "#9c27b0",
    },
    {
      id: 6,
      name: "Anna Bell",
      post: "Junior",
      imageUrl: require("../../assets/action_button.png"),
      avatarColor: "#795548",
    },
  ];

  const allLead = [
    { id: 1, title: "Just Now", count: "4520", avatarColor: "#ff6f61" },
    { id: 2, title: "Site Visit", count: "45102", avatarColor: "#4caf50" },
    { id: 3, title: "Follow Up", count: "5478", avatarColor: "#2196f3" },
    { id: 4, title: "Closed", count: "4645", avatarColor: "#ff9800" },
  ];

  const projectData = [
    {
      id: "PN0001265",
      title: "Medical App (iOS native)",
      createdDate: "Sep 12, 2020",
      priority: "Medium",
      projectData: {
        tasks: 40,
        activeTasks: 13,
        assignees: [
          { id: 1, imageUrl: require("../../assets/user_icon.png") },
          { id: 2, imageUrl: require("../../assets/user_icon.png") },
          { id: 3, imageUrl: require("../../assets/user_icon.png") },
          { id: 4, imageUrl: require("../../assets/user_icon.png") },
          { id: 5, imageUrl: require("../../assets/user_icon.png") },
          { id: 6, imageUrl: require("../../assets/user_icon.png") },
          { id: 7, imageUrl: require("../../assets/user_icon.png") },
          { id: 8, imageUrl: require("../../assets/user_icon.png") },
          { id: 9, imageUrl: require("../../assets/user_icon.png") },
          { id: 10, imageUrl: require("../../assets/user_icon.png") },
          { id: 11, imageUrl: require("../../assets/user_icon.png") },
          { id: 12, imageUrl: require("../../assets/user_icon.png") },
          { id: 13, imageUrl: require("../../assets/user_icon.png") },
        ],
      },
    },
    {
      id: "PN0001435",
      title: "Medical App (iOS native)",
      createdDate: "Sep 12, 2020",
      priority: "High",
      projectData: {
        tasks: 40,
        activeTasks: 13,
        assignees: [
          { id: 1, imageUrl: require("../../assets/user_icon.png") },
          { id: 2, imageUrl: require("../../assets/user_icon.png") },
          { id: 3, imageUrl: require("../../assets/user_icon.png") },
        ],
      },
    },
  ];
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require("../../assets/Logo.png")} style={styles.logo} />
        <View style={styles.headerIcons}>
          <Feather name="search" size={24} color="black" />
          <MaterialIcons name="notifications-none" size={24} color="black" />
        </View>
      </View>

      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>Welcome Vishal Tiwari</Text>
        <Text style={styles.subTitle}>Sales Executive</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>All Leads</Text>
            <Text style={styles.totalCount}>564 Total</Text>
            <TouchableOpacity style={styles.viewAllContainer}>
              <Text style={styles.viewAll}>View all</Text>
              <Feather
                name="chevron-right"
                size={18}
                color="#007bff"
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            <View style={styles.leadsContainer}>
              {allLead.map((lead) => (
                <CustomCardNew
                  key={lead.id}
                  title={lead.title}
                  count={lead.count}
                  iconName="calendar"
                  post=""
                  iconBackgroundColor={lead.avatarColor}
                  style={styles.cardSpacing}
                />
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>All Team</Text>
            <Text style={styles.totalCount}>564 Total</Text>
            <TouchableOpacity style={styles.viewAllContainer}>
              <Text style={styles.viewAll}>View all</Text>
              <Feather
                name="chevron-right"
                size={18}
                color="#007bff"
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            <View style={styles.leadsContainer}>
              {teamMembers.map((member) => (
                <CustomCardNew
                  key={member.id}
                  title={member.name}
                  post="Post Name"
                  count=""
                  postCounter={member.post}
                  iconName=""
                  iconBackgroundColor=""
                  imageUrl={member.imageUrl}
                  style={styles.cardSpacing}
                />
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Projects</Text>
            <Text style={styles.totalCount}>453 Total</Text>
            <TouchableOpacity style={styles.viewAllContainer}>
              <Text style={styles.viewAll}>View all</Text>
              <Feather
                name="chevron-right"
                size={18}
                color="#007bff"
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            <View style={styles.leadsContainer}>
              {projectData.map((project) => (
                <CustomBigCard
                  key={project.id}
                  id={project.id}
                  title={project.title}
                  createdDate={project.createdDate}
                  priority={project.priority}
                  projectData={project.projectData}
                  style={styles.cardSpacing}
                  onPress={() => console.log(`Card Pressed: ${project.id}`)}
                />
              ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
      {/* <FotterDseine /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F9FD",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 26,
    height: 30,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 20,
  },
  welcomeSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subTitle: {
    color: "#6c757d",
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  viewAllContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAll: {
    color: "#007bff",
    marginRight: 5,
  },
  icon: {
    marginLeft: 5,
  },
  horizontalScroll: {
    paddingVertical: 10,
  },
  leadsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardSpacing: {
    marginHorizontal: 5,
  },
  totalCount: {
    marginRight: 125,
  },
});

export default DashboardNew;
