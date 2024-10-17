import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity,Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Avatar } from 'react-native-paper';
import { getPerosnalDetails } from '../../Components/Screens/MyProfileService';
import store from '../../utils/store';
import BottomSheetModal from '../../Global/PopAndModels/BottomSheetModal';




const FotterDseine = ({ navigate , onHomePress  }) => {

  const [userData, setUserData] = useState<any>(null);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await getPerosnalDetails(store.getState().auth?.userId);
      setUserData(response.data);
    } catch (error: any) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleIconPress = (iconName) => {
    if (iconName === "home") {
      onHomePress();  
    }
    setSelectedIcon(iconName);
    if (iconName === "user") {
      navigate("UserProfile");
    }
    if (iconName === "pluscircle") {
      setIsVisible(true); 
    }
  };

  return (
    <>
    <View style={styles.footerContainer}>
      <View style={styles.triangle} />

      <TouchableOpacity style={styles.leftIcon}   onPress={() => handleIconPress("home")}>
      <Image
            source={require("../../assets/home_icon.png")}
            style={styles.icon}
          />
      </TouchableOpacity>

      <TouchableOpacity style={styles.fab}   onPress={() => handleIconPress("pluscircle")}>
        <MaterialIcons name="add" size={24} color="white" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.rightIcon}   onPress={() => handleIconPress("user")}>
      <Avatar.Icon 
        size={35} 
        icon="account" 
        color="white"
        style={{ backgroundColor: '#3D48E5' }} 
      />
      </TouchableOpacity>
    </View>
     <BottomSheetModal
     visible={isVisible}
     onClose={() => setIsVisible(false)}
   />
   </>
  );
};

export default FotterDseine;

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: '#FFFFFF',
    height: '10%',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  triangle: {
    position: 'absolute',
    top: 0, 
    width: 0,
    height: 0,
    borderLeftWidth: 200,
    borderRightWidth: 200,
    borderTopWidth: 50, 
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#F4F9FD', 
  },
  fab: {
    backgroundColor: 'blue',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, 
    position: 'absolute',
    bottom: 25, 
    left: '50%', 
    marginLeft: -28, 
  },
  leftIcon: {
    position: 'absolute',
    left: 20, 
    bottom: 25, 
  },
  rightIcon: {
    position: 'absolute',
    right: 20,
    bottom: 25, 
  },
  icon: {
    width: 30,
    height: 30,
    borderRadius: 20,
  },
});
