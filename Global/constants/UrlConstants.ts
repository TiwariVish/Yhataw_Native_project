import { StringConstants } from "./StringConstants";
const ip1 = "http://13.200.251.4:5000"
// const ip2 = "http://15.206.57.57:5000"
// const ip2 = "https://api.yhataw.com:5000"
const ip2 = "https://qa-api.yhataw.com:5000"
// const ip2 = "http://localhost:5000"
class UrlConstants extends StringConstants {
  url_prod = ip2;
  url_dev = "https://api-uat.xyz.com/xyz";
  
  // Dashboard
  DASHBOARD = `${this.url_prod}/dashboard`;
  DASHBOARDATTENDANCE = `${this.url_prod}/dashboardAttendance`;
  DASHBOARDMYATTENDANCE = `${this.url_prod}/dashboardAttendance/`;
  DASHBOARDPROJECT = `${this.url_prod}/dashboardProject`;
  DASHBOARDMYLEAD = `${this.url_prod}/dashboardMylead`;
  DASHBOARDALLLEADS = `${this.url_prod}/dashboardAllLead`;
  DASHBOARDMYTEAM = `${this.url_prod}/getTeamIdUserWise/`;




  // View Paths
  landingViewPath = "/";
  loginViewPath = "/login";
  forgotPasswordViewPath = "/forgot-password";
  changePasswordViewPath = "/changepwd";
  resetPasswordLinkViewPath = "/reset-password-link";
  updatePasswordViewPath = "/update-password";
  SignInViewPath = "/sign-in";
  mobileVerificationViewPath = "/mobile-verification";
  signUpViewPath = "/sign-up";
  onBoadingSelectIndustryViewPath = "/onboading-select-industry";

  dashboardViewPath = "/dashboard-admin";
  dashboardViewPathCrm = "/dashboard-crm";
  dashboardViewPathHr = "/dashboard-hr";
  dashboardViewPathMy = "/my-dashboard";
  settingsViewPath = "/setting";
  accountSettingsViewPth = "/setting/account";
  metaDataViewPath = "/setting/meta-data";
  metaListViewPath = "/setting/meta-data/meta-list";

  leaveViewPath = "/leave";
  allLeaveViewPath = "/all-Leave";
  teamViewPath = "/team";
  attendanceViewpath = "/all-attendance";
  myattendanceViewpath = "/my-Attendance";
  salarySlipViewPath = "/salary-slip";
  TeamDashboardViewpath = "/team-dashboard";
  rolesPrivilegesViewPath = "/setting/account/rolesPrivileges";
  mylead = "/my-Lead";
  bulkUploade = "/bulk-upload";
  bulkAssign = "/bulk-assign";
  bulkUploadeProjectwise = "/bulk-upload-projectwise";
  aggregatorApi = "/aggregator-api";

  salesReports = "/sales-reports"
  sourceReports = "/source-reports"
  siteVisitReports = "/siteVisit-reports"
  projectReports = "/project-reports"
  closureReports = "/clouser-reports"
  archiveMember = "/archive-member"

  login = `${this.url_prod}/auth/login`;
  GETALLUSER = `${this.url_prod}/allUser`;
  GETALLDEACTIVEUSER = `${this.url_prod}/allDeactivatedUser`;
  GETALLLFORMS = `${this.url_prod}/getForm`;
  LEADDATA = `${this.url_prod}/getLeadList`;
  LEADDATAASSIGN = `${this.url_prod}/getLeadListForReassign`;
  UPLOADLEAD = `${this.url_prod}/getUploadLead`;
  UPLOADLEADPROJECTWISE = `${this.url_prod}/getUploadMultipleLead`;
  MYLEAD = `${this.url_prod}/getMyLeadList`;
  passwordReset = `${this.url_prod}/auth/password-reset`;
  ADDUSEROFFICE = `${this.url_prod}/addUserOffice`;
  EDITPASSWORD = `${this.url_prod}/auth/change-password-by-Admin`;
  VERIFY_OTP = `${this.url_prod}/auth/verifyOtp`;
  PUNCHIN = `${this.url_prod}/punchIn`;
  CHECKPUNCHIN = `${this.url_prod}/checkPunchIn`;
  PUNCHOUT = `${this.url_prod}/punchOut`;
  UNMAPPEDPROJECT = `${this.url_prod}/getProjectUnMap`;

  // TEAMS
  GETALLUSERLEAVES = `${this.url_prod}/getUserApplyLeaveByIds`;

  REGISTEREMPLOYEE = `${this.url_prod}/auth/register`;
  REGISTERLEAD = `${this.url_prod}/addLead`;
  SAVEEMPLOYEEOFFICIALINFO = `${this.url_prod}/addUserOffice`;
  SAVEEMPLOYEEBANKINFO = `${this.url_prod}/addUserBank`;
  SAVEEMPLOYEEBANKDETAILS = `${this.url_prod}/addUserLeave`;

  GETEMPLOYEERECORDBYID = `${this.url_prod}/find/`;
  GETEMPLOYEEOFFICEDETAILBYID = `${this.url_prod}/findUserOffice/`;
  GETEMPLOYEEBANKDETAILBYID = `${this.url_prod}/findUserBank/`;
  GETEMPLOYEEDOCUMENTBYID = `${this.url_prod}/findDocument/`;
  GETEMPLOYEELEAVEDETAILBYID = `${this.url_prod}/findUserLeave/`;
  GETUSERBYDEATILSBYID = `${this.url_prod}/getUserApplyLeaveByIds/`;

  // employ Document
  IMAGEUPLOAD = `${this.url_prod}/upload-image`;
  ADDUSERDOC = `${this.url_prod}/addUserDoc`;
  GETUSERDOC = `${this.url_prod}/getUserDoc/`;

  GETCOUNTRY = `${this.url_prod}/getCountry`;
  GETSTATEBYCOUNTRYID = `${this.url_prod}/getState/`;
  GETCITYBYSTATEID = `${this.url_prod}/getCity/`;
  GETTIMEZONEBYCOUNTRYID = `${this.url_prod}/getTimezone/`;

  // GETEMPLOYEESALARYDETAILBYID = `${this.url_prod}/findUserLeave/`;
  UPDATEEMPLOYEEPERSONALDETAIL = `${this.url_prod}/updateUserPersonal`;
  UPDATELEADDETAIL = `${this.url_prod}/updateLead`;
  UPDATELEADEXPORTDETAILS = `${this.url_prod}/addUploadLead`;
  UPDATELEADEXPORTDETAILS2 = `${this.url_prod}/addUploadMultipleLead`;
  UPDATELEADUPLOADEDETAILS = `${this.url_prod}/updateUploadLead`;
  UPDATELEADUPLOADEDETAILS2 = `${this.url_prod}/updateUploadMultipleLead`;
  UPDATEEMPLOYEEOFFICIALDETAIL = `${this.url_prod}/updateUserOffice`;
  UPDATEEMPLOYEEBANKINFO = `${this.url_prod}/updateUserBank`;
  UPDATEEMPLOYEELEAVEINFO = `${this.url_prod}/updateUserLeave`;
  GETEMPLOYEESALARYDETAILBYID = `${this.url_prod}/findUserSalaryDeclaration/`;
  SAVEEMPLOYEESALARYDETAILS = `${this.url_prod}/addUserSalary`;
  UPDATEEMPLOYEESALARYINFO = `${this.url_prod}/updateUserSalary`;
  LEAVEAPPROVE = `${this.url_prod}/leaveApprove`;

  // salary slip
  GETSALARY = `${this.url_prod}/getSalary/`;

  // SETTING --> department
  GETALLDEPARTMENT = `${this.url_prod}/getDepartment`;
  ADDDEPARTMENT = `${this.url_prod}/addDepartment`;
  GETALLDESIGNATIONBYDEPARTMENTID = `${this.url_prod}/getDesignation/`;
  ADDDESIGNATIONTODEPARTEMENTBYID = `${this.url_prod}/addDesignation`;
  DELETEDEPARTMENTBYID = `${this.url_prod}/deleteDepartment/`;
  DELETEDESIGNATIONBYID = `${this.url_prod}/deleteDesignation/`;

  //Attendance
  GETALLUSERATTENDANCE = `${this.url_prod}/findUserAttendance`;
  GETUSERATTENDANCEBYID = `${this.url_prod}/findUserAttendance`;
  GETALLDEPARTMENTWITHDESIGNATION = `${this.url_prod}/getDepartmentList`;
  ATTENDANCEAPPROVE = `${this.url_prod}/attendanceApprove`;

  CHANGEPASSWORD = `${this.url_prod}/auth/change-password`;
  USERUPDATE = `${this.url_prod}/userStatusUpdate`;
  UPDATESTAGE = `${this.url_prod}/updateLeadStage`;
  UPDATEAI = `${this.url_prod}/updateLeadAssignTo`;
  UPDATEREMINDER = `${this.url_prod}/addLeadReminder`;
  UPDATEREMARK = `${this.url_prod}/addLeadRemark`;
  ASSIGNTOMEMBERS = `${this.url_prod}/updateLeadAssignToUser`;
  ADDPROJECTAPINEW = `${this.url_prod}/addProjectApiNew`;
  UPDATEPROJECTAPIEXISTING = `${this.url_prod}/updateProjectApiNew`;
  MOVEPROJECT = `${this.url_prod}/moveLeadFromUnmap`;
  DELETEREMARK = `${this.url_prod}/removeLeadReminder`;

  // organization
  getOrganizationByIds = `${this.url_prod}/getOrganizationByIds`;
  UPDATEORGANIZATION = `${this.url_prod}/updateOrganization`;
  ADDUPDATEORGANIZATION = `${this.url_prod}/addOrganiation`;

  ADDUSERLEAVE = `${this.url_prod}/addUserApplyLeave`;

  //projects
  PROJECTS = `/project`;
  PROJECTSASSETS = `/project/assets`;
  CREATEPROJECT = `/project/create`;
  AGGREGATOR = `/project/aggregator`;
  GETALLDEVELOPER = `${this.url_prod}/getDeveloper`;
  GETALLPROJECT = `${this.url_prod}/getProject`;
  GETPROJECTBYID = `${this.url_prod}/getProject/`;
  GETALLPROPERTYFOR = `${this.url_prod}/getPropetyFor`;
  GETALLPROPERTYTYPE = `${this.url_prod}/getPropetyType`;
  GETALLPROPERTYLIST = `${this.url_prod}/getPropertyList`;
  ADDALLPROPERTYLIST = `${this.url_prod}/addPropertyList`;
  UPDATEALLPROPERTYLIST = `${this.url_prod}/updatePropertyList`;
  GETALLPROPERTYUNITTYPE = `${this.url_prod}/getPropetyUnitType`;
  GETALLPROPERTYSTATUS = `${this.url_prod}/getPropetyStatus`;
  ADDDEVELOPER = `${this.url_prod}/addDeveloper`;
  ADDPROJECT = `${this.url_prod}/addProject`;
  ADDPROJECTDETAILS = `${this.url_prod}/addProjectDetail`;
  UPDATEPROJECTDETAILS = `${this.url_prod}/updateProjectDetail`;
  UPDATELEADDEFORMTAILS = `${this.url_prod}/updateForm`;
  GETPROJECTLIST = `${this.url_prod}/getProjectDetails`;
  GETPROJECTLISTBYID = `${this.url_prod}/getProjectDetails/`;
  GETDEVELOPERTREE = `${this.url_prod}/getDeveloperTree`;
  GETDEVELOPERTREEBYID = `${this.url_prod}/getDeveloperTree/`;
  GETPROPERTYSTATUSBYID = `${this.url_prod}/getPropetyStatus/`;
  GETPROPERTYUNITTYPEBYID = `${this.url_prod}/getPropetyUnitType/`;

  GETADDPROPERTYFOR = `${this.url_prod}/addPropetyFor`;
  GETADDPROPERTYTYPE = `${this.url_prod}/addPropetyType`;
  GETADDPROPERTYUNITTYPE = `${this.url_prod}/addPropetyUnitType`;
  GETAddPROPERTYSTATUS = `${this.url_prod}/addPropetyStatus`;
  UPDATEPROJECTNAME = `${this.url_prod}/updateProject`;
  UPDATEDEVELOPERNAME = `${this.url_prod}/updateDeveloper`;
  
  GETUPDATEPROPERTYFOR = `${this.url_prod}/updatePropetyFor`;
  GETUPDATEPROPERTYTYPE = `${this.url_prod}/updatePropetyType`;
  GETUPDATEPROPERTYUNITTYPE = `${this.url_prod}/updatePropetyUnitType`;
  GETUPDATEPROPERTYSTATUS = `${this.url_prod}/updatePropetyStatus`;

  UPLOADIMAGE = `${this.url_prod}/upload-image`;

  //role
  ADDROLE = `${this.url_prod}/addRole`;
  UPDATEROLE = `${this.url_prod}/updateRole`;
  GETROLEBYID = `${this.url_prod}/getRole/`;
  GETROLE = `${this.url_prod}/getRole`;

  //role
  ADDTEAMMETA = `${this.url_prod}/addTeam`;
  UPDATETEAMMETA = `${this.url_prod}/updateTeam`;
  UPDATEDEPARTMENTMETA = `${this.url_prod}/updateDeveloper`;
  EDITDEPARTMENTMETA = `${this.url_prod}/updateDepartment`;
  GETTEAMMETALIST = `${this.url_prod}/getTeamList`;
  GETTEAMDROP = `${this.url_prod}/getTeamDropDown`;
  GETMEMBERSDROP = `${this.url_prod}/getMultipleTeamWiseDropDown`;
  ASSIGNLEADSTOMEMBERS = `${this.url_prod}/leadTransfer`;
  GETMEMBERSDROPPROJECT = `${this.url_prod}/getMultipleTeamWiseDropDownProject`;
  GETTEAMDROPPROJECT = `${this.url_prod}/getTeamDropDownProject`;
  GETALLSTAGE = `${this.url_prod}/getLeadStatus`;
  GETALLSOURSE = `${this.url_prod}/getLeadSource`;
  GETREMINDER = `${this.url_prod}/getLeadReminder/`;
  GETREMINDERALL = `${this.url_prod}/getLeadReminder`;
  GETREMARK = `${this.url_prod}/getLeadRemark/`;
  GETALLSALESHEAD = `${this.url_prod}/getAllSalesHead`;
  GETALLMANAGERBYTEAMWISE = `${this.url_prod}/getAllManagerByTeamWise/`;
  GETALLMANAGERBYROLE = `${this.url_prod}/getReportingManagerByRoleWise`;

  GETTEAMWISEMEMBER = `${this.url_prod}/getTeamWiseMember/`;
  GETTEAMUSERWISE =  `${this.url_prod}/getTeamUserWise/`;

   GETSTAGEDATA =`${this.url_prod}/getLeadStage`



  //add Loan
  ADDLOAN = `${this.url_prod}/addUserLoan`;
  UPDATELOAN = `${this.url_prod}/updateUserLoan`;
  GETLOANBYUSERID = `${this.url_prod}/findUserLoanList/`;
  GETLOANBYID = `${this.url_prod}/findUserLoanDeclaration/`;
  GETLOAN = `${this.url_prod}/findUserLoanDeclaration`;

  //Lead Form
  LEADFORMLIST = `/leadform`;
  ADDFORM = `${this.url_prod}/addForm`;
  
  //All leads
  // LEADDATA = `/getLeadList`;
  // GETSALESREPORT = `${this.url_prod}/addLead`
  ALLLEADFORMLIST = `/all-leads`;
  ADDLEAD = `${this.url_prod}/addLead`;
  GETSALESREPORT = `${this.url_prod}/getSalesReport`;
  GETSOURCESREPORT = `${this.url_prod}/getSourceReport`;
  GETVISITSREPORT = `${this.url_prod}/getVisitReport`;
  GETPROJECTREPORT = `${this.url_prod}/getProjectReport`;
  GETCLOSUREREPORT = `${this.url_prod}/getClosureReport`;
  GETPRESALESREPORT = `${this.url_prod}/getPreSalesReport`;


  // Banner
  ADDBANNER = `${this.url_prod}/getBanner`
}
let urls = new UrlConstants();
export default urls;
