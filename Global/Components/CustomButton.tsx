import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { IconButton } from "react-native-paper";

interface CustomProps {
  label: string;
  onClick: (event: any) => void;
  loading?: boolean;
  customStyles?: any;
  buttonType?: string;
  startIcon?: string; // Assuming startIcon and endIcon are icon names as strings
  endIcon?: string;
  disabled?: boolean;
  style?: object;
  labelStyle?: object; // Add this line
}

const CustomButton = (props: CustomProps) => {
  const getCustomStyle = () => {
    switch (props.buttonType) {
      case "primaryBtn":
        return styles.primaryBtn;
      case "secondaryBtn":
        return styles.secondaryBtn;
      case "iconBtn":
        return styles.iconBtn;
      default:
        return {};
    }
  };

  const buttonTypeStyle = getCustomStyle();
  const appliedStyle = {
    ...styles.btnStyle,
    ...buttonTypeStyle,
    ...(props.customStyles ?? {}),
    ...(props.disabled && {
      opacity: 0.8,
    }),
  };

  const processing = props.loading ? props.loading : false;

  return (
    <TouchableOpacity
      onPress={(event: any) => props.onClick(event)}
      disabled={props.loading || props?.disabled}
      style={[appliedStyle, props.disabled && styles.disabled]}
    >
      {props.startIcon && <IconButton icon={props.startIcon} />}
      {processing ? (
        <View style={styles.loading}>
          <ActivityIndicator size="small" color="#000000" />
        </View>
      ) : (
        <Text style={[styles.label, props.labelStyle]}>{props.label}</Text>
      )}
      {props.endIcon && <IconButton icon={props.endIcon} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btnStyle: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  primaryBtn: {
    backgroundColor: "#007bff",
  },
  secondaryBtn: {
    backgroundColor: "#6c757d",
  },
  iconBtn: {
    backgroundColor: "transparent",
  },
  loading: {
    marginLeft: 5,
  },
  disabled: {
    opacity: 0.8,
  },
  label: {
    fontSize: 16,
    color: "white", // Default color in case labelStyle is not provided
  },
});

export default CustomButton;
