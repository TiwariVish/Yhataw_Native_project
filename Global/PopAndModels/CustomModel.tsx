import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Modal from "react-native-modal";

interface CustomModalProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({ isVisible, onClose, children }) => {
  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} animationIn="zoomIn" animationOut="zoomOut">
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.closeButton}   onPress={() => {
            console.log("Close Button Pressed");
            onClose();
          }}>
          {/* <Text style={styles.closeText}>✖</Text> */}
        </TouchableOpacity>
        {children}
      </View>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 5,

  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  closeText: {
    fontSize: 18,
    color: "black",
  },
});
