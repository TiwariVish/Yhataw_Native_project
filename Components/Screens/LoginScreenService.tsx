import urls from "../../Global/constants/UrlConstants";
import { getNoAuthCallParams, makeCall } from "../../utils/Service";

export async function login(username: string, password: string) {
  // password = "Admin@1234";

  var body;
  if (password.length) {
    body = { username: username.toLocaleLowerCase(), password: password };
  } else {
    body = {
      username: username.toLocaleLowerCase(),
    };
  }
  try {
    const callParams = getNoAuthCallParams("POST", body);
    const response: any = await makeCall(urls.login, callParams);
    return response;
  } catch (error: any) {
    throw error;
  }
}
