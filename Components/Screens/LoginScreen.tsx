import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Animated,
  TextInput,
} from "react-native";
import CustomInput from "../../Global/Components/CustomInput";
import CustomButton from "../../Global/Components/CustomButton";
import { globalStyles } from "../../GlobalCss/GlobalStyles";
import styles from "./LoginScreen.style";
import { useDispatch, useSelector } from "react-redux";
import { loginAction } from "../../Redux//authSlice";
import { RootState } from "../../utils/store";
import { login } from "./LoginScreenService";
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [IsLoading, setIsLoading] = useState(true);
  const [mobilePattern, setMobilePattern] = useState(false);

  const dispatch = useDispatch();
  const { authenticated } = useSelector((state: RootState) => state.auth);

  const handleProceed = async () => {
    const isValid = validateEmail(email);
    if (!isValid) {
      setIsEmailValid(false);
      return;
    }
    try {
      setIsLoading(true);
      const response = await login(email, password);
      if (response?.message?.settings?.success) {
        setIsEmailValid(true);
        setShowPasswordInput(true);
      } else {
        console.log("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const response = await login(email, password);
      console.log(response, "password--------------------");
      if (response?.message?.settings?.success) {
        const { accessToken, fullName, role, _id } =
        response?.message?.data?.user;
        dispatch(loginAction({
          authenticated: true,
          accessToken: accessToken,
          userName: fullName,
          email: response.message.data.user.email,
          role,
          userId: _id,
          privileges: response.message.data.user?.role_privileges || {},
        }));
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

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // const handleOnChangeInputField = (event) => {
  //   const { value } = event.target;
  //   setEmail(value);
  //   const isNumeric = /^[0-9]+$/.test(value);
  //   setMobilePattern(isNumeric);
  // };

  const handleOnChangeInputField = (text: string) => {
    setEmail(text);
    const isNumeric = /^[0-9]+$/.test(text);
    setMobilePattern(isNumeric);
  };

  // const handleOnChangePasswordField = (event) => {
  //   const { value } = event.target;
  //   setPassword(value);
  // };

  const handleOnChangePasswordField = (text: string) => {
    setPassword(text);
  };

  function handleTogglePasswordVisibility() {
    setShowPassword(!showPassword);
  }

  useEffect(() => {}, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require("../../assets/Logo.png")}
            style={styles.image}
          />
          <View style={styles.textContainer}>
            <Text
              style={[globalStyles.h1, globalStyles.fs1, globalStyles.fontfm]}
            >
              Sign in
            </Text>
            <Text style={[globalStyles.h8, globalStyles.fs4]}>
              to access Pulse CRM
            </Text>
          </View>
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.inlineInput}>
            <Image
              source={require("../../assets/User_box_light.png")}
              style={styles.icon}
            />
            {/* <CustomInput
              style={styles.input}
              placeHolder="Email or mobile number"
              id="email"
              type="email"
              name="email"
              onChange={handleOnChangeInputField}
              value={email}
            /> */}

            <TextInput
              style={styles.input}
              placeholder="Email or mobile number"
              onChangeText={handleOnChangeInputField}
              value={email}
            />
            {mobilePattern && (
              <View style={styles.inputAdornment}>
                <Text style={styles.startText}>+91</Text>
              </View>
            )}
          </View>
          {/* {!isEmailValid && (
            <Text style={styles.errorText}>
              This is not a valid email. Please contact system administrator.
            </Text>
          )} */}
        </View>
        <View>
        {!isEmailValid && (
            <Text style={styles.errorText}>
              This is not a valid email. Please contact system administrator.
            </Text>
          )}
        </View>
        {showPasswordInput && (
          <View style={styles.viewCont}>
            <View style={styles.inlineInput}>
              <Image
                source={require("../../assets/Lock_icon.png")}
                style={styles.icon}
              />
              {/* <CustomInput
                style={styles.input}
                placeHolder="Password"
                id="password"
                type="password"
                name="password"
                onChange={handleOnChangePasswordField}
                value={password}
                secureTextEntry={!showPassword}
              /> */}
               <TextInput
              style={styles.input}
              placeholder="Password"
              onChangeText={handleOnChangePasswordField}
              value={password}
                secureTextEntry={!showPassword}
            />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={handleTogglePasswordVisibility}
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
        <View style={styles.viewcustomButton}>
          <CustomButton
            label={showPasswordInput ? "Log In" : "Proceed"}
            buttonType="iconBtn"
            labelStyle={styles.labelStyle}
            onClick={showPasswordInput ? handleLogin : handleProceed}
            style={styles.button}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
