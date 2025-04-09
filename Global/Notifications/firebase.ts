

import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { getMessaging, getToken } from "firebase/messaging";
import { getApps, initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBK-gITHyQRUAvdaLvGkkvrM7Z3MKig-PE",
  authDomain: "pulse-b45a0.firebaseapp.com",
  projectId: "pulse-b45a0",
  storageBucket: "pulse-b45a0.firebasestorage.app",
  messagingSenderId: "921456583167",
  appId: "1:921456583167:web:2f11e3d699c177b072c7ca",
  measurementId: "G-MBBKXQ65DZ"
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}



export const generateToken = async () => {
  // Request permissions for notifications
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    console.warn("Permission not granted for notifications");
    return;
  }

  if (Platform.OS === "android") {
    try {
      const messaging = getMessaging();
      const fcmToken = await getToken(messaging, {
        vapidKey: "BH31ZiyuxzPG6DbL9H6idkj9h8h8I974z--vZiC5VyYoFYOVApNVR8rYtEN8T4FPf6Fw5Q4MJH0bQ6RIJR7WkvI", // Only required for Web
      });

      console.log("FCM Token:::::::::::::::::", fcmToken);
      return fcmToken;
    } catch (error) {
      console.error("Error getting FCM token:", error);
    }
  } else {
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Expo Push Token:", token);
    return token;
  }
};
