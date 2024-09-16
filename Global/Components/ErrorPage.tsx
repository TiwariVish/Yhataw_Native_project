import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

function ErrorPage() {
  const handleRetry = () => {
    // Add your retry logic here
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={require("../../assets/Logo.png")}
          style={styles.headerImage}
        />
      </View>
      <View style={styles.imageContainer}>
        <Image
          source={require("../../assets/Big_Shoes_Walking_Dog.png")}
          style={styles.image2}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Oops</Text>
        <Text style={styles.title}>No Internet!</Text>
        <Text style={styles.message}>Please check your network connection.</Text>
      </View>
      <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20, 
    backgroundColor:'white'
  },
  headerContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  headerImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  imageContainer: {
    alignItems: 'center', 
    marginBottom: 20, 
  },
  image2: {
    width: 300,
    height: 300,
  },
  textContainer: {
    alignItems: 'flex-start', 
    marginTop: 20, 
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  message: {
    fontSize: 16,
    textAlign: 'left', 
    marginBottom: 20,
  },
  retryButton: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: 'blue',
    paddingVertical: 12,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ErrorPage;
