import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableWithoutFeedback, Modal } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import { getPerosnalDetails } from './MyProfileService';
import { logOutAction, selectRole } from '../../Redux/authSlice';
import store from '../../utils/store';
import CustomButton from '../../Global/Components/CustomButton';
import { globalStyles } from '../../GlobalCss/GlobalStyles';

const ProfileScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const dispatch = useDispatch();
  const roleFromRedux = useSelector(selectRole);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await getPerosnalDetails(store.getState().auth?.userId);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    setModalVisible(true);
  };

  const logout = () => {
    dispatch(logOutAction());
    navigation.navigate("Login");
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const renderInfoRow = useCallback((label, value) => (
    <View style={styles.infoRow}>
      <Text style={[styles.label, globalStyles.fontfm, globalStyles.h6]} allowFontScaling={false}>{label}</Text>
      <Text style={[styles.value, globalStyles.fs3, globalStyles.h5]} allowFontScaling={false}>{value}</Text>
    </View>
  ), []);

  const { profile_image, name, employee_id, email, dob, city, state_name, country_name } = userData || {};

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.profileContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: profile_image }} 
              style={styles.profileImage}
            />
          </View>
          <FontAwesome name="edit" size={24} color="black" style={styles.editIcon} />
          <Text style={[styles.name, globalStyles.fontfm, globalStyles.h4]} allowFontScaling={false}>
            {name || 'N/A'}
          </Text>
          <Text style={styles.jobTitle}>{roleFromRedux || 'N/A'}</Text>
        </View>

        <View style={styles.infoCard}>
          {renderInfoRow('Employee ID', employee_id || 'N/A')}
          {renderInfoRow('Email ID', email || 'N/A')}
          {renderInfoRow('Date of Birth', dob || 'N/A')}
          {renderInfoRow('City', city || 'N/A')}
          {renderInfoRow('State', state_name || 'N/A')}
          {renderInfoRow('Country', country_name || 'N/A')}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <CustomButton
          label="Logout"
          buttonType="iconBtn"
          labelStyle={styles.logoutButtonText}
          onClick={handleLogout}
          customStyles={styles.logoutButton}
        />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Image source={require("../../assets/quesMark_icon.png")} style={styles.modalImage} />
              <Text style={[globalStyles.h6, globalStyles.fs1, globalStyles.fontfm]} allowFontScaling={false}>
                Are You Sure you want to logout?
              </Text>
              <View style={styles.modalButtonContainer}>
                <CustomButton
                  label="Logout"
                  buttonType="iconBtn"
                  onClick={logout}
                  customStyles={styles.buttonAdj}
                  labelStyle={styles.logoutButtonText}
                />
                <CustomButton
                  label="Cancel"
                  buttonType="primaryBtn"
                  onClick={closeModal}
                  customStyles={styles.buttonCancel}
                />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  profileContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#C5C8F7',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', 
  },
  profileImage: {
    width: '90%',  
    height: '90%', 
    borderRadius: 50,
  },
  editIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  name: {
    marginTop: 10,
  },
  jobTitle: {
    fontSize: 16,
    color: '#7B8D9E',
  },
  infoCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 10,
    borderRadius: 12,
    shadowColor: 'transparent',
  },
  infoRow: {
    paddingVertical: 13,
    borderBottomWidth: 2,
    borderBottomColor: '#F0F0F0',
  },
  label: {
    fontSize: 14,
    color: '#7B8D9E',
  },
  value: {
    marginTop: 10
  },
  buttonContainer: {
    backgroundColor: '#F4F9FD',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  logoutButton: {
    borderWidth: 2,
    borderColor: 'red',
    borderRadius: 5,
    padding: 10,
  },
  logoutButtonText: {
    color: 'red',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalImage: {
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 10,
  },
  buttonAdj: {
    borderWidth: 2,
    borderColor: 'red',
    borderRadius: 5,
    padding: 10,
    height: 45,
    width: 110,
  },
  buttonCancel: {
    borderRadius: 5,
    padding: 10,
    height: 45,
    width: 110,
  },
});

export default ProfileScreen;
