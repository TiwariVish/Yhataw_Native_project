import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // Assuming you're using Expo Icons
import CustomInput from "../../Global/Components/CustomInput";
import CustomButton from "../../Global/Components/CustomButton";
import styles from "./LoginScreen.style";
import { LoginScreenNavigationProp } from "../type"; // Import the types
const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleProceed = () => {
    if (email === "arjunnanda@yhataw.com") {
      // Replace with your static email
      setIsEmailValid(true);
      setShowPasswordInput(true);
    } else {
      setIsEmailValid(false);
      setShowPasswordInput(false);
    }
  };

  const handleLogin = () => {
    if (password === "Arjun@1234") {
      navigation.navigate("Dashboard");
    } else {
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image
          source={require("../../assets/crm_icon.png")}
          style={styles.image}
        />
        <View style={styles.textContainer}>
          <Text style={styles.cardTitle}>Sign in</Text>
          <Text style={styles.crmTitle}>to access Pulse CRM</Text>
        </View>
        <View style={styles.inputContainer}>
          <CustomInput
            style={styles.input}
            placeHolder="Email or mobile number"
            id="email"
            type="email"
            name="email"
            onChange={setEmail}
            value={email}
          />
          {!isEmailValid && (
            <Text style={styles.errorText}>
              This is not a valid email. Please contact system administrator.
            </Text>
          )}
          {showPasswordInput && (
            <View style={styles.viewCont}>
              <CustomInput
                style={styles.passwordInput}
                placeHolder="Password"
                id="password"
                type="password"
                name="password"
                secureTextEntry={!showPassword}
                onChange={setPassword}
                value={password}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={handleTogglePasswordVisibility}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={24}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.viewcustomButton}>
            <CustomButton
              label={showPasswordInput ? "Log In" : "Proceed"}
              buttonType="primaryBtn"
              labelStyle={styles.labelStyle}
              onClick={showPasswordInput ? handleLogin : handleProceed}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//   },
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   textContainer: {
//     width: "100%",
//     alignItems: "flex-start",
//   },
//   cardTitle: {
//     fontSize: 26,
//     fontWeight: "bold",
//     marginBottom: 5,
//   },
//   crmTitle: {
//     marginBottom: 18,
//   },
//   footerText: {
//     marginTop: 20,
//     textAlign: "center",
//   },
//   inputContainer: {
//     width: "100%",
//   },
//   input: {
//     width: "100%",
//     marginBottom: 10,
//   },
//   labelStyle: {
//     color: "white",
//     fontWeight: "bold",
//   },
//   errorText: {
//     marginBottom: 10,
//     color: "red",
//   },
//   passwordInput: {
//     flexDirection: "row",
//     alignItems: "center",
//     position: "relative",
//     // marginBottom: 5,
//   },
//   viewCont: {
//     bottom: 35,
//   },
//   viewcustomButton: {
//     bottom: 15,
//   },
//   eyeIcon: {
//     position: "absolute",
//     top: 40,
//     right: 10,
//     padding: 5,
//   },
// });

export default LoginScreen;
