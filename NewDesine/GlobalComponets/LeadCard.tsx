import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { globalStyles } from "../../GlobalCss/GlobalStyles";

interface CustomCardProps {
  name: string;
  location: string;
  status: string;
  projectName: string;
  onCallPress?: () => void;
  onTextPress?: () => void;
  imageUrl?: any;
}

const LeadCard: React.FC<CustomCardProps> = ({
  name,
  location,
  status,
  onCallPress,
  onTextPress,
  imageUrl,
  projectName,
}) => {
  // const firstLetter = name.charAt(0).toUpperCase();
  // const firstLetter = name ? name.slice(0,2).toUpperCase() : '';
  const firstLetter = name
    ? name
        .split(" ")
        .map((m) => m.charAt(0).toUpperCase())
        .join("")
    : "";
  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardContent}>
        <View style={styles.leftColumn}>
          {imageUrl ? (
            <View style={styles.circleOutline}>
              <Image
                source={{ uri: imageUrl }}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
          ) : (
            <View style={styles.circleOutline}>
              <View style={styles.circleInner}>
                <Text
                  style={[globalStyles.h2, globalStyles.fs3]}
                  allowFontScaling={false}
                >
                  {firstLetter}
                </Text>
              </View>
            </View>
          )}
        </View>
        <TouchableOpacity onPress={onTextPress} style={styles.middleColumn}>
          <View style={styles.nameRow}>
            {status && (
              <View style={styles.statusBadge}>
                <Text
                  style={[globalStyles.h8, globalStyles.fs3, globalStyles.tc4]}
                  allowFontScaling={false}
                >
                  {" "}
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </View>
            )}
            <Text
              style={[globalStyles.h7, globalStyles.fs1, globalStyles.tc]}
              allowFontScaling={false}
            >
              {name}
            </Text>
          </View>
          <Text
            style={[globalStyles.tc2, globalStyles.h8, globalStyles.tc2]}
            allowFontScaling={false}
          >
            {location}
          </Text>
          <Text
            style={[globalStyles.tc2, globalStyles.h8, globalStyles.tc2]}
            allowFontScaling={false}
          >
            {projectName}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onCallPress} style={styles.rightColumn}>
          <View style={styles.callIconCircle}>
            <Feather name="phone-call" size={24} color="#00C853" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 5,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
    width: "100%",
    height: 144,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  leftColumn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  middleColumn: {
    flex: 3,
    justifyContent: "center",
    alignItems: "flex-start",
    width: "75%",
    padding: 10,
  },
  rightColumn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  circleOutline: {
    width: 60,
    height: 60,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#C5C8F7",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "90%",
    height: "90%",
    borderRadius: 25,
  },
  nameRow: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  statusBadge: {
    backgroundColor: "#FF8690",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    marginBottom: 3,
    minWidth: 67,
    minHeight: 23,
    justifyContent: "center",
    alignItems: "center",
  },
  callIconCircle: {
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#00C853",
  },
  circleInner: {
    backgroundColor: "#EEEEEE",
    width: "90%",
    height: "90%",
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
});

export default LeadCard;
