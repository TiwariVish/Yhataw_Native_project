import urls from "../../Global/constants/UrlConstants";
import { getCallParams, makeCall } from "../../utils/Service";



export async function getPerosnalDetails(userId: String) {
    try {
      const callParams = await getCallParams("GET");
      const response = await makeCall(
        urls.GETEMPLOYEERECORDBYID + userId,
        callParams
      );
      return response;
    } catch (error) {
      throw error;
    }
  }