import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet } from 'react-native';
import NewDesineButton from '../../Global/Components/NewDesineButton';

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false); 

  const handleNewPassword = () => {
    console.log("Send new password clicked");
    setIsSent(true);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/pulse_Logo_big.png')} 
        style={styles.logo}
      />

      {isSent ? (
        <>
          <Image
            source={require('../../assets/on_way_password.png')} 
            style={styles.onImage}
          />
          <Text style={styles.headerText}>Your password is on its way</Text>
          <Text style={styles.description}>
            Please check your email with your new password to login with it.
          </Text>

          <NewDesineButton
            buttonColor="#3D48E5"
            style={styles.buttonContainer}
            label="Sign In"
            onPress={() => navigation.navigate('Login')} // Navigate to Login screen
          />
        </>
      ) : (
        // Original Forgot Password UI
        <>
          <Image
            source={require('../../assets/group_forget_password.png')} 
            style={styles.errorImage}
          />
          <Text style={styles.headerText}>Forgot your password?</Text>
          <Text style={styles.description}>
            That’s okay, it happens! Enter your email address, and we will send you a new password.
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <NewDesineButton
            buttonColor="#3D48E5"
            style={styles.buttonContainer}
            label="Send me a New Password"
            onPress={handleNewPassword}
          />

          <Text style={styles.footerText}>
            I have my login credentials.{' '}
            <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
              Login
            </Text>
          </Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 80,
    backgroundColor: '#FBFBFF',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  errorImage: {
    width: 98,
    height: 65,
    marginBottom: 30,
  },
  onImage:{
    width: 98,
    height: 85,
    marginBottom: 30,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  inputContainer: {
    width: '100%',
    position: 'relative',
  },
  input: {
    height: 50,
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingLeft: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginTop: 20,
    textAlign: 'center',
  },
  loginLink: {
    color: '#3F51B5',
    fontWeight: 'bold',
  },
});

export default ForgotPassword;
