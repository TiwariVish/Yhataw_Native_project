import React, { useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { SimpleLineIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";
import styles from "./Footer.style";

function Footer({ navigate }) {
  const [selectedIcon, setSelectedIcon] = useState(null);
  const handleIconPress = (iconName) => {
    setSelectedIcon(iconName);
    if (iconName === "user") {
      navigate("UserProfile"); // Adjust the route name as needed
    }
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

export default Footer;
