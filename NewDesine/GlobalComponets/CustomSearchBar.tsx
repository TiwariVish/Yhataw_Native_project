import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import Feather from "react-native-vector-icons/Feather";

interface CustomSearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress?: () => void;
}

const CustomSearchBar: React.FC<CustomSearchBarProps> = ({
  placeholder = "Search by name, ID, Phone...",
  value,
  onChangeText,
  onFilterPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Feather name="search" size={20} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#888"
          value={value}
          onChangeText={onChangeText}
        />
        <Feather
          name="sliders"
          size={20}
          color="#000"
          style={styles.filterIcon}
          onPress={onFilterPress}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    // marginVertical: 10,
    // marginTop:10
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth :1,
    borderTopWidth:1,
    borderColor: "#ddd",
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    paddingVertical: 5,
  },
  filterIcon: {
    marginLeft: 8,
  },
});

export default CustomSearchBar;
