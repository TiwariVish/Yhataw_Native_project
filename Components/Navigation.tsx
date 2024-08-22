import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./Screens/LoginScreen";
import Dashboard from "./Screens/Dashboard";
import Leads from "./Screens/Leads";
import MyProfile from "./Screens/MyProfile";
import { RootStackParamList, RootStackParamList1 } from "./type"; // Import the types
import { useSelector } from "react-redux";
import { RootState } from "../utils/store";
import LeadInfoScreen from "./Screens/LeadInfoScreen";
import CustomerFeedback from "./Screens/CustomerFeedback";
import ErrorPage from "../Global/Components/ErrorPage";

const Stack = createNativeStackNavigator();

const Navigation: React.FC = () => {
  const { authenticated } = useSelector((state: RootState) => state.auth);
  console.log(authenticated,"sdpkfvndefovndfjobndjobdb");
  
  return (
    <NavigationContainer>
      <Stack.Navigator >
        {authenticated ? (
          <>
            <Stack.Screen name="Dashboard" component={Dashboard}   options={{ headerShown: false }} />
            <Stack.Screen name="Leads" component={Leads}/>
            <Stack.Screen name="MyProfile" component={MyProfile} />
            <Stack.Screen name="LeadInfoScreen" component={LeadInfoScreen} />
            <Stack.Screen name="CustomerFeedback" component={CustomerFeedback} />
            <Stack.Screen name="ErrorPage" component={ErrorPage} />

          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen}   options={{ headerShown: false }}  />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
