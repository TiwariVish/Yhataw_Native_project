import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { login } from "./LoginScreenService";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../utils/store";
import { loginAction } from "../../Redux/authSlice";
import { globalStyles } from "../../GlobalCss/GlobalStyles";

const { width } = Dimensions.get("window");

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [backendEmailError, setBackendEmailError] = useState(false);
  const [IsLoading, setIsLoading] = useState(true);
  const [mobilePattern, setMobilePattern] = useState(false);

  const dispatch = useDispatch();
  const { authenticated } = useSelector((state: RootState) => state.auth);

  const handleProceed = async () => {
    const isValid = validateEmail(email);
    const isMobileValid = /^[0-9]{10}$/.test(email);
    if (!isEmailValid && !isMobileValid) {
      setIsEmailValid(false);
      return;
    }
    try {
      setIsLoading(true);
      const response = await login(email, password);
      console.log(response, "::::::::::::email::::::::::::");
      if (response?.message?.settings?.success) {
        setIsEmailValid(true);
        setBackendEmailError(false);
        setShowPasswordInput(true);
      } else {
        setBackendEmailError(true);
        console.log("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleOnChangeInputField = (text: string) => {
    setEmail(text);
    const isNumeric = /^[0-9]+$/.test(text);
    setMobilePattern(isNumeric);
    setIsEmailValid(true);
    setBackendEmailError(false);
    if (text === "") {
      setIsEmailValid(true);
      setBackendEmailError(false);
    }
  };

  const handleOnChangePasswordField = (text: string) => {
    setPassword(text);
  };

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const response = await login(email, password);
      console.log(response, "::::::::::::::password--------------------");
      if (response?.message?.settings?.success) {
        const { accessToken, fullName, role, _id } =
          response?.message?.data?.user;
        dispatch(
          loginAction({
            authenticated: true,
            accessToken: accessToken,
            userName: fullName,
            email: response.message.data.user.email,
            role,
            userId: _id,
            privileges: response.message.data.user?.role_privileges || {},
          })
        );
        if (authenticated) {
          navigation.navigate("Dashboard");
        }
      } else {
        console.log("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View  style={styles.image}>
        <Image source={require("../../assets/Logo.png")}  />
        </View>
        <Text style={[globalStyles.h1, globalStyles.fs1, globalStyles.fontfm]}>
          Sign in
        </Text>
        <Text style={[globalStyles.h8, globalStyles.fs4, globalStyles.fontfm]}>
          to access Pulse CRM
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.inlineInput}>
          <Image
            source={require("../../assets/User_box_light.png")}
            style={styles.icon}
          />
          <TextInput
            style={[styles.input, globalStyles.fontfm, globalStyles.h6]}
            placeholder="Email or mobile number"
            onChangeText={handleOnChangeInputField}
            value={email}
          />
          {mobilePattern && (
            <View style={styles.inputAdornment}>
              <Text
                style={[globalStyles.fontfm, globalStyles.h5, globalStyles.fs4]}
              >
                +91
              </Text>
            </View>
          )}
        </View>
        <View>
          {backendEmailError  && (
            <Text
              style={[
                styles.errorText,
                globalStyles.fontfm,
                globalStyles.h6,
                globalStyles.fs4,
              ]}
            >
              This is not a valid email. Please contact the system
              administrator.
            </Text>
          )}

          { !isEmailValid && !backendEmailError && (
            <Text
              style={[
                styles.errorText,
                globalStyles.fontfm,
                globalStyles.h6,
                globalStyles.fs4,
              ]}
            >
              The email id is not correct. Please try again
            </Text>
          )}
        </View>
        {showPasswordInput && (
          <View style={styles.passwordContainer}>
            <View style={styles.inlineInput}>
              <Image
                source={require("../../assets/Lock_icon.png")}
                style={styles.icon}
              />
              <TextInput
                style={[styles.input, globalStyles.fontfm, globalStyles.h6]}
                placeholder="Password"
                onChangeText={handleOnChangePasswordField}
                value={password}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={handleTogglePasswordVisibility}
                style={styles.eyeIcon}
              >
                <Image
                  source={
                    showPassword
                      ? require("../../assets/View_light.png")
                      : require("../../assets/View_hide_light.png")
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
        <TouchableOpacity
          onPress={showPasswordInput ? handleLogin : handleProceed}
          style={styles.button}
        >
          <Text style={[styles.buttonText , globalStyles.fs1 ,globalStyles.h6]}>
            {showPasswordInput ? "Log In" : "Proceed"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    alignItems: "flex-start",
    marginBottom: 20,
    width: "100%",
  },
  image: {
    marginBottom:10
    // width: 100,
    // height: 100,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subHeaderText: {
    fontSize: 16,
  },
  inputContainer: {
    width: "100%",
  },
  inlineInput: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#DFE1E8",
    paddingBottom: 5,
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 15,
    marginLeft: 10,
  },
  passwordContainer: {
    marginBottom: 20,
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 10,
    padding: 5,
  },
  button: {
    height:48,
    backgroundColor: "#3D48E5",
    borderRadius: 8,
    // paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
  },
  inputAdornment: {
    position: "absolute",
    left: 22,
    top: 0,
    bottom: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoginScreen;
