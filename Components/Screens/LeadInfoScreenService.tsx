import urls from "../../Global/constants/UrlConstants";
import { getCallParams, makeCall } from "../../utils/Service";

export async function getAllStage() {
    try {
      const callParams = await getCallParams("GET");
      const response = await makeCall(urls.GETALLSTAGE, callParams);
      return response;
    } catch (error) {
      throw error;
    }
  }

  export async function getStage() {
  
    try {
      const callParams = await getCallParams("GET");
      const response = await makeCall(urls.GETSTAGEDATA, callParams);
      console.log(response,"reminderResponseData")
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


  export async function getAllTeamMembersData(payload: any) {
    try {
      const callParams = await getCallParams("POST", payload);
      const response = await makeCall(`${urls.GETMEMBERSDROP}`, callParams);
      return response;
    } catch (error) {
      throw error;
    }
  }

  export async function changeStage(body: any) {
    try {
      const callParams = await getCallParams("PUT", body);
      const response = await makeCall(urls.UPDATESTAGE, callParams);
      return response;
    } catch (error) {
      throw error;
    }
  }

  export async function changeAt(body: any) {
    try {
      const callParams = await getCallParams("PUT", body);
      const response = await makeCall(urls.UPDATEAI, callParams);
      return response;
    } catch (error) {
      throw error;
    }
  }

  export async function assignToMembers(body: any) {
    try {
      const callParams = await getCallParams("PUT", body);
      const response = await makeCall(urls.ASSIGNTOMEMBERS, callParams);
      return response;
    } catch (error) {
      throw error;
    }
  }

  export async function getAllTeamData(id: any) {
    try {
      const callParams = await getCallParams("GET");
      const response = await makeCall(`${urls.GETTEAMDROP}/${id}`, callParams);
      return response;
    } catch (error) {
      throw error;
    }
  }


  export async function getOfficeDetails(userId: String) {
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