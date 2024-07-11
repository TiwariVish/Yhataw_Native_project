
import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  textContainer: {
    width: "100%",
    alignItems: "flex-start",
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 5,
  },
  containerImg:{
  
      flex: 1,
      justifyContent: "center",
      alignItems: "center",

  },
  image: {
    marginRight:350,
    marginBottom:10,
    width: 30, // Set the desired width
    height: 30, // Set the desired height
  },
  crmTitle: {
    marginBottom: 18,
  },
  footerText: {
    marginTop: 20,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
  },
  input: {
    width: "100%",
    marginBottom: 10,
    borderWidth: 0, 
    borderBottomWidth: 1, 
    borderBottomColor: '#000', 
  },
  labelStyle: {
    color: "white",
    fontWeight: "bold",
  },
  errorText: {
    marginBottom: 10,
    color: "red",
  },
  passwordInput: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    // marginBottom: 5,
    borderWidth: 0, 
    borderBottomWidth: 1, 
    borderBottomColor: '#000', 
  },
  viewCont: {
    bottom: 35,
  },
  viewcustomButton: {
    bottom: 5,
  },
  eyeIcon: {
    position: "absolute",
    top: 40,
    right: 10,
    padding: 5,
  },
});
  export default styles;