import React, { useState, useCallback } from "react";
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
import { useNavigation } from "@react-navigation/native";
import { LoginScreenNavigationProp } from "../type";

const { width } = Dimensions.get("window");

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [backendEmailError, setBackendEmailError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mobilePattern, setMobilePattern] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const navigation = useNavigation<LoginScreenNavigationProp>();
  const dispatch = useDispatch();
  const { authenticated } = useSelector((state: RootState) => state.auth);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateMobile = (email: string) => /^[0-9]{10}$/.test(email);

  const handleProceed = useCallback(async () => {
    const isValid = validateEmail(email) || validateMobile(email);
    if (!isValid) {
      setIsEmailValid(false);
      return;
    }
    try {
      setIsLoading(true);
      const response = await login(email, password);
      if (response?.message?.settings?.success) {
        setIsEmailValid(true);
        setBackendEmailError(false);
        setShowPasswordInput(true);
      } else {
        setBackendEmailError(true);
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [email, password]);

  const handleLogin = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await login(email, password);
      if (response?.message?.settings?.success) {
        setPasswordError(false);
        const {
          accessToken,
          fullName,
          role,
          hierarchyLevel,
          _id,
          email: userEmail,
          role_privileges,
        } = response?.message?.data?.user;
        dispatch(
          loginAction({
            authenticated: true,
            accessToken,
            userName: fullName,
            email: userEmail,
            role,
            hierarchyLevel,
            userId: _id,
            privileges: role_privileges || {},
          })
        );
        if (authenticated) {
          navigation.navigate("Dashboard");
        }
      } else {
        if (response?.message?.settings?.message === "Password Not Match") {
          setPasswordError(true);
        } else {
          setPasswordError(false);
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setPasswordError(true);
    } finally {
      setIsLoading(false);
    }
  }, [email, password, dispatch, authenticated, navigation]);

  const handleOnChangeInputField = (text: string) => {
    setEmail(text);
    setMobilePattern(/^[0-9]+$/.test(text));
    setIsEmailValid(true);
    setBackendEmailError(false);
  };

  const handleTogglePasswordVisibility = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword]);

  const getForgotPassword = useCallback(() => {
    navigation.navigate("ForgotPassword");
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/pulse_logo12.png")}
          style={styles.image}
        />
        <Text
          style={[globalStyles.h1, globalStyles.fs1, globalStyles.fontfm]}
          allowFontScaling={false}
        >
          Sign in
        </Text>
        <Text
          style={[globalStyles.h8, globalStyles.fs4, globalStyles.fontfm]}
          allowFontScaling={false}
        >
          to access Pulse CRM
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.inlineInput}>
          {!mobilePattern && (
            <Image
              source={require("../../assets/User_box_light.png")}
              style={styles.icon}
            />
          )}
          <TextInput
            style={[
              styles.input,
              globalStyles.fontfm,
              globalStyles.h6,
              mobilePattern ? { paddingLeft: 40 } : {},
            ]}
            placeholder="Email or mobile number"
            onChangeText={handleOnChangeInputField}
            value={email}
            allowFontScaling={false}
          />
          {mobilePattern && (
            <View style={styles.inputAdornment}>
              <Text
                style={[globalStyles.fontfm, globalStyles.h6]}
                allowFontScaling={false}
              >
                +91
              </Text>
            </View>
          )}
        </View>

        {!isEmailValid && !backendEmailError && (
          <Text
            style={[styles.errorText, globalStyles.fontfm, globalStyles.h6]}
            allowFontScaling={false}
          >
            The email id is not correct. Please try again.
          </Text>
        )}

        {backendEmailError && (
          <Text
            style={[styles.errorText, globalStyles.fontfm, globalStyles.h6]}
            allowFontScaling={false}
          >
            This is not a valid email. Please contact the system administrator.
          </Text>
        )}

        {showPasswordInput && (
          <View style={styles.passwordContainer}>
            <View style={styles.inlineInput}>
              <Image
                source={require("../../assets/Lock_alt_duotone_line.png")}
                style={styles.icon}
              />
              <TextInput
                style={[styles.input, globalStyles.fontfm, globalStyles.h6]}
                placeholder="Password"
                onChangeText={setPassword}
                value={password}
                secureTextEntry={!showPassword}
                allowFontScaling={false}
              />
              <TouchableOpacity
                onPress={handleTogglePasswordVisibility}
                style={styles.eyeIcon}
              >
                <Image
                  source={
                    showPassword
                      ? require("../../assets/Eye_light.png")
                      : require("../../assets/Eye Not Visible.png")
                  }
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
        {passwordError && (
          <Text
            style={[styles.errorText, globalStyles.fontfm, globalStyles.h6]}
            allowFontScaling={false}
          >
            Please enter the correct password
          </Text>
        )}
        {/* {showPasswordInput && (
          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={getForgotPassword}
          >
            <Text
              style={[
                styles.forgotPasswordText,
                globalStyles.fs4,
                globalStyles.h6,
              ]}
              allowFontScaling={false}
            >
              Forgot Password?
            </Text>
          </TouchableOpacity>
        )} */}

        <TouchableOpacity
          onPress={showPasswordInput ? handleLogin : handleProceed}
          style={styles.button}
        >
          <Text
            style={[styles.buttonText, globalStyles.fs1, globalStyles.h6]}
            allowFontScaling={false}
          >
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
    paddingHorizontal: "5%",
  },
  header: {
    alignItems: "flex-start",
    marginBottom: 20,
    width: "100%",
  },
  image: {
    marginBottom: 10,
    height: 35,
    width: 30,
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
    position: "relative",
  },
  icon: {
    marginRight: 0,
    height: 25,
    width: 25,
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 0,
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
    height: 48,
    backgroundColor: "#3D48E5",
    borderRadius: 8,
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
    top: 0,
    bottom: 5,
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 10,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#3D48E5",
    fontWeight: "bold",
  },
});

export default LoginScreen;
