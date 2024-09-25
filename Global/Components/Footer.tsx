import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity, Text } from "react-native";
import BottomSheetModal from "../PopAndModels/BottomSheetModal";
import { getPerosnalDetails } from "../../Components/Screens/MyProfileService";
import store from "../../utils/store";
import { Avatar } from 'react-native-paper';

function Footer({ navigate }) {
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await getPerosnalDetails(store.getState().auth?.userId);
      setUserData(response.data);
    } catch (error: any) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleIconPress = (iconName) => {
    setSelectedIcon(iconName);
    if (iconName === "user") {
      navigate("UserProfile");
    }
    if (iconName === "pluscircle") {
      setIsVisible(true); // Show modal when plus circle icon is pressed
    }
  };

  return (
    <>
      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => handleIconPress("home")}
        >
          <Image
            source={require("../../assets/home_icon.png")}
            style={styles.icon}
          />
          <Text style={styles.iconLabel}>Home</Text>
        </TouchableOpacity>

        <View style={styles.centerIconContainer}>
          <TouchableOpacity
            style={styles.centerIconWrapper}
            onPress={() => handleIconPress("pluscircle")}
          >
            <Image
              source={require("../../assets/action_button.png")}
              style={styles.centerIcon}
            />
          </TouchableOpacity>
          <View style={styles.curveBackground} />
        </View>

        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => handleIconPress("user")}
        >
          {/* <Image
            source={
              userData?.profile_image
                ? { uri: userData.profile_image }
                : require("../../assets/user_icon.png")
            }
            style={styles.icon}
          /> */}
             <Avatar.Icon 
        size={35} 
        icon="account" 
        color="white" // Icon color
        style={{ backgroundColor: '#3D48E5' }} // Background color
      />
          <Text style={styles.iconLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
      <BottomSheetModal
        visible={isVisible}
        onClose={() => setIsVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    height: 60,
    paddingHorizontal: 30,
    position: "absolute",
    bottom: 0,
    width: "100%",
    elevation: 5,
  },
  iconContainer: {
    alignItems: "center",
  },
  icon: {
    width: 30,
    height: 30,
    borderRadius: 20,
  },
  centerIconContainer: {
    position: "absolute",
    top: -25,
    left: "50%",
  },
  centerIconWrapper: {
    zIndex: 1000,
  },
  curveBackground: {
    position: "absolute",
    top: 40,
    width: "150%",
    height: 55,
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
    backgroundColor: "white",
  },
  centerIcon: {
    width: 60,
    height: 60,
  },
  iconLabel: {
    color: "blue",
    fontSize: 12,
    marginTop: 5,
    textDecorationLine: "none",
  },
});

export default Footer;
