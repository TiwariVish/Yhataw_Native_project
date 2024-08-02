import React from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";

interface ReminderBottomSheetModalProps {
  visible: boolean;
  onClose: () => void;
}

const { height: screenHeight } = Dimensions.get("window");

const ReminderBottomSheetModal: React.FC<ReminderBottomSheetModalProps> = ({
  visible,
  onClose,
}) => {
  const translateY = useSharedValue(visible ? 0 : screenHeight);

  React.useEffect(() => {
    translateY.value = withSpring(visible ? 0 : screenHeight, {
      damping: 15,
      stiffness: 100,
    });
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <>
      {visible && (
        <BlurView intensity={200} style={styles.blurView}>
          <TouchableOpacity style={styles.overlay} onPress={onClose}>
            <Animated.View style={[styles.container, animatedStyle]}>
              <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
                <View style={styles.containerdiv}>
                  <Text style={styles.header}>Add Reminder</Text>
                  <Text style={styles.subHeader}>
                    Add new reminder for the lead
                  </Text>

                  <View style={styles.inputContainer}>
                    <Image
                      source={require("../../assets/type_cursor_icon.png")}
                      style={styles.icon}
                      onError={() => console.log("Error loading type_cursor_icon.png")}
                    />
                    <View style={styles.textContainer}>
                      <Text style={styles.inputTitle}>Title</Text>
                      <Text style={styles.inputValue}>Call Note</Text>
                    </View>
                  </View>

                  <View style={styles.inputContainer}>
                    <Image
                      source={require("../../assets/calendar_icon.png")}
                      style={styles.icon}
                      onError={() => console.log("Error loading calendar_icon.png")}
                    />
                    <View style={styles.textContainer}>
                      <Text style={styles.inputTitle}>Date and Time</Text>
                      <Text style={styles.inputValue}>
                        22-03-2024 12:58 PM
                      </Text>
                    </View>
                  </View>

                  <View style={styles.inputContainer}>
                    <Image
                      source={require("../../assets/note_icon.png")}
                      style={styles.icon}
                      onError={() => console.log("Error loading note_icon.png")}
                    />
                    <View style={styles.textContainer}>
                      <Text style={styles.inputTitle}>Note</Text>
                      <Text style={styles.inputValue}>
                        Figma ipsum component variant main layer. Underline
                        export effect layer boolean line pen outline boolean
                        style. Ellipse plugin align vertical auto shadow.
                      </Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity style={styles.submitButton}>
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </Animated.View>
          </TouchableOpacity>
        </BlurView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  blurView: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  container: {
    width: "100%",
    height: "60%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
  },
  modalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  containerdiv: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 14,
    color: "#7d7d7d",
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  textContainer: {
    marginLeft: 15,
  },
  icon: {
    width: 24,
    height: 24,
  },
  inputTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 8,
  },
  inputValue: {
    fontSize: 16,
    color: "#000",
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: "#4A6EF5",
    padding: 16,
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 20,
    alignSelf: "center",
    width: "100%",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ReminderBottomSheetModal;
