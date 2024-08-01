import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView
} from "react-native";
import { globalStyles } from "../../GlobalCss/GlobalStyles";
import VerifyCustomerBottomSheetModal from "../../Global/PopAndModels/VerifyCustomerBottomSheetModal";

function CustomerFeedback() {
  const ratingIcons = [
    require("../../assets/group_green_icon.png"),
    require("../../assets/group_light_green_icon.png"),
    require("../../assets/group_yellow_icon.png"),
    require("../../assets/group_orange_icon.png"),
    require("../../assets/group_red_icon.png"),
  ];
  const [mobileNumber, setMobileNumber] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleMobileNumberChange = (text) => {
    setMobileNumber(text);
  };
  const handleCare_Verify = () => {
    console.log("remider::::::::::::::::::;;;;;");
    setIsVisible(true);
  };
  const handleVerifySuccess = () => {
    setIsVerified(true);
  };
  

  const renderRatingIcons = () => {
    return ratingIcons.map((icon, index) => (
      <Image key={index} source={icon} style={styles.icon} />
    ));
  };
  


  const showPrefix = mobileNumber.length > 0;

  return (
    <>
      {isVerified ? (
        <>
          <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.header}>
              <Text style={[styles.value, globalStyles.fs1, globalStyles.h5]}>
                Feedback Form
              </Text>
              <Text style={styles.description}>
                Please get your feedback from the visitor
              </Text>
            </View>
            <View style={styles.feedbackSection}>
              <Text style={styles.questionText}>How Knowledgeable Was our Agent?</Text>
              <View style={styles.iconContainer}>{renderRatingIcons()}</View>
            </View>
            <View style={styles.feedbackSection}>
              <Text style={styles.questionText}>Was YHATAW Executive on Time?</Text>
              <View style={styles.iconContainer}>{renderRatingIcons()}</View>
            </View>
            <View style={styles.feedbackSection}>
              <Text style={styles.questionText}>Please Rate Our Overall Experience?</Text>
              <View style={styles.iconContainer}>{renderRatingIcons()}</View>
            </View>
            <View style={styles.feedbackSection}>
              <Text style={styles.questionText}>If any Suggestion or Remark</Text>
              <TextInput
                style={styles.inputRemark}
                multiline
                placeholder="Enter your suggestion here"
              />
            </View>
          </ScrollView>
          <View style={styles.submitButtonContainer}>
            <TouchableOpacity
              style={styles.submitButton}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
        </>
      ) : (
        <View style={styles.contactContainer}>
          <Text style={[styles.value, globalStyles.fs1, globalStyles.h5]}>
            Verify Customer
          </Text>
          <View>
            <Text style={[styles.label, globalStyles.fs3, globalStyles.h7]}>
              Mobile No.
            </Text>
            <View style={styles.inlineInput}>
              {showPrefix && (
                <View style={styles.inputAdornment}>
                  <Text
                    style={[
                      globalStyles.fontfm,
                      globalStyles.h5,
                      globalStyles.fs4,
                    ]}
                  >
                    +91
                  </Text>
                </View>
              )}
              <TextInput
                style={[
                  styles.input,
                  globalStyles.fontfm,
                  globalStyles.h5,
                  globalStyles.fs4,
                ]}
                placeholder="Mobile number"
                value={mobileNumber}
                onChangeText={handleMobileNumberChange}
                keyboardType="phone-pad"
              />
            </View>
            <Text style={styles.label}>
              Customer will receive an OTP on this mobile number.
            </Text>
          </View>
          <View style={styles.submitButtonContainer}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => handleCare_Verify()}
            >
              <Text style={styles.submitButtonText}>Proceed to Verify</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <VerifyCustomerBottomSheetModal
        onVerifySuccess={handleVerifySuccess}
        visible={isVisible}
        onClose={() => setIsVisible(false)}
      ></VerifyCustomerBottomSheetModal>
    </>
  );
}

const styles = StyleSheet.create({
  contactContainer: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    margin: 16,
  },
  value: {
    color: "#3D48E5",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  input: {
    flex: 1,
    padding: 15,
  },
  inlineInput: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#DFE1E8",
    paddingBottom: 5,
    marginBottom: 10,
  },
  submitButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  submitButton: {
    backgroundColor: "blue",
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  inputAdornment: {
    marginRight: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
  },
  header: {
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: "#333",
  },
  feedbackSection: {
    marginBottom: 16,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 8,
  },
  icon: {
    width: 40,
    height: 40,
  },
  inputRemark: {
    height: 130,
    borderColor: "#ccc",
    borderWidth: 3,
    padding: 8,
    borderRadius: 5,
    marginVertical: 8,
  },
});

export default CustomerFeedback;
