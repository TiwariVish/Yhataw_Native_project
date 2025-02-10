import React, { useEffect, useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Navigation from './Components/Navigation';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './utils/store';
import { useFonts, Inter_400Regular } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { Video } from 'expo-av'; // Import Video from expo-av

export default function App() {
  SplashScreen.preventAutoHideAsync();
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
  });

  const videoRef = useRef(null);

  useEffect(() => {
    // Hide the splash screen when assets are ready
    if (fontsLoaded) {
      setTimeout(async () => {
        setIsVideoPlaying(false); // Hide video after 4 seconds
        await SplashScreen.hideAsync(); // Hide the splash screen
      }, 6000); // 4 seconds delay
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <View style={styles.container}>
          {isVideoPlaying ? (
            <Video
              ref={videoRef}
              source={require('./assets/Pulse_Splash2.mp4')} 
              style={styles.video}
              resizeMode="cover"
              shouldPlay
              isLooping={true} 
              onPlaybackStatusUpdate={(status) => {
                if (status.didJustFinish) {
                  setIsVideoPlaying(true); 
                  SplashScreen.hideAsync(); 
                }
              }}
            />
          ) : (
           
            <View style={{ flex: 1 }}>
              <Navigation />
              <StatusBar style="auto" />
            </View>
          )}
        </View>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    fontFamily: 'Inter_400Regular',
  },
  video: {
    width: '100%',
    height: '100%', 
  },
});
