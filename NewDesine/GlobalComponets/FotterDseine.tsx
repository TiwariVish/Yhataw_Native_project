import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Avatar } from "react-native-paper";
import { getPerosnalDetails } from "../../Components/Screens/MyProfileService";
import store from "../../utils/store";
import BottomSheetModal from "../../Global/PopAndModels/BottomSheetModal";

const FotterDseine = ({ navigate, onHomePress }) => {
  const [userData, setUserData] = useState<any>(null);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

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
    if (iconName === "home") {
      onHomePress();
    }
    setSelectedIcon(iconName);
    if (iconName === "user") {
      navigate("UserProfile");
    }
    if (iconName === "pluscircle") {
      setIsVisible(true);
    }
  };

  return (
    <>
      {/* <ImageBackground
        source={require("../../assets/Bottom_bg223.png")}
        style={styles.footerContainer}
        resizeMode="cover"
      > */}
    <View   style={styles.footerContainer}>
        <View style={styles.iconContainer}>
          <TouchableOpacity
            style={styles.leftIcon}
            onPress={() => handleIconPress("home")}
          >
            {/* <Image
              source={require("../../assets/home_icon.png")}
              style={styles.icon}
            /> */}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.fab}
            onPress={() => handleIconPress("pluscircle")}
          >
            <MaterialIcons name="add" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.rightIcon}
            onPress={() => handleIconPress("user")}
          >
            {userData?.profile_image ? (
              // <Image
              //   source={{ uri: userData.profile_image }}
              //   style={styles.icon}
              // />
              ""
            ) : (
              <Avatar.Icon
                size={35}
                icon="account"
                color="white"
                style={{ backgroundColor: "#3D48E5" }}
              />
            )}
          </TouchableOpacity>
        </View>
      {/* </ImageBackground> */}
      </View>

      <BottomSheetModal
        visible={isVisible}
        onClose={() => setIsVisible(false)}
      />
    </>
  );
};

export default FotterDseine;

const styles = StyleSheet.create({
  footerContainer: {
    height: 85, // Set a fixed height for the footer
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative", // Ensure positioning context for children
    backgroundColor:"#FFFFFF"
  },
  iconContainer: {
    position: "absolute",
    width: "100%",
    top: 0, 
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1, 
  },
  fab: {
    backgroundColor: "blue",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    position: "absolute",
    top: 0,
    left: "50%",
    marginLeft: -28,
  },
  leftIcon: {
    position: "absolute",
    left: 20,
    top: 40, 
  },
  rightIcon: {
    position: "absolute",
    right: 20,
    top: 40, 
  },
  icon: {
    width: 30,
    height: 30,
    borderRadius: 20,
  },
});
