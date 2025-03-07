
import { StackNavigationProp } from "@react-navigation/stack";
export type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  Leads: undefined;
  MyProfile :undefined
  LeadInfoScreen:{selectedCard:any}
  CustomerFeedback:undefined
  ErrorPage:undefined
  ForgotPassword :undefined
  DashboardNew:undefined
  AllTeamList :{ allTeams: any }
  TeamLead :{ selectedView: any }
  AllLeadScreen :{ selectedView: any }
};

// types.ts
export type RootStackParamList1 = {
  Login: undefined; 
  Dashboard: undefined; 
  Leads: { param1: string; param2: string }; 
  MyProfile: undefined; 
  LeadInfoScreen:{selectedCard:any}
  CustomerFeedback:undefined
  ErrorPage:undefined
  ForgotPassword :undefined
  DashboardNew:undefined
  AllTeamList :{ allTeams: any }
  TeamLead : { selectedView: any }
  AllLeadScreen : { selectedView: any }
};

export type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Login"
>;
