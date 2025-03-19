import urls from "../../Global/constants/UrlConstants";
import { getCallParams, makeCall } from "../../utils/Service";

export async function getPreSalesDetails(payload:any) {
    try {
      const callParams = await getCallParams("GET");
      const response = await makeCall(
        `${urls.GETPRESALESREPORT}?start_date=${payload.startDate}&end_date=${payload.endDate}&team_id=${payload.teamId}&page=${payload.pageNumber}&limit=${payload.pageSize}&search=${payload.search}`,
        callParams
      );
      return response;
    } catch (error) {
      throw error;
    }
  }


  export async function getSalesDetails(payload:any) {
    try {
      const callParams = await getCallParams("GET");
      const response = await makeCall(
        `${urls.GETSALESREPORT}?start_date=${payload.startDate}&end_date=${payload.endDate}&team_id=${payload.teamId}&page=${payload.pageNumber}&limit=${payload.pageSize}&search=${payload.search}`,
        callParams
      );
      return response;
    } catch (error) {
      throw error;
    }
  }



  export async function getAllUsersAll(payload:any) {
    try {
      const callParams = await getCallParams("GET");
      const response = await makeCall(
        `${urls.GETALLUSER}?start_date=${payload.startDate}&end_date=${payload.endDate}&page=${payload.pageNumber}&limit=${payload.pageSize}&team_id=${payload.teamId}&search=${payload.search}`,
        callParams
      );
      return response;
    } catch (error) {
      throw error;
    }
  }


  export async function registerEmployee(body: any) {
    try {
      const callParams = await getCallParams("POST", body);
      const response = await makeCall(urls.REGISTERLEAD, callParams);
      return response;
    } catch (error) {
      throw error;
    }
  }