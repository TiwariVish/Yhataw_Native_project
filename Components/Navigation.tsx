import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./Screens/LoginScreen";
import Dashboard from "./Screens/Dashboard";
import Leads from "./Screens/Leads";
import MyProfile from "./Screens/MyProfile";
import { RootStackParamList } from "./type"; // Import the types

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="Leads" component={Leads} />
        <Stack.Screen name="MyProfile" component={MyProfile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
