import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../utils/store";

export interface AuthState {
  authenticated: boolean;
  accessToken: string;
  loading: boolean;
  userName: string;
  email: string;
  role?: string;
  hierarchyLevel?:string,
  userId: string;
  privileges: any,
  currLead:any,
  leadData:any,
  myLeadData:any
  allTeams:any
  selectedStagesAll:any
  teamLeadData:any
}

const initialState: AuthState = {
  authenticated: false,
  accessToken: "",
  loading: false,
  userName: "",
  email: "",
  role: "",
  hierarchyLevel :"",
  userId: "",
  privileges: {},
  currLead:1,
  leadData:1,
  myLeadData:1,
  allTeams:1,
  teamLeadData:1,
  selectedStagesAll:""
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginAction: (
      state,
      action: PayloadAction<{
        authenticated: boolean;
        accessToken: string;
        userName: string;
        email: string;
        role: string;
        hierarchyLevel:string;
        userId: string;
        privileges: any;
      }>
    ) => {
      state.authenticated = action.payload.authenticated;
      state.accessToken = action.payload.accessToken;
      state.userName = action.payload.userName;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.hierarchyLevel = action.payload.hierarchyLevel
      state.userId = action.payload.userId;
      state.privileges = action.payload.privileges;
    },
    addLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    logOutAction: (state, action: {}) => {
      state.authenticated = false;
      state.loading = false;
      state.accessToken = "";
      state.userName = "";
      state.email = "";
      state.role = "";
      state.hierarchyLevel ="";
      state.userId = "";
      state.privileges = {};
    },
    setLeadId: (state, action: PayloadAction<any>) => {
      state.currLead = action.payload;
    },
    setLeadDatad: (state, action: PayloadAction<any>) => {
      state.leadData = action.payload;
    },
    setMyLeadData:(state, action: PayloadAction<any>) =>{
      state.myLeadData = action.payload;
    },
    setTeamsLead :(state, action: PayloadAction<any>) =>{
      state.teamLeadData = action.payload;
    },

    setAllTeams:(state, action: PayloadAction<any>) =>{
      state.allTeams = action.payload;
    },
    setSelectedStagesAll: (state, action: PayloadAction<any>) => {
      state.selectedStagesAll = action.payload; 
    }
    
  },
});

export const { loginAction, logOutAction, addLoading,setLeadId,setLeadDatad, setMyLeadData,setAllTeams,setSelectedStagesAll,setTeamsLead } = authSlice.actions;

export const selectAuthenticated = (state: RootState) =>state.auth.authenticated;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectLoading = (state: RootState) => state.auth.loading;
export const selectEmail = (state: RootState) => state.auth.email;
export const selectName = (state: RootState) => state.auth.userName;
export const selectRole = (state: RootState) => state.auth.role;
export const hierarchyLevel =(state :RootState) =>state.auth.hierarchyLevel
export const selectUserId = (state: RootState) => state.auth.userId;
export const selectPrivileges = (state: RootState) => state.auth.privileges;
export const selectCurrLead = (state: RootState) => state.auth.currLead;
export const setStagesAll = (state: RootState) =>state.auth.selectedStagesAll

export default authSlice.reducer;