import { getCallParams, makeCall } from "../../utils/Service";
import urls from "../constants/UrlConstants";


export async function addPushNotification(payload:any) {
    console.log(payload,"payloadddddddddddddddd")

    try {
      const callParams = await getCallParams("POST",payload);
      const response = await makeCall(urls.ADDPUSHNOTIFICATION, callParams);
      console.log(response,"responseeeeeeeeeeeeee")
      return response;
    } catch (error) {
      throw error;
    }
  }
  export async function updatePushNotification(payload:any) {
    console.log(payload,"payloadddddddddddddddd")

    try {
      const callParams = await getCallParams("PUT",payload);
      const response = await makeCall(urls.UPDATEPUSHNOTIFICATION, callParams);
      console.log(response,"responseeeeeeeeeeeeee")
      return response;
    } catch (error) {
      throw error;
    }
  }
  export async function getNotification() {
    try {
      const callParams = await getCallParams("GET");
      const response = await makeCall(urls.GETNOTIFICATION, callParams);
      console.log(response)
  
      return response;
    } catch (error) {
      console.log("hh")
      throw error;
    }
  }
  export async function addNotificationToken(payload:any) {
    console.log(payload,"payloadddddddddddddddd")

    try {
      const callParams = await getCallParams("POST",payload);
      const response = await makeCall(urls.ADDNOTIFICATIONTOKEN, callParams);
      console.log(response,"responseeeeeeeeeeeeee")
      return response;
    } catch (error) {
      throw error;
    }
  }
  export async function getAllTodayReminders() {
    try {
      const callParams = await getCallParams("GET");
      const response = await makeCall(urls.GETTODAYREMINDERS, callParams);
      console.log(response)
  
      return response;
    } catch (error) {
      console.log("hh")
      throw error;
    }
  }