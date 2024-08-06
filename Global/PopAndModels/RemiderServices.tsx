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