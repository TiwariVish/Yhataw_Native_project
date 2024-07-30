import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    // gap: 10,
  },
  header: {
    // alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    // width: width * 0.4, // Adjust the size of the logo
    // height: height * 0.1,
    marginBottom: 15,
  },
  textContainer: {
    // alignItems: 'center',
  },
  inputContainer: {
    // marginVertical: 10,
  },
  inlineInput: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#DFE1E8",
    paddingBottom: 5,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 10,
  },
  labelStyle: {
    height: 48,
    width:"100%",
    borderRadius: 8,
    backgroundColor: "#3D48E5",
    color: "white",
    fontWeight: "bold",
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  errorText: {
    marginVertical: 10,
    color: "red",
    textAlign: 'center',
  },
  viewCont: {
    marginBottom: 20,
  },
  viewcustomButton: {
    marginTop: 20,
  },
  button: {
    // width: "100%",
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
  },
  inputAdornment: {
    position: "absolute",
    left: 22,
    top: 0,
    bottom: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  startText: {
    fontSize: 16,
    color: "#000",
  },
});

export default styles;
