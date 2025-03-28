import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./Screens/LoginScreen";
import Dashboard from "./Screens/Dashboard";
import Leads from "./Screens/Leads";
import MyProfile from "./Screens/MyProfile";
import { RootStackParamList, RootStackParamList1 } from "./type";
import { useSelector } from "react-redux";
import { RootState } from "../utils/store";
import LeadInfoScreen from "./Screens/LeadInfoScreen";
import CustomerFeedback from "./Screens/CustomerFeedback";
import ErrorPage from "../Global/Components/ErrorPage";
import { Alert, Text } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import ForgotPassword from "./Screens/ForgotPassword";
import AllTeamList from "./Screens/AllTeamList";
import DashboardNew from "../NewDesine/Dashboard/DashboardNew";
import TeamLead from "./Screens/TeamLead";
import AllLeadScreen from "./Screens/AllLeadScreen";
import AddLeadManual from "./Screens/AddLeadManual";
import NotificationsScreen from "./Screens/NotificationsScreen";

const Stack = createNativeStackNavigator();

const Navigation: React.FC = () => {
  const { authenticated } = useSelector((state: RootState) => state.auth);
  console.log(authenticated, "sdpkfvndefovndfjobndjobdb");

  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ?? true);
      if (!state.isConnected) {
        Alert.alert(
          "No Internet Connection",
          "Please check your network connection."
        );
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (!isConnected) {
    return <ErrorPage />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {authenticated ? (
          <>
            <Stack.Screen
              name="Dashboard"
              component={Dashboard}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Leads"
              component={Leads}
              options={{
                headerTitle: () => (
                  <Text
                    style={{
                      marginLeft: -20,
                      fontSize: 20,
                      fontWeight: "bold",
                    }}
                    allowFontScaling={false}
                  >
                   My Lead
                  </Text>
                ),
                headerStyle: {
                  backgroundColor: "#FFFFFF",
                  ...({} as any),
                },
                headerShadowVisible: false,
              }}
            />

<Stack.Screen
              name="TeamLead"
              component={TeamLead}
              options={{
                headerTitle: () => (
                  <Text
                    style={{
                      marginLeft: -20,
                      fontSize: 20,
                      fontWeight: "bold",
                    }}
                    allowFontScaling={false}
                  >
                   Team Lead
                  </Text>
                ),
                headerStyle: {
                  backgroundColor: "#FFFFFF",
                  ...({} as any),
                },
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="AllLeadScreen"
              component={AllLeadScreen}
              options={{
                headerTitle: () => (
                  <Text
                    style={{
                      marginLeft: -20,
                      fontSize: 20,
                      fontWeight: "bold",
                    }}
                    allowFontScaling={false}
                  >
                 All Lead
                  </Text>
                ),
                headerStyle: {
                  backgroundColor: "#FFFFFF",
                  ...({} as any),
                },
                headerShadowVisible: false,
              }}
            />

<Stack.Screen
              name="AddLeadManual"
              component={AddLeadManual}
              options={{
                headerTitle: () => (
                  <Text
                    style={{
                      marginLeft: -20,
                      fontSize: 20,
                      fontWeight: "bold",
                    }}
                    allowFontScaling={false}
                  >
                 Add Leads
                  </Text>
                ),
                headerStyle: {
                  backgroundColor: "#FFFFFF",
                  ...({} as any),
                },
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="MyProfile"
              component={MyProfile}
              options={{
                headerTitle: () => (
                  <Text
                    style={{
                      marginLeft: -20,
                      fontSize: 20,
                      fontWeight: "bold",
                    }}
                    allowFontScaling={false}
                  >
                    My Profile
                  </Text>
                ),
                headerStyle: {
                  backgroundColor: "white",
                  ...({} as any),
                },
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="AllTeamList"
              component={AllTeamList}
              options={{
                headerTitle: () => (
                  <Text
                    style={{
                      marginLeft: -20,
                      fontSize: 20,
                      fontWeight: "bold",
                    }}
                    allowFontScaling={false}
                  >
                    Teams
                  </Text>
                ),
                headerStyle: {
                  backgroundColor: "white",
                  ...({} as any),
                },
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="LeadInfoScreen"
              component={LeadInfoScreen}
              options={{
                // title : "Lead Info Screen",
                headerTitle: () => (
                  <Text
                    style={{
                      marginLeft: -20,
                      fontSize: 20,
                      fontWeight: "bold",
                    }}
                    allowFontScaling={false}
                  >
                    Lead Info
                  </Text>
                ),
                headerStyle: {
                  backgroundColor: "white",
                  ...({} as any),
                },
                headerShadowVisible: false,
              }}
            />

<Stack.Screen
              name="NotificationsScreen"
              component={NotificationsScreen}
              options={{
                headerTitle: () => (
                  <Text
                    style={{
                      marginLeft: -20,
                      fontSize: 20,
                      fontWeight: "bold",
                    }}
                    allowFontScaling={false}
                  >
                    Notifcations
                  </Text>
                ),
                headerStyle: {
                  backgroundColor: "white",
                  ...({} as any),
                },
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="CustomerFeedback"
              component={CustomerFeedback}
              options={{
                headerTitle: () => (
                  <Text
                    style={{
                      marginLeft: -20,
                      fontSize: 20,
                      fontWeight: "bold",
                    }}
                    allowFontScaling={false}
                  >
                    Customer Feedback
                  </Text>
                ),
                headerStyle: {
                  backgroundColor: "white",
                  ...({} as any),
                },
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="ErrorPage"
              component={ErrorPage}
              options={{
                headerStyle: {
                  backgroundColor: "white",
                  ...({} as any),
                },
                headerShadowVisible: false,
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPassword}
              options={{ headerShown: false }}
            />
          </>
        )}

{/* <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
