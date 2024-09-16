import React, { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
  ScrollView,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import store, { RootState } from "../../utils/store";
import DateTimePicker from "@react-native-community/datetimepicker";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import { getRemark, saveRemark } from "./RemiderServices";

interface RemarkPop {
  visible: boolean;
  onClose: () => void;
  onSubmit: (newRemark: any) => void; 
}

const { height: screenHeight } = Dimensions.get("window");

const RemarkPop: React.FC<RemarkPop> = ({
  visible,
  onClose,
  onSubmit
}) => {
  const translateY = useSharedValue(visible ? 0 : screenHeight);
  const { leadData } = useSelector((state: RootState) => state.auth);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [formattedDate, setFormattedDate] = useState("");
  const [newRemark, setNewRemak] = useState([])

  const userId = store.getState().auth.userId;

  useEffect(() => {
    if (visible) {
        setTitle("");  
        setNote("");  
        setDate(new Date());  
      }
    translateY.value = withSpring(visible ? 0 : screenHeight, {
      damping: 15,
      stiffness: 100,
    });
  }, [visible]);

  const submitRemark = async () => {
    const body = {
      leadId: leadData._id,
      userId,
      title,
      notes:note,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    };
    try {
      const newRemark = await saveRemark(body);
      const response = await getRemark(leadData._id);
      setNewRemak(response.data)
      onSubmit(newRemark);
      onClose();
    } catch (error) {
      console.error("Error saving reminder:", error);
    }
  };

  const onChange = (date: Date) => {
    setDate(date);
    const formatted =
      date.toLocaleDateString("en-GB") +
      " " +
      date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    setFormattedDate(formatted);
    setShow(false); 
  };

  const showDatePicker = () => {
    setShow(!show); 
  };

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
                <ScrollView contentContainerStyle={styles.scrollContent}>
                  <View style={styles.containerdiv}>
                    <Text style={styles.header}>Add Remark</Text>
                    <Text style={styles.subHeader}>
                    Note : Notes help you remember important details about your leads
                    </Text>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputTitle}>Note</Text>
                      <View style={styles.inputWithIconContainer}>
                        {/* <Image
                          source={require("../../assets/note_icon.png")}
                          style={styles.iconInsideInput}
                        /> */}
                        <TextInput
                          style={[styles.inputValue, { height: 80, textAlignVertical: "top" }]}
                          multiline={true}
                          value={note}
                          onChangeText={setNote}
                        />
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={submitRemark}
                  >
                    <Text style={styles.submitButtonText}>Submit</Text>
                  </TouchableOpacity>
                </ScrollView>
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
    padding: 20,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
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
    marginBottom: 16,
  },
  inputWithIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    // backgroundColor: "#f9f9f9",
    paddingHorizontal: 10,
  },
  inputValueWithIcon: {
    flex: 1,
    borderWidth: 0,
    paddingLeft: 40,
    height: 35,
  },
  iconInsideInput: {
    position: "absolute",
    left: 10,
    width: 20,
    height: 20,
    tintColor: "#888",
  },
  inputTitle: {
    fontSize: 12,
    color: "#555",
    marginBottom: 8,
  },
  inputValue: {
    flex: 1,
    height: 35,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#4A6EF5",
    padding: 16,
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 20,
    alignSelf: "center",
    width: "100%",
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.3,
    // shadowRadius: 4,
    // elevation: 5,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RemarkPop;
