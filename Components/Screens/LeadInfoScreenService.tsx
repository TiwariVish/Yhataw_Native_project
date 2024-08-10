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


  export async function getTeamList() {
    try {
      const callParams = await getCallParams("GET");
      const response = await makeCall(urls.GETTEAMMETALIST, callParams);
      return response;
    } catch (error) {
      throw error;
    }
  }