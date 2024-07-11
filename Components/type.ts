
import { StackNavigationProp } from "@react-navigation/stack";
export type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  Leads: undefined;
  MyProfile :undefined
};
export type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Login"
>;
