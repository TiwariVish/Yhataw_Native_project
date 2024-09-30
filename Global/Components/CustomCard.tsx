import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { AntDesign } from "@expo/vector-icons"; 
import { globalStyles } from "../../GlobalCss/GlobalStyles";

interface CustomProps {
  cardContent: React.ReactNode;
  cardColor?: string; 
  calendarBackgroundColor?: string; 
  calendarText;
}

const CustomCard: React.FC<CustomProps> = ({
  cardContent,
  cardColor = "#e6e6e6", 
  calendarBackgroundColor = "#666666", 
  calendarText, 
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
          <AntDesign name="calendar" size={15} color="white" />
        </View>
        <Text style={[styles.calendarText,globalStyles.h5,globalStyles.fs2,]}  allowFontScaling={false}>{calendarText}</Text>
      </View>
      <View style={styles.cardContent}>
      <Text style={[styles.calendarText,globalStyles.h5,globalStyles.fs2,]}  allowFontScaling={false}> {cardContent}</Text>
       </View>
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
    justifyContent: "space-between", 
  },
  calendarIcon: {
    borderRadius: 50,
    height: 35,
    width: 35,
    justifyContent: "center", 
    alignItems: "center",
  },
  calendarText: {
    marginLeft: 5,
  },
  cardContent: {
    marginTop: 10,
  },
});

export default CustomCard;
