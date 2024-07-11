import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { AntDesign } from "@expo/vector-icons"; // Assuming you are using Expo icons

interface CustomProps {
  cardContent: React.ReactNode;
  cardColor?: string; // Optional prop for card background color
  calendarBackgroundColor?: string; // Optional prop for calendar icon background color
  calendarText: string;
}

const CustomCard: React.FC<CustomProps> = ({
  cardContent,
  cardColor = "#e6e6e6", // Default card background color
  calendarBackgroundColor = "#666666", // Default calendar icon background color
  calendarText, // Dynamic calendar text
}) => {
  return (
    <View style={[styles.card, { backgroundColor: cardColor }]}>
      <View style={styles.rowContainer}>
        <View
          style={[
            styles.calendarIcon,
            { backgroundColor: calendarBackgroundColor },
          ]}
        >
          <AntDesign name="calendar" size={24} color="white" />
        </View>
        <Text style={styles.calendarText}>{calendarText}</Text>
      </View>
      <View style={styles.cardContent}>{cardContent}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 10,
    borderRadius: 10,
    width: 180,
    // marginBottom: 20,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Space evenly between items
  },
  calendarIcon: {
    borderRadius: 50,
    height: 55,
    width: 55,
    justifyContent: "center", // Center content vertically
    alignItems: "center",
  },
  calendarText: {
    fontSize: 26,
    color: "black",
    marginLeft: 5,
  },
  cardContent: {
    marginTop: 10,
  },
});

export default CustomCard;
