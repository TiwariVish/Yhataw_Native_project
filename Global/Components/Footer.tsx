import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { SimpleLineIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";

function Footer({ navigate }) {
  const [selectedIcon, setSelectedIcon] = useState(null);

  const handleIconPress = (iconName) => {
    setSelectedIcon(iconName);
    if (iconName === "user") {
      navigate("UserProfile"); // Adjust the route name as needed
    }
    // Add navigation for other icons if needed
  };

  const getBorderPosition = () => {
    switch (selectedIcon) {
      case "home":
        return 0;
      case "pluscircle":
        return 140;
      case "user":
        return 309;
      default:
        return 0;
    }
  };

  return (
    <>
      <View style={styles.row}>
        <SimpleLineIcons
          name="home"
          size={35}
          color="blue"
          onPress={() => handleIconPress("home")}
        />
        <AntDesign
          name="pluscircle"
          size={60}
          color="blue"
          onPress={() => handleIconPress("pluscircle")}
        />
        <EvilIcons
          name="user"
          size={50}
          color="black"
          onPress={() => handleIconPress("user")}
        />
      </View>
      <View style={[styles.borderButton, { left: getBorderPosition() }]}></View>
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  borderButton: {
    position: "absolute",
    bottom: 0,
    height: 5,
    width: 60,
    backgroundColor: "blue",
    alignSelf: "center",
  },
});

export default Footer;
