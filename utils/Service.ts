import { useNavigation } from "@react-navigation/native";
import strings from "../Global/constants/StringConstants";
import urls from "../Global/constants/UrlConstants";
import store from "./store";
import { LoginScreenNavigationProp } from "../Components/type";


export function getNoAuthCallParams(methodType: string, body?: any) {
  const params = {
    method: methodType,
    headers: strings.applicationJSON,
  };
  switch (methodType) {
    case "GET":
      return params;
    case "POST":
      return { ...params, body: JSON.stringify(body) };
  }
}

export async function getFileCallParams(body: any) {
  const accessToken = "Bearer " + store.getState().auth.accessToken;
  return {
    method: "POST",
    headers: await await getHeaderObject(accessToken, "multipart/form-data"),
    body: body,
  };
}


export async function getHeaderObject(accessToken: string, contentType: any) {
    // const navigation = useNavigation<LoginScreenNavigationProp>();
  try {
    if (accessToken) {
      return {
        ...contentType,
        token: accessToken,
      };
    }
    // navigation.navigate("Login");
    return null;
  } catch (error: any) {
    throw error;
  }
}

export const getCallParams = async (methodType: string, body?: any) => {
  const accessToken = store.getState().auth.accessToken;
  
  const headers = await getHeaderObject(accessToken, (body instanceof FormData) ? {} : strings.applicationJSON);
  const params: any = {
    method: methodType,
    headers,
  };

  switch (methodType) {
    case "GET":
      if (body) {
        const queryString = new URLSearchParams(body).toString();
        console.log({ ...params, urlParams: queryString },'accessTokenaccessTokenaccessToken');
        return { ...params, urlParams: queryString };
      }
      return params;
    case "DELETE":
      return params;
    case "POST":
      return { ...params, body: (body instanceof FormData) ? body : JSON.stringify(body) };
    case "PUT":
      return { ...params, body: JSON.stringify(body) };
  }
};

export async function makeCall(callName: string, callParams: any) {
  try {
    let url = callName;
    if (callParams.urlParams) {

      url += `?${callParams.urlParams}`;

    }

    let call = fetch(url, callParams);
    let timeout = getTimeoutPromise();

    const response: any = await Promise.race([timeout, call]).catch((err) => {
      throw err;
    });
    const json = await response.json();
    if (response && response.ok) {
      return json;
    } else {
      throw json;
    }
  } catch (error: any) {
    const errorStatus: any = await checkStatus(error);
    if (errorStatus.status) {
      throw { message: errorStatus.message };
    }
    throw error;
  }
}

export function getTimeoutPromise() {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject({ error: true, message: "Timeout" }), 8000);
  });
}

export const checkStatus = async (error: any) => {
  if (error.status === 403 || error.status === 401 || error.message === "Failed to authenticate token.") {
    // store.dispatch(logOutAction());
    // history.push(urls.landingViewPath);
    return { status: true, message: error.message };
  } else return false;
};
