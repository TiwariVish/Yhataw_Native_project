import React from 'react';
import { View, Text, Image, StyleSheet, Alert } from 'react-native';
import CustomButton from '../../Global/Components/CustomButton';

const Profile = ({ navigation }) => {
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            // Call your logout function here
            // logout();

            // Clear any stored tokens or user data
            // AsyncStorage.clear();

            // Navigate to the login screen or any other appropriate screen
            navigation.navigate('LoginScreen'); // Adjust the route name as needed

            console.log('Logout Pressed');
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  const profileData = [
    { label: 'Employee ID', value: 'YHTD001' },
    { label: 'Email', value: 'arjunanda@yhatow.com' },
    { label: 'Date of Birth', value: '10 Oct 1996' },
    { label: 'City', value: 'Gurugram' },
    { label: 'State', value: 'Haryana' },
    { label: 'Country', value: 'India' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: 'https://example.com/profile-picture.jpg' }} // Replace with actual image URL
          style={styles.profileImage}
        />
        <Text style={styles.name}>Biswajit Mukherjee</Text>
        <Text style={styles.position}>Team Leader</Text>
      </View>
      {profileData.map((item, index) => (
        <View key={index} style={styles.infoContainer}>
          <Text style={styles.label}>{item.label}</Text>
          <Text style={styles.value}>{item.value}</Text>
        </View>
      ))}
      <CustomButton
        label="Logout"
        // buttonType={styles.logoutButton}
        labelStyle={styles.logoutButtonText}
        onClick={handleLogout}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  position: {
    fontSize: 16,
    color: 'gray',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  label: {
    fontSize: 16,
    color: 'gray',
  },
  value: {
    fontSize: 16,
    color: 'blue',
  },
  logoutButton: {
    marginTop: 30,
  },
  logoutButtonText: {
    color: 'red',
    fontSize: 16,
  },
});

export default Profile;
