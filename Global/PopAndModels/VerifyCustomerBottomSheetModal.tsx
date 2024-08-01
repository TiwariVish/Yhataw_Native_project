import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { globalStyles } from "../../GlobalCss/GlobalStyles";

interface BottomSheetModalProps {
  visible: boolean;
  onClose: () => void;
  onVerifySuccess: () => void;
}

const { height: screenHeight } = Dimensions.get("window");

const VerifyCustomerBottomSheetModal: React.FC<BottomSheetModalProps> = ({
  visible,
  onClose,
  onVerifySuccess,
}) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isOtpEntered, setIsOtpEntered] = useState(false);

  const translateY = useSharedValue(visible ? 0 : screenHeight);

  useEffect(() => {
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

  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setIsOtpEntered(newOtp.every((num) => num !== ""));
  };

  const handleSubmit = () => {
    if (isOtpEntered) {
      onVerifySuccess();
      onClose();
    }
  };

  return (
    <>
      {visible && (
        <TouchableWithoutFeedback onPress={onClose}>
          <BlurView intensity={80} style={styles.blurView}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <Animated.View style={[styles.container, animatedStyle]}>
                <View style={styles.modalContent}>
                  <View style={styles.contactContainer}>
                    <Text
                      style={[
                        styles.value,
                        globalStyles.fs1,
                        globalStyles.h5,
                        styles.textAlignLeft,
                      ]}
                    >
                      Verify Customer
                    </Text>
                    <Text style={styles.textAlignLeft}>
                      4 digit OTP verification sent on XXX XXX
                    </Text>
                    <View style={styles.otpContainer}>
                      {otp.map((digit, index) => (
                        <TextInput
                          key={index}
                          style={styles.otpInput}
                          value={digit}
                          onChangeText={(value) =>
                            handleOtpChange(index, value)
                          }
                          maxLength={1}
                          keyboardType="numeric"
                        />
                      ))}
                    </View>
                    <View>
                      <Text>Didn’t receive, Resend OTP in 60 sec</Text>
                    </View>
                  </View>
                  <View style={styles.submitButtonContainer}>
                    <TouchableOpacity
                      onPress={handleSubmit}
                      style={[
                        styles.submitButton,
                        isOtpEntered
                          ? styles.submitButtonActive
                          : styles.submitButtonInactive,
                      ]}
                    >
                      <Text style={styles.submitButtonText}>Verify</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </BlurView>
        </TouchableWithoutFeedback>
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
  container: {
    width: "100%",
    height: "50%",
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
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "lightgray",
    borderRadius: 5,
  },
  contactContainer: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: "flex-start",
    width: "100%",
  },
  textAlignLeft: {
    textAlign: "left",
  },
  value: {
    color: "#3D48E5",
    marginBottom: 8,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  otpInput: {
    width: 70,
    height: 70,
    borderWidth: 3,
    borderColor: "#ccc",
    textAlign: "center",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  submitButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    padding: 20,
  },
  submitButton: {
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
  },
  submitButtonInactive: {
    backgroundColor: "gray",
  },
  submitButtonActive: {
    backgroundColor: "blue",
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default VerifyCustomerBottomSheetModal;
