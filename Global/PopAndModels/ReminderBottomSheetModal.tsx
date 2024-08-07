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
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import store from "../../utils/store";
import { getAllReminder, saveReminder } from "./RemiderServices";
import DateTimePicker from "@react-native-community/datetimepicker";

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

  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [formattedDate, setFormattedDate] = useState("");

  const userId = store.getState().auth.userId;

  const submitReminder = async (id:any) => {
    const body = {
      userId,
      title,
      note,
      date: date.toISOString(),
    };
    try {
      const response = await saveReminder(body);
      const res = await getAllReminder(id)
    } catch (error) {
      console.error("Error saving reminder:", error);
    }
  };

  useEffect(() => {
    submitReminder('')
  },[])

  useEffect(() => {
    translateY.value = withSpring(visible ? 0 : screenHeight, {
      damping: 15,
      stiffness: 100,
    });
  }, [visible]);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    const formatted =
      currentDate.toLocaleDateString("en-GB") +
      " " +
      currentDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    setFormattedDate(formatted);
    setShow(false);
  };

  const showDatePicker = () => {
    setShow(true);
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
                <View style={styles.containerdiv}>
                  <Text style={styles.header}>Add Reminder</Text>
                  <Text style={styles.subHeader}>
                    Add new reminder for the lead
                  </Text>

                  <View style={styles.inputContainer}>
                    <Image
                      source={require("../../assets/type_cursor_icon.png")}
                      style={styles.icon}
                    />
                    <View style={styles.textContainer}>
                      <Text style={styles.inputTitle}>Title</Text>
                      <TextInput
                        style={styles.inputValue}
                        value={title}
                        onChangeText={setTitle}
                      />
                    </View>
                  </View>

                  <View style={styles.inputContainer}>
                    <Image
                      source={require("../../assets/calendar_icon.png")}
                      style={styles.icon}
                    />
                    <View style={styles.textContainer}>
                      <Text style={styles.inputTitle}>Date and Time</Text>
                      <View style={styles.inputWithIconContainer}>
                        <TextInput
                          style={styles.inputValueWithIcon}
                          value={formattedDate}
                          editable={false}
                        />
                        <TouchableOpacity onPress={showDatePicker}>
                          <Image
                            source={require("../../assets/calendar_icon.png")}
                            style={styles.iconInput}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  {show && (
                   <DateTimePicker
                   value={date}
                   mode="date"
                   display="default"
                   onChange={onChange}
                   onTouchCancel={() => setShow(false)} // Add this line to handle dismiss on Android
                 />
                  )}

                  <View style={styles.inputContainer}>
                    <Image
                      source={require("../../assets/note_icon.png")}
                      style={styles.icon}
                    />
                    <View style={styles.textContainer}>
                      <Text style={styles.inputTitle}>Note</Text>
                      <TextInput
                        style={[styles.inputValue, { height: 80 }]}
                        multiline={true}
                        value={note}
                        onChangeText={setNote}
                      />
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={submitReminder}
                >
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
    flex: 1,
    marginLeft: 10,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  inputWithIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  inputValueWithIcon: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  iconInput: {
    position: "absolute",
    right: 5,
    width: 20,
    height: 20,
    bottom: -10,
  },
  inputTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  inputValue: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    paddingHorizontal: 10,
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
