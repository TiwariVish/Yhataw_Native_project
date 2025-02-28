import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons"; // For icons
import { globalStyles } from "../../GlobalCss/GlobalStyles";
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';

interface CustomCardLeadProps {
  name: string;
  status: string;
  priority 
  form_name :string;
  dateTimeShow:string
  onCallPress: () => void;
  onMorePress: () => void;
  onTextPress?: () => void;
}

const CustomCardLead: React.FC<CustomCardLeadProps> = ({
  name,
  status,
  form_name,
  priority,
  dateTimeShow,
  onCallPress,
  onMorePress,
  onTextPress,
}) => {

const firstLetter = name
? name
    .split(" ")
    .map((m) => {
        const initial = m.charAt(0).toUpperCase(); 
        return m.length >= 3 ? initial : ""; 
    })
    .filter(Boolean) 
    .slice(0, 2) 
    .join("") 
: "";

const formatDateTime = (dateTime: string) => {
  const date = new Date(dateTime);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); 
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; 
  return `${day}-${month}-${year}    ${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
};

const formattedDateTime = dateTimeShow ? formatDateTime(dateTimeShow) : "";


  return (
    <View style={styles.cardContainer}>
      <View style={styles.avatar}>
        <Text
          style={[globalStyles.h5, globalStyles.fs3]}
          allowFontScaling={false}
        >
          {firstLetter}
        </Text>
      </View>
      {priority === 1 && (
  <View style={styles.buzzCircle}>
    <Text     style={[globalStyles.h8, globalStyles.fs3,globalStyles.tc4]}
          allowFontScaling={false}>P</Text>
  </View>
)}
      <TouchableOpacity onPress={onTextPress} style={styles.details}>
        <View>
          <Text
            style={[globalStyles.h7, globalStyles.fs1, globalStyles.tc]}
            allowFontScaling={false}
          >
            {name}
          </Text>
          <Text
            style={[globalStyles.h8, globalStyles.fs3, globalStyles.tc1]}
            allowFontScaling={false}
          >
            {status}
          </Text>
          <Text
            style={[globalStyles.h8, globalStyles.fs3, globalStyles.tc1]}
            allowFontScaling={false}
          >
            {form_name}
          </Text>
          <Text
            style={[globalStyles.h8, globalStyles.fs3, globalStyles.tc1]}
            allowFontScaling={false}
          >
            {<Text
            style={[globalStyles.h8, globalStyles.fs3, globalStyles.tc1]}
            allowFontScaling={false}
          >
            {formattedDateTime}
          </Text>}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={onCallPress} style={styles.icon}>
        {/* <Feather name="phone-call" size={20} color="green" /> */}
        <SimpleLineIcons name="call-out" size={24} color="green" />
      </TouchableOpacity>

      <TouchableOpacity onPress={onMorePress} style={styles.icon}>
        {/* <Feather name="more-vertical" size={24} color="black" /> */}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    position: "relative",
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 50,
    backgroundColor: "#EEEEEE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
  },
  buzzCircle :{
    width: 20,
    height: 20,
    borderRadius: 50,
    backgroundColor: "#FF808B",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute", 
    top: 10, 
    left: 60,
   
  },
  details: {
    flex: 1,
  },

  icon: {
    padding: 8,
  },
});

export default CustomCardLead;
