import urls from "../../Global/constants/UrlConstants";
import { getCallParams, makeCall } from "../../utils/Service";




export async function getAllUsers(payload: any) {
    try {
      const callParams = await getCallParams("GET");
      const response = await makeCall(
        urls.LEADDATA +
          `?start_date=&end_date=&id=${payload.userId}&page=${payload.pageNo}&limit=${payload.pageSize}&searchUserId=${payload.lead_id}`,
        callParams
      );
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

  export async function getAllUsersMyLead(payload: any) {
    try {
      const callParams = await getCallParams("GET");
      console.log(callParams, "callParams");
      const response = await makeCall(
        urls.MYLEAD +
          `?start_date=&end_date=&id=${payload.userId}&page=${payload.pageNo}&limit=${payload.pageSize}`,
        callParams
      );
      return response;
    } catch (error) {
      throw error;
    }
  }