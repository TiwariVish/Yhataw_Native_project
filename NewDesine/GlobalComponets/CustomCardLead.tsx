import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons"; // For icons
import { globalStyles } from "../../GlobalCss/GlobalStyles";
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';

interface CustomCardLeadProps {
  name: string;
  status: string;
  onCallPress: () => void;
  onMorePress: () => void;
  onTextPress?: () => void;
}

const CustomCardLead: React.FC<CustomCardLeadProps> = ({
  name,
  status,
  onCallPress,
  onMorePress,
  onTextPress,
}) => {
//   const initials = name
//     .split(" ")
//     .map((word) => word[0])
//     .join("")
//     .toUpperCase();

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

  return (
    <View style={styles.cardContainer}>
      <View style={styles.avatar}>
        <Text
          style={[globalStyles.h2, globalStyles.fs3]}
          allowFontScaling={false}
        >
          {firstLetter}
        </Text>
      </View>
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
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={onCallPress} style={styles.icon}>
        {/* <Feather name="phone-call" size={20} color="green" /> */}
        <SimpleLineIcons name="call-out" size={24} color="green" />
      </TouchableOpacity>

      <TouchableOpacity onPress={onMorePress} style={styles.icon}>
        <Feather name="more-vertical" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 3,
    elevation: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: "#EEEEEE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  details: {
    flex: 1,
  },

  icon: {
    padding: 8,
  },
});

export default CustomCardLead;
