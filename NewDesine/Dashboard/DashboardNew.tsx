import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";
import FunnelChart from "react-native-funnel-chart";
import { Dimensions } from "react-native";
import { globalStyles } from "../../GlobalCss/GlobalStyles";
import { Feather } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

const DashboardNew = () => {
  const [activeTab, setActiveTab] = useState("Presale Pipeline");
  const funnelData = [
    { label: "Initial", value: 100, color: "#A7C7E7" }, 
    { label: "Call Back", value: 75, color: "#A8E6CF" }, 
    { label: "Not Interested", value: 50, color: "#FFE082" }, 
    { label: "Interested", value: 30, color: "#FFCCBC" },
    { label: "Closed", value: 20, color: "#FFABAB" }, 
  ];
  
  const funnelData1 = [
    { label: "Initial", value: 107, color: "#A7C7E7" }, 
    { label: "Qualified", value: 50, color: "#A8E6CF" }, 
    { label: "Proposal Sent", value: 50, color: "#FFE082" }, 
    { label: "Negotiation", value: 30, color: "#FFCCBC" }, 
    { label: "Closed", value: 20, color: "#FFABAB" }, 
  ];
  

  

  const barChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{ data: [50, 80, 100, 75, 120, 95] }],
  };

  const pieChartData = [
    {
      name: "Completed",
      population: 40,
      color: "#A8E6CF", // Light Pastel Green
      legendFontColor: "#000",
      legendFontSize: 14,
    },
    {
      name: "Pending",
      population: 30,
      color: "#FFCCBC", // Light Pastel Orange
      legendFontColor: "#000",
      legendFontSize: 14,
    },
    {
      name: "Failed",
      population: 20,
      color: "#FFABAB", // Light Pastel Red
      legendFontColor: "#000",
      legendFontSize: 14,
    },
    {
      name: "In Progress",
      population: 10,
      color: "#B3E5FC", // Light Pastel Blue
      legendFontColor: "#000",
      legendFontSize: 14,
    },
    {
      name: "Partial",
      population: 15,
      color: "#D4E157", // Light Pastel Yellow-Green
      legendFontColor: "#000",
      legendFontSize: 14,
    },
  ];
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {/* <Image
          source={require("../../assets/new_pulse_logo.png")}
          style={styles.image}
          resizeMode="contain"
        /> */}
        <View style={styles.textContainer}>
          <Text
            style={[globalStyles.fs1, globalStyles.h5, globalStyles.tc]}
            allowFontScaling={false}
          >
            Arjun Nanda
          </Text>
          <Text
            style={[globalStyles.h8, globalStyles.fs3, globalStyles.tc1]}
            allowFontScaling={false}
          >
            Admin
          </Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Opportunity</Text>
          <TouchableOpacity
            style={styles.viewAllContainer}
            // onPress={() => navigateToSection(1)}
          >
            <Text
              style={[
                styles.viewAll,
                globalStyles.h7,
                globalStyles.fontfm,
                globalStyles.tc3,
              ]}
              allowFontScaling={false}
            >
              View all
            </Text>
            <Feather
              name="chevron-right"
              size={20}
              color="#3F8CFF"
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Presale Pipeline" && styles.activeTab]}
          onPress={() => setActiveTab("Presale Pipeline")}
        >
          <Text style={[styles.tabText, activeTab === "Presale Pipeline" && styles.activeTabText]}>
            Presale Pipeline
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "Sale Pipeline" && styles.activeTab]}
          onPress={() => setActiveTab("Sale Pipeline")}
        >
          <Text style={[styles.tabText, activeTab === "Sale Pipeline" && styles.activeTabText]}>
            Sale Pipeline
          </Text>
        </TouchableOpacity>
      </View>
      {activeTab === "Presale Pipeline" ? (
        <FunnelChart data={funnelData} width={screenWidth - 40} height={320} />
      ) : (
        <FunnelChart data={funnelData1} width={screenWidth - 40} height={320} />
      )}
      </View>

      <View style={styles.chartContainer}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Lead Source</Text>
          <TouchableOpacity
            style={styles.viewAllContainer}
            // onPress={() => navigateToSection(1)}
          >
            <Text
              style={[
                styles.viewAll,
                globalStyles.h7,
                globalStyles.fontfm,
                globalStyles.tc3,
              ]}
              allowFontScaling={false}
            >
              View all
            </Text>
            <Feather
              name="chevron-right"
              size={20}
              color="#3F8CFF"
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>

        <PieChart
          data={pieChartData}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>

      <View style={styles.chartContainer}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Project Leads</Text>
          <TouchableOpacity
            style={styles.viewAllContainer}
            // onPress={() => navigateToSection(1)}
          >
            <Text
              style={[
                styles.viewAll,
                globalStyles.h7,
                globalStyles.fontfm,
                globalStyles.tc3,
              ]}
              allowFontScaling={false}
            >
              View all
            </Text>
            <Feather
              name="chevron-right"
              size={20}
              color="#3F8CFF"
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>

        <BarChart
          data={barChartData}
          width={screenWidth - 40}
          height={220}
          yAxisLabel=""
          yAxisSuffix="%"
          chartConfig={{
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 8 },
            barPercentage: 0.6,
          }}
          style={{ borderRadius: 8 }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 10,
    marginTop: 20,
  },
  image: {
    height: 40,
    width: 40,
  },
  textContainer: {
    marginLeft: 20,
  },
  chartContainer: {
    marginTop: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginHorizontal: 10,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // marginBottom: 10,
  },
  viewAllContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  viewAll: {
    fontSize: 14,
    color: "#3F8CFF",
    fontWeight: "500",
    marginRight: 4,
  },
  icon: {
    marginTop: 2,
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    margin:15
   
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#3F8CFF",
  },
  tabText: {
    fontSize: 16,
    color: "#888",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#3F8CFF",
    fontWeight: "bold",
  },
});

export default DashboardNew;
