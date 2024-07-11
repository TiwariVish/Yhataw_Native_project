// import { useState } from "react";
// import { loginForm } from "./SignTypesAndValidation";
// import LoginScreen from "../../Components/Screens/LoginScreen";
// import strings from "../../Global/constants/StringConstants";
// import history from "../../utils/history";
// import urls from "../../Global/constants/UrlConstants";

// interface CustomProps {
//   location?: Location;
// }

// const LandingPage = (props: CustomProps) => {
//   const [formFields, setFormFields] = useState(loginForm);

//   const getComponentBasedOnURL = () => {
//     const location = props.location?.pathname?.split("/")[1].toLowerCase();
//     switch (location) {
//       case strings.LOGIN: {
//         return (
//           <LoginScreen formFields={formFields} setFormFields={setFormFields} />
//         );
//       }
//       default: {
//         history.push(urls.loginViewPath);
//       }
//     }
//   };
// };

// export default LandingPage;
