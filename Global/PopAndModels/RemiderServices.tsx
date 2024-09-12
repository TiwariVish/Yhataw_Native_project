import { getCallParams, makeCall } from "../../utils/Service";
import urls from "../constants/UrlConstants";

export async function saveReminder(body: any) {
    try {
      const callParams = await getCallParams("POST", body);
      const response = await makeCall(urls.UPDATEREMINDER, callParams);
      return response;
    } catch (error) {
      throw error;
    }
  }


  export async function getAllReminder(id: any) {
    try {
      const callParams = await getCallParams("GET");
      const response = await makeCall(
        urls.UPDATEREMINDER + `/${id?.id}`,
        callParams
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  export async function getReminder(id: any) {
    try {
      const callParams = await getCallParams("GET");
      const response = await makeCall(`${urls.GETREMINDER}${id}`, callParams);
      return response;
    } catch (error) {
      throw error;
    }
  }

  export async function saveRemark(body: any) {
    try {
      const callParams = await getCallParams("POST", body);
      const response = await makeCall(urls.UPDATEREMARK, callParams);
      return response;
    } catch (error) {
      throw error;
    }
  }


  
export async function getRemark(id: any) {
  try {
    const callParams = await getCallParams("GET");
    const response = await makeCall(`${urls.GETREMARK}${id}`, callParams);
    return response;
  } catch (error) {
    throw error;
  }
}