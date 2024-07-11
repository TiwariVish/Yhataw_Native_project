import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      margin: 15,
      justifyContent: "space-between",
    },
    borderButton: {
      bottom: 10,
      width: 100, 
      borderWidth: 3,
      borderColor: "blue",
      borderRadius: 25,
      zIndex: -1, 
    },
  });

  export default styles;