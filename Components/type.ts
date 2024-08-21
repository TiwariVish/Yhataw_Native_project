
import { StackNavigationProp } from "@react-navigation/stack";
export type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  Leads: undefined;
  MyProfile :undefined
  LeadInfoScreen:undefined
  CustomerFeedback:undefined
  ErrorPage:undefined
};

// types.ts
export type RootStackParamList1 = {
  Login: undefined; 
  Dashboard: undefined; 
  Leads: { param1: string; param2: string }; 
  MyProfile: undefined; 
  LeadInfoScreen:undefined
  CustomerFeedback:undefined
  ErrorPage:undefined
};

export type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Login"
>;
