export class StringConstants {
    regex =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  LOGIN = "login";
  REGISTER = "register";
  FORGOTPASSWORD = "forgot-password";
  CHANGE_PASSWORD = "changepwd";
  SIGN_UP = "sign-up";
  ONBOADING_SECLECT_INDUSTRY = "onboading-select-industry";
  RESTPASSWORDLINK = "reset-password-link";
  OPTSCREEN = "mobile-verification";

  //contentTypes
  notification = "notification";
  error = "error";
  success = "success";
  warning = "warning";
  info = "info";
  autoHideDuration = 600 * 1000; //in milliseconds
  SEARCH_TIME_OUT = 350;

  // authManager
  DASHBOARD = "admin-dashboard";
  DASHBOARDCRM = "crm-dashboard";
  DASHBOARDHR = "hr-dashboard";
  DASHBOARDMY = "my-dashboard";
  SETTINGS = "setting";
  ACCOUNTSETTINNGS = "account-settings";
  MEATADATA = "meta-data";
  METALIST = "meta-list";
  LEAVE = "leave";
  ALLLEAVE = "All leave";
  TEAM = "team";
  ATTENDANCE = "attendance";
  ALLATTENDANCE = "all-attendance";
  ALLLEAVES = "allleaves";
  SALARYSLIP = "salary-slip";
  TEAMDASHBOARD = "team";
  PROJECTS = "project";
  PROJECTSASSETS = "project-assets";
  CREATEPROJECT = "create-project";
  ROLESANDPRIVILEGES =  "role-privileges";
  LEADFORMLIST = "leadformlist";
  ALLLEADLIST = "allleadlist";
  MYLEADS = "myLeads";
  BULKASSIGN = "bulkAssign";
  BULKUPLOADEPROJECTWISE = "bulkAssignProjectwise";
  LEADS = "Leads";
  BULKUPLOADE = "Bulk-Uploade";
  REPORT = "Report"
  SALESREPORT = "Sales-report"
  SOURCESREPORT = "Source-report"
  SITEVISITSREPORT = "Site-visit-report"
  PROJECTREPORT = "Project-report"
  CLOSUREREPORT = "Clouser-report"
  ARCHIVEMEMBER = "Archive-member"
  AGGREGATOR = "Aggregator-api"
  //contentTypes
  applicationJSON = { "Content-Type": "application/json" };

}

let strings = new StringConstants();
export default strings;
