import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { getAllStage } from '../../Components/Screens/LeadInfoScreenService';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface StatusPopProps {
  visible: boolean;
  onClose: () => void;
  onStatusSelect: (status: string) => void;
}

const StatusPop: React.FC<StatusPopProps> = ({ visible, onClose ,onStatusSelect}) => {
    const scale = useSharedValue(visible ? 1 : 0.8);
    const opacity = useSharedValue(visible ? 1 : 0);

    const [dropdownData, setDropdownData] = useState<any>([]);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    
    useEffect(() => {
      scale.value = withSpring(visible ? 1 : 0.8, {
        damping: 20,
        stiffness: 150,
      });
      opacity.value = withSpring(visible ? 1 : 0, {
        damping: 20,
        stiffness: 150,
      });
      getLeadStage();
    }, [visible]);
    
    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
      };
    });

    const getLeadStage = async () => {
        try {
          const res = await getAllStage();
          setDropdownData(res.data);
        } catch (error) {
          console.error(error);
        }
    };

    const handleDropdownItemPress = (statusName: string) => {
        onStatusSelect(statusName); // Call the callback function with selected status
        onClose(); // Close the modal
    };

    return (
      <>
        {visible && (
          <TouchableOpacity style={styles.overlay} onPress={onClose}>
            <BlurView style={styles.blurView} intensity={200}>
              <Animated.View style={[styles.modal, animatedStyle]}>
                <ScrollView contentContainerStyle={styles.dropdownMenu}>
                  {dropdownData.map((item) => (
                    <TouchableOpacity
                      key={item._id}
                      onPress={() => handleDropdownItemPress(item.status_name)}
                    >
                      <Text style={styles.dropdownItem}>{item.status_name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </Animated.View>
            </BlurView>
          </TouchableOpacity>
        )}
      </>
    );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  blurView: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    width: 300,
    maxHeight: 500, 
    // justifyContent: 'center',
    // alignItems: 'center',
    elevation: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  dropdownMenu: {
    width: '100%',
  },
  dropdownItem: {
    fontSize: 16,
    paddingVertical: 10,
    color: "black",
  },
});

export default StatusPop;