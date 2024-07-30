
import { StackNavigationProp } from "@react-navigation/stack";
export type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  Leads: undefined;
  MyProfile :undefined
  LeadInfoScreen:undefined
};

// types.ts
export type RootStackParamList1 = {
  Login: undefined; // No parameters for Login screen
  Dashboard: undefined; // No parameters for Dashboard screen
  Leads: { param1: string; param2: string }; // Example parameters for Leads screen
  MyProfile: undefined; // No parameters for MyProfile screen
  LeadInfoScreen:undefined
};

export type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Login"
>;
