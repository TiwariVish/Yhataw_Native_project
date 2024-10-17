import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

interface CustomProps {
  label: string;
  onPress: () => void;
  buttonColor?: string; // Optional prop for button background color
  textColor?: string; // Optional prop for text color
  style?: object; 
}

const NewDesineButton: React.FC<CustomProps> = ({
  label,
  onPress,
  buttonColor = '#4e7dff', 
  textColor = '#fff', 
  style
}) => {
  return (
    <View >
      <TouchableOpacity
        style={[styles.button, { backgroundColor: buttonColor } , style]} 
        onPress={onPress}
      >
        <Text style={[styles.buttonText, { color: textColor }]}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    minWidth: 92, 
    minHeight: 42, 
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NewDesineButton;
