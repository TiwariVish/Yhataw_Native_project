// import strings from "../Global/constants/StringConstants";
// import { store } from "./store";
// import urls from "../Global/constants/UrlConstants";
// import { logOutAction } from "../Redux/authSlice";
// import history from "./history"

// export const getCallParams = async (methodType: string, body?: any) => {
//     const accessToken = store.getState().auth.accessToken;
//     const params = {
//       method: methodType,
//       headers: await getHeaderObject(accessToken, (body instanceof FormData)? {}: strings.applicationJSON),
//     };
//     switch (methodType) {
//       case "GET":
//         return params;
//       case "DELETE":
//         return params;
//       case "POST":
//         return { ...params, body: (body instanceof FormData)? body: JSON.stringify(body) };
//       case "PUT":
//         return { ...params, body: JSON.stringify(body) };
//     }
//   };

//   export async function getHeaderObject(accessToken: string, contentType: any) {
//     try {
//       if (accessToken) {
//         return {
//           ...contentType,
//           token: accessToken,
//         };
//       }
//       history.push(urls.landingViewPath);
//       return null;
//     } catch (error: any) {
//       throw error;
//     }
//   }

//   export async function makeCall(callName: string, callParams: any) {
//     try {
//       let call = fetch(callName, callParams);
//       let timeout = getTimeoutPromise();
  
//       const response: any = await Promise.race([timeout, call]).catch((err) => {
//         throw err;
//       });
//       const json = await response.json();
//       if (response && response.ok) {
//         return json;
//       } else {
//         throw json;
//       }
//     } catch (error: any) {
//       const errorStatus: any = await checkStatus(error);
//       if (errorStatus.status) {
//         throw { message: errorStatus.message };
//       }
//       throw error;
//     }
//   }

//   export function getTimeoutPromise() {
//     return new Promise((resolve, reject) => {
//       setTimeout(() => reject({ error: true, message: "Timeout" }), 8000);
//     });
//   }


//   export const checkStatus = async (error: any) => {
//     if (error.status === 403 || error.status === 401 || error.message === "Failed to authenticate token.") {
//       store.dispatch(logOutAction());
//       history.push(urls.landingViewPath);
//       return { status: true, message: error.message };
//     } else return false;
//   };
  