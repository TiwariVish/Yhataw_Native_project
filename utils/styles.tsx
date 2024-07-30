import { createTheme } from "@mui/material/styles";

const primaryWhiteColor = "#FFF";
const primaryBlueColor = "#3D48E5";
const PrimaryLightTextColor = "#888993";
const PrimaryTextColor = "#3D3E58";
const primaryRedColor = "#E92B2B";
const borderColor = "rgba(0, 0, 0, 0.12)";
const borderStyle = "1px solid " + borderColor;
const primaryLightGray = "#6D6E82";
const primaryLightGreen = "#CEE5CB";
const primaryGrayBg = "#F5F7F9";
const defaultFontSize = 14;
const defaultBoxShadow = "0 0 0 0.2rem rgb(0 123 255 / 25%)";
const drawerWidth = 78;
const subMenuWidth = 250;
const borderRadius = "30px";
const primarySteperColor = "#646DEA";
const primarygreenColor = "#18CB8A";

const mainContainer = {
  margin: "30px",
};

const lightFont = {
  fontFamily: "Inter_Light",
  fontWeight: 900,
  fontStyle: "normal",
};

const boldFont = {
  fontFamily: "Inter_Bold",
  fontWeight: 700,
};

const mediumFont = {
  fontFamily: "Inter_Medium",
  fontWeight: 500,
};

const regularFont = {
  fontFamily: "Inter_Regular",
  fontWeight: 400,
};

const normalFont = {
  fontFamily: "Inter_Noraml",
  fontWeight: 400,
};

const thinFont = {
  fontFamily: "Inter_Thin",
  fontWeight: 400,
};

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1920,
    },
  },
  typography: {
    fontSize: 16, // Define the appropriate font size for your application
  
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      " Inter_Light",
      "Inter_Bold",
      "Inter_Medium",
      "Inter_Regular",
      "sans-serif",
      "Digital-7 Mono",
    ].join(","),
  },
});

const getRelativeFontSize = (value: number = 0) => {
  let size = defaultFontSize + value;
  return size + "px";
};

//  define global headings
const heading = {
  fontSize: getRelativeFontSize(10),
  ...boldFont,
  lineHeight: "29px",
};

const subHeading = {
  color: PrimaryTextColor,
  fontSize: getRelativeFontSize(-2),
  ...regularFont,
  letterSpacing: "-0.01em",
};

const customButtonStyle = {
  borderRadius: borderRadius,
  border: "none",
  fontSize: getRelativeFontSize(),
  textAlign: "center",
  backgroundColor: primaryWhiteColor,
  padding: "10px 15px",
  boxShadow: "none",
  color: "white",
  cursor: "pointer",
  textTransform: "none",
};

const customTextFieldStyle = {
  borderRadius: borderRadius,
  position: "relative",
  border: "none",
  fontSize: getRelativeFontSize(2),
  backgroundColor: "red",
  padding: "10px 15px",
  boxShadow: "none",
  width: "100%",
};

const headingText = {
  display: "inline-block",
  fontSize: getRelativeFontSize(8),
};

const centerItemFlex = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const centerItemAbsolute = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
};

export {
  borderRadius,
  borderColor,
  borderStyle,
  defaultBoxShadow,
  customButtonStyle,
  customTextFieldStyle,
  headingText,
  centerItemFlex,
  centerItemAbsolute,
  regularFont,
  boldFont,
  mediumFont,
  lightFont,
  normalFont,
  thinFont,
  getRelativeFontSize,
  theme,
  mainContainer,
  primaryBlueColor,
  primaryWhiteColor,
  PrimaryTextColor,
  primaryRedColor,
  PrimaryLightTextColor,
  primaryLightGray,
  drawerWidth,
  primaryLightGreen,
  primaryGrayBg,
  subMenuWidth,
  primarySteperColor,
  heading,
  subHeading,
  primarygreenColor,
};
