import { getApp, getApps, initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage"

let firebaseApp;

export const getFirebaseApp = () => {
    if (firebaseApp) {
        return firebaseApp
    }
    const firebaseConfig = {
        apiKey: "AIzaSyDf_dvuE1GUpVHzQa33iLH_LUSKpE6ltG0",
        authDomain: "aora-428322.firebaseapp.com",
        projectId: "aora-428322",
        storageBucket: "aora-428322.appspot.com",
        messagingSenderId: "126322592094",
        appId: "1:126322592094:web:ba4c91940d5af1c8efe7cf",
        measurementId: "G-4H7WYN401L"
      };
      
      // Initialize Firebase
      const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

      initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage)
      })

      firebaseApp = app;

      return app;
}




// IOS: 126322592094-lb6007bkqjma45ivoa44ts85gf1h8k6q.apps.googleusercontent.com
// Android: 126322592094-6ulbqa6oaecn489qfuj7cbjcg9c25bph.apps.googleusercontent.com