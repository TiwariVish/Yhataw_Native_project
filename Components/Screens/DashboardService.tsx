import urls from "../../Global/constants/UrlConstants";
import { getCallParams, getNoAuthCallParams, makeCall } from "../../utils/Service";

export async function getDataAllLead(roleId?: any) {
    try {
      const callParams = await getCallParams("POST",roleId);
      const response = await makeCall(urls.DASHBOARDALLLEADS, callParams);
      return response;
    } catch (error) {
      throw error;
    }
  }

  export async function getDataProject(roleId?: String) {
    try {
      const callParams = await getCallParams("GET");
  
      const response = await makeCall(urls.DASHBOARDPROJECT, callParams);
      return response;
    } catch (error) {
      throw error;
    }
  }

  export async function getDataAttendance(roleId?: String) {
    try {
      const callParams = await getCallParams("GET");
  
      const response = await makeCall(urls.DASHBOARDATTENDANCE, callParams);
      return response;
    } catch (error) {
      throw error;
    }
  }

  export async function getDataMyAttendance(roleId?: String) {
    try {
      const callParams = await getCallParams("GET");
  
      const response = await makeCall(`${urls.DASHBOARDMYATTENDANCE}${roleId}`, callParams);
      return response;
    } catch (error) {
      throw error;
    }
  }


  export async function getDataMylead(roleId?: String) {
    try {
      const callParams = await getCallParams("GET");
  
      const response = await makeCall(urls.DASHBOARDMYLEAD, callParams);
      return response;
    } catch (error) {
      throw error;
    }
  }

  export async function getMyTeam(roleId?: String) {
    try {
      const callParams = await getCallParams("GET");
  
      const response = await makeCall(`${urls.DASHBOARDMYTEAM}${roleId}`, callParams);
      return response;
    } catch (error) {
      throw error;
    }
  }
  export async function getReminder(id: any) {
    try {
      const callParams = await getCallParams("GET");
      const response = await makeCall(`${urls.GETREMINDERALL}`, callParams);
      return response;
    } catch (error) {
      throw error;
    }
  }

  export async function getTeamList() {
    try {
      const callParams = await getCallParams("GET");
      const response = await makeCall(urls.GETTEAMMETALIST, callParams);
      return response;
    } catch (error) {
      throw error;
    }
  }

  export async function addBanner() {
    try{
      const callParams = await getCallParams("GET");
      const response = await makeCall(urls.ADDBANNER, callParams);
      return response;
    }
    catch (error) {
      throw error;
    }
    
  }