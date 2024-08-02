import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { globalStyles } from "../../GlobalCss/GlobalStyles";
import { blue } from "react-native-reanimated/lib/typescript/reanimated2/Colors";

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
  const otpRefs = useRef<(TextInput | null)[]>([]);

  const translateY = useSharedValue(visible ? 0 : screenHeight);

  useEffect(() => {
    translateY.value = withSpring(visible ? 0 : screenHeight, {
      damping: 15,
      stiffness: 100,
    });
  }, [visible]);

  useEffect(() => {
    if (otpRefs.current[0]) {
      otpRefs.current[0].focus();
    }
  }, []);

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
    if (value !== "") {
      if (index < otp.length - 1) {
        otpRefs.current[index + 1]?.focus();
      }
    } else {
      if (index > 0) {
        otpRefs.current[index - 1]?.focus();
      }
    }
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
          <BlurView intensity={200} style={styles.blurView}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <Animated.View style={[styles.modalContainer, animatedStyle]}>
                <KeyboardAvoidingView
                  behavior={Platform.OS === "ios" ? "padding" : "height"}
                  style={styles.keyboardAvoidingView}
                >
                  <View style={styles.content}>
                    <View style={styles.textContainer}>
                      <Text
                        style={[
                          globalStyles.fs1,
                          globalStyles.h1,
                          styles.colorText
                        ]}
                      >
                        Verify Customer
                      </Text>
                      <Text>
                        4 digit OTP verification sent on XXX XXX
                      </Text>
                    </View>
                    <View style={styles.otpContainer}>
                      {otp.map((digit, index) => (
                        <TextInput
                          key={index}
                          value={digit}
                          onChangeText={(value) =>
                            handleOtpChange(index, value)
                          }
                          keyboardType="numeric"
                          maxLength={1}
                          style={styles.otpInput}
                          ref={(ref) => (otpRefs.current[index] = ref)}
                        />
                      ))}
                    </View>
                    <View style={styles.textContainer}>
                      <Text>Didn’t receive, Resend OTP in 60 sec</Text>
                    </View>
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity
                      style={[
                        styles.submitButton,
                        !isOtpEntered && styles.disabledButton,
                      ]}
                      onPress={handleSubmit}
                      disabled={!isOtpEntered}
                    >
                      <Text style={styles.submitButtonText}>Verify</Text>
                    </TouchableOpacity>
                  </View>
                </KeyboardAvoidingView>
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
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  modalContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    zIndex: 2,
    height: "60%",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
  },
  textContainer: {
    alignSelf: "flex-start",
    width: "100%",
    paddingHorizontal: 10,
    // paddingVertical:10
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 40,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderColor: "#ccc",
    borderWidth: 2,
    borderRadius: 8,
    textAlign: "center",
  },
  submitButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "blue",
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignItems: "center",
    width: "100%",
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  colorText:{
    color:"blue"
  }
});

export default VerifyCustomerBottomSheetModal;
