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

  export async function getTeamWiseMember(userId: String) {
    try {
      const callParams = await getCallParams("GET");
      const response = await makeCall(
        urls.GETTEAMWISEMEMBER + userId,
        callParams
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  export async function getTeamUserWise(userId: String) {
    try {
      const callParams = await getCallParams("GET");
      const response = await makeCall(
        urls.GETTEAMUSERWISE + userId,
        callParams
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  export async function getAllUsers(payload: any) {
    try {
      const callParams = await getCallParams("GET");
      const response = await makeCall(
        urls.LEADDATA +
          `?start_date=${payload.startDate || ""}&end_date=${payload.endDate || ""}&id=${payload.userId}&page=${payload.pageNo}&limit=${payload.pageSize}&teamId=${payload.team_id || ""}&formId=${payload.formId || ""}&search=${payload.search || ""}`,
        callParams
      );
      console.log(response,"fbskjfskfjsvdkfsvfkjsdfsdfs")
      return response;
    } catch (error) {
      throw error;
    }
  }

  export async function getPerosnalOffice(userId: String) {
    try {
      const callParams = await getCallParams("GET");
      const response = await makeCall(
        urls.GETEMPLOYEEOFFICEDETAILBYID + userId,
        callParams
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  export async function getAllForms(payload: any) {
    try {
      const callParams = await getCallParams("GET");
      // const response = await makeCall(urls.GETALLLFORMS, callParams);
      const response = await makeCall(urls.GETALLLFORMS+`?limit=${payload.pageSize}&search=${payload.search || ""}&page=${payload.pageNo}`, callParams);
      return response;
    } catch (error) {
      throw error;
    }
  }