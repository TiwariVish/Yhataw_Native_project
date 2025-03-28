import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import { onMessage } from "firebase/messaging";
import { getFirestore } from "firebase/firestore";

import { useEffect } from "react";
import store from "../../utils/store";
import { addNotificationToken } from "./PushNotificationService";


const firebaseConfig = {
  apiKey: "AIzaSyBK-gITHyQRUAvdaLvGkkvrM7Z3MKig-PE",
  authDomain: "pulse-b45a0.firebaseapp.com",
  projectId: "pulse-b45a0",
  storageBucket: "pulse-b45a0.firebasestorage.app",
  messagingSenderId: "921456583167",
  appId: "1:921456583167:web:2f11e3d699c177b072c7ca",
  measurementId: "G-MBBKXQ65DZ"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
export const db = getFirestore(app);
console.log(db,"database")

export const generateToken = async () => {
  if(store.getState().auth.userId){
    const permission = await Notification.requestPermission();
  
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: "BH31ZiyuxzPG6DbL9H6idkj9h8h8I974z--vZiC5VyYoFYOVApNVR8rYtEN8T4FPf6Fw5Q4MJH0bQ6RIJR7WkvI",
      });
      console.log("Token:", token);
      const payload = {
        userId: store.getState().auth.userId,
        token: token
      }
      console.log(payload, "payloadddddddddddddd");
      
      const notificationKey = `notificationTokenSaved_${payload.userId}`;
      
        const response = await addNotificationToken(payload);
        console.log(response?.success === 1, "sdbsjdbksjdfsd");
      
    
      
      return token;
    } else {
      console.warn("Notification permission denied");
      return null;
    }

  }
  };
  
  
