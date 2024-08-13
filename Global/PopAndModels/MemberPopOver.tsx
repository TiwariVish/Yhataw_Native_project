import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { getAllStage, getTeamList } from '../../Components/Screens/LeadInfoScreenService';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface MemberPopOverProps {
  visible: boolean;
  onClose: () => void;
  onStatusSelect: (status: string) => void;
}

interface DropdownItem {
  id: string;
  team_name: string;
  checked: boolean;
}

const MemberPopOver: React.FC<MemberPopOverProps> = ({ visible, onClose, onStatusSelect }) => {
  const [memberdropdownItems, setmMemberDropdownItems] = useState<DropdownItem[]>([]);
  const [leadOptionMember, setleadOptionMember] = useState([
    { id: 1, name: "vishal", checked: true },
    {id: 2, name: "vishal" , checked: true},
    {id: 3, name: "vishal", checked: true },
    {id: 4, name: "vishal", checked: true },
    { id:5,name: "vishal" , checked: true},
  ]);

  const scale = useSharedValue(visible ? 1 : 0.8);
  const opacity = useSharedValue(visible ? 1 : 0);

  useEffect(() => {
    scale.value = withSpring(visible ? 1 : 0.8, {
      damping: 20,
      stiffness: 150,
    });
    opacity.value = withSpring(visible ? 1 : 0, {
      damping: 20,
      stiffness: 150,
    });
    getMemberLeadStage()
  }, [visible]);


  const getMemberLeadStage = async () => {
    try {
      const res = await getTeamList();
      setmMemberDropdownItems(res.data);
    } catch (error) {
      console.error(error);
    }
};

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const handleCheckboxChange = (id: string) => {
    const updatedItems = memberdropdownItems.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setmMemberDropdownItems(updatedItems);
  };

  return (
    <>
      {visible && (
        <TouchableOpacity style={styles.overlay} onPress={onClose}>
          <BlurView style={styles.blurView} intensity={200}>
            <Animated.View style={[styles.modal, animatedStyle]}>
              <ScrollView contentContainerStyle={styles.dropdownMenu}>
                {memberdropdownItems.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.checkboxItem}
                    onPress={() => handleCheckboxChange(item.id)}
                  >
                    <View style={styles.checkboxContainer}>
                      <View
                        style={[
                          styles.checkbox,
                          item.checked && styles.checkboxChecked,
                        ]}
                      />
                      <Text style={styles.checkboxText}>{item.team_name}</Text>
                    </View>
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
    elevation: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  dropdownMenu: {
    width: '100%',
  },
  checkboxItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#000',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#000',
  },
  checkboxText: {
    fontSize: 16,
    color: 'black',
  },
});

export default MemberPopOver;
