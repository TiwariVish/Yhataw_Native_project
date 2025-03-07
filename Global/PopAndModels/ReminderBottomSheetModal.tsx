import React, { useEffect, useRef, useState } from "react";
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
import { getAllReminder, getReminder, saveReminder } from "./RemiderServices";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import { globalStyles } from "../../GlobalCss/GlobalStyles";

interface ReminderBottomSheetModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (newReminder: any) => void;
  selectedCardDataShow: any;
}

const { height: screenHeight } = Dimensions.get("window");

const ReminderBottomSheetModal: React.FC<ReminderBottomSheetModalProps> = ({
  visible,
  onClose,
  onSubmit,
  selectedCardDataShow,
}) => {
  const translateY = useSharedValue(visible ? 0 : screenHeight);
  const {
    leadData,
    myLeadData,
    teamLeadData,
    myLeadProspectShow,
    myLeadOpportunity,
    myLeadClosure,
  } = useSelector((state: RootState) => state.auth);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState("");
  const [newReminder, setNewReminder] = useState([]);
  const inputRef = useRef<TextInput>(null);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const userId = store.getState().auth.userId;

  useEffect(() => {
    if (visible) {
      setTitle("");
      setNote("");
      setDate(new Date());
  
      translateY.value = withSpring(0, {
        damping: 15,
        stiffness: 100,
      });
  
      // Add a delay to focus on the input
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    } else {
      translateY.value = withSpring(screenHeight);
    }
  }, [visible]);

  const submitReminder = async () => {
    const formattedDate = date.toLocaleString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    let leadIdDynamic = "";
    switch (selectedCardDataShow) {
      case 1:
        leadIdDynamic = leadData?._id;
        break;
      case 3:
        leadIdDynamic = myLeadData?._id;
        break;
      case 4:
        leadIdDynamic = myLeadProspectShow?._id;
        break;
      case 5:
        leadIdDynamic = myLeadOpportunity?._id;
        break;
      case 6:
        leadIdDynamic = myLeadClosure?._id;
      case 7:
        leadIdDynamic = teamLeadData?._id;
        break;
      default:
        console.warn(
          "Invalid selectedCardDataShow value:",
          selectedCardDataShow
        );
        return;
    }

    const body = {
      leadId: leadIdDynamic,
      userId,
      title,
      note,
      date: formattedDate,
    };
    try {
      const newReminder = await saveReminder(body);
      const response = await getReminder(myLeadData._id);
      setNewReminder(response.data);
      onSubmit(newReminder);
      onClose();
    } catch (error) {
      console.error("Error saving reminder:", error);
    }
  };
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate) => {
    setDate(selectedDate);
    const formatted =
      selectedDate.toLocaleDateString("en-GB") +
      " " +
      selectedDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

    setFormattedDate(formatted);
    hideDatePicker();
  };

  return (
    <>
      {visible && (
        <BlurView intensity={200} style={styles.blurView}>
          <TouchableOpacity style={styles.overlay} onPress={onClose}>
            <Animated.View style={[styles.container, animatedStyle]}>
              <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                  <View style={styles.containerdiv}>
                    <Text
                      style={[
                        globalStyles.h5,
                        globalStyles.fs1,
                        styles.header,
                        globalStyles.tc,
                      ]}
                      allowFontScaling={false}
                    >
                      Add Reminder
                    </Text>
                    <Text
                      style={[
                        globalStyles.h7,
                        globalStyles.fs2,
                        styles.header,
                        globalStyles.textColor,
                      ]}
                      allowFontScaling={false}
                    >
                      Add new reminder for the lead
                    </Text>

                    <View style={styles.inputContainer}>
                      <Text
                        style={[
                          globalStyles.h7,
                          globalStyles.fs2,
                          globalStyles.textColor,
                          styles.header,
                        ]}
                        allowFontScaling={false}
                      >
                        Title
                      </Text>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => inputRef.current?.focus()}
                      >
                        <View style={styles.inputWithIconContainer}>
                          {/* <Image
      source={require("../../assets/type_cursor_icon.png")}
      style={styles.iconInsideInput}
    /> */}
                          <TextInput
                            ref={inputRef} // Use ref to programmatically focus input
                            style={[styles.inputValue, globalStyles.h7]}
                            value={title}
                            placeholder="Enter Title"
                            onChangeText={setTitle}
                          />
                        </View>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.inputContainer}>
                      <Text
                        style={[
                          globalStyles.h7,
                          globalStyles.fs2,
                          globalStyles.textColor,
                          styles.header,
                        ]}
                        allowFontScaling={false}
                      >
                        Date and Time
                      </Text>
                      <TouchableOpacity onPress={showDatePicker} activeOpacity={0.8}>
                        <View style={styles.inputWithIconContainer}>
                          <TextInput
                            style={[styles.inputValueWithIcon, globalStyles.h7]}
                            value={formattedDate}
                            placeholder="Enter Date and Time "
                            editable={false}
                          />
                          {/* <TouchableOpacity onPress={showDatePicker}>
                          <Image
                            source={require("../../assets/calendar_icon.png")}
                          />
                        </TouchableOpacity> */}
                        </View>
                      </TouchableOpacity>
                    </View>
                    <DateTimePickerModal
                      isVisible={isDatePickerVisible}
                      mode="datetime"
                      onConfirm={handleConfirm}
                      onCancel={hideDatePicker}
                      textColor={Platform.OS === "ios" ? "red" : undefined}
                    />

                    <View style={styles.inputContainer}>
                      <Text
                        style={[
                          globalStyles.h7,
                          globalStyles.fs2,
                          globalStyles.textColor,
                          styles.header,
                        ]}
                        allowFontScaling={false}
                      >
                        Note
                      </Text>
                      <View style={styles.inputWithIconContainer}>
                        {/* <Image
                          source={require("../../assets/note_icon.png")}
                          style={styles.iconInsideInput}
                        /> */}
                        <TextInput
                          style={[
                            styles.inputValue,
                            globalStyles.h7,
                            { height: 80, textAlignVertical: "top" },
                          ]}
                          multiline={true}
                          value={note}
                          placeholder="Enter Notes"
                          onChangeText={setNote}
                        />
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={submitReminder}
                  >
                    <Text
                      style={[
                        styles.submitButtonText,
                        globalStyles.fs1,
                        globalStyles.h6,
                      ]}
                    >
                      Submit
                    </Text>
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
    padding: 10,
    backgroundColor: "#fff",
  },
  header: {
    marginBottom: 5,
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
    height: 35,
    textAlignVertical: "center",
    textAlign: "left",
  },
  iconInsideInput: {
    position: "absolute",
    left: 10,
    width: 20,
    height: 20,
    tintColor: "#888",
  },
  inputTitle: {
    marginBottom: 10,
  },
  inputValue: {
    flex: 1,
    height: 35,
    textAlign: "left",
    textAlignVertical: "center",
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
  },
});

export default ReminderBottomSheetModal;
