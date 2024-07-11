import {StringConstants} from "./StringConstants"
const ip1 = "http://13.200.251.4:5000"
const ip2 = "http://15.206.57.57:5000"

class UrlConstants extends StringConstants {
    url_prod = ip2;
  url_dev = "https://api-uat.xyz.com/xyz";

  
  landingViewPath = "/";

  DASHBOARDALLLEADS = `${this.url_prod}/dashboardAllLead`;




    // View Paths
    // landingViewPath = "/";
    loginViewPath = "/login";
}

let urls = new UrlConstants();
export default urls;
