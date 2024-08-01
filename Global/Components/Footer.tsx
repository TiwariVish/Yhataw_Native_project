import React, { useState } from "react";
import { View, StyleSheet, Modal, TouchableWithoutFeedback , Image, TouchableOpacity } from "react-native";
import BottomSheetModal from "../PopAndModels/BottomSheetModal";

function Footer({ navigate }) {
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleIconPress = (iconName) => {
    setSelectedIcon(iconName);
    if (iconName === "user") {
      navigate("UserProfile"); 
    }
    if(iconName === "pluscircle"){
      setSelectedItem(iconName);
      // setModalVisible(true);
      setIsVisible(true)
    }
  
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  const navigateToSection = (item) => {
    // navigation.navigate("Leads");
    // setModalVisible(false);
    console.log("Navigate to:", item.content);
  };


  const getBorderPosition = () => {
    switch (selectedIcon) {
      case "home":
        return 10;
      case "pluscircle":
        return 150;
      case "user":
        return 309;
      default:
        return 0;
    }
  };

  return (
    <>
         <View style={styles.footer}>
         <TouchableOpacity onPress={() => handleIconPress("home")}>
          <Image source={require("../../assets/home_icon.png")} style={styles.image} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleIconPress("pluscircle")}>
          <Image source={require("../../assets/action_button.png")} style={styles.image2} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleIconPress("user")}>
          <Image source={require("../../assets/user_icon.png")} style={styles.image} />
        </TouchableOpacity>
        <View style={[styles.borderButton, { left: getBorderPosition() }]} />
        <View style={[styles.borderButton, { left: getBorderPosition() }]}  />
      </View>
       {/* Modal section */}
       {/* <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <DashboardModelView  />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal> */}
      <BottomSheetModal  visible={isVisible} onClose={() => setIsVisible(false)}></BottomSheetModal>
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

  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    width: "100%",
    height:85
  },
  borderButton: {
    position: "absolute",
    bottom: 10,
    height: 5,
    width: 100,
    backgroundColor: "blue",
    alignSelf: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 415,
    height: 627,
    marginTop: 225,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
  },
  image:{
    height:35,
    width:35
  },
  image2:{
    height:50,
    width:50
  }
});

export default Footer;
