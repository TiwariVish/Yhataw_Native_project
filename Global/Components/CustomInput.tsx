import React from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";

interface InputRangeTypes {
  minLength: number;
  maxLength: number;
}

interface CustomProps {
  label?: string;
  placeHolder?: string;
  value?: any;
  onChange
  type?: string;
  name?: string;
  select?: boolean;
  onKeyPress?: (event: any) => void;
  InputProps?: any;
  error?: string | boolean;
  required?: boolean;
  InputLabelProps?: any;
  id?: string;
  secureTextEntry?: any;
  style?: any;
  disabled?: boolean;
  propsToInputElement?: InputRangeTypes;
  onClick?: () => void;
  helperText?: string;
  maxLength?: number;
  isLabel?: boolean;
  accept?: any;
  ref?: any;
  maxDate?: any;
  fileUrl?: any;
}

const CustomInput = (props: CustomProps) => {
  const {
    label,
    placeHolder,
    value="",
    onChange,
    secureTextEntry,
    type,
    name,
    error,
    required,
    style,
    disabled,
    maxLength,
    isLabel = true,
    onClick,
    helperText,
  } = props;

  return (
    <View style={styles.container}>
      {isLabel && (
        <View style={styles.labelContainer}>
          {required && <Text style={styles.requiredAsterisk}>*</Text>}
          <Text style={styles.label}>{label}</Text>
        </View>
      )}
      <TextInput
        style={[styles.textInput, style, error ? styles.errorBorder : null]}
        placeholder={placeHolder}
        // value={value||""}
        value={value}
        onChange={onChange}
        secureTextEntry={type === "password" && secureTextEntry}
        editable={!disabled}
        maxLength={maxLength}
        onPressIn={onClick}
        keyboardType={type === "number" ? "numeric" : "default"}
     
      />
      {error && <Text style={styles.errorText}>{helperText || error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  requiredAsterisk: {
    color: "red",
    marginRight: 2,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
  },
  errorBorder: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginTop: 5,
  },
});

export default CustomInput;
