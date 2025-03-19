// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA92TArsYotY1VRZ-zLaJhHeinhZ-h5260",
  authDomain: "feedback-ui-da9bf.firebaseapp.com",
  projectId: "feedback-ui-da9bf",
  storageBucket: "feedback-ui-da9bf.appspot.com",
  messagingSenderId: "958859651814",
  appId: "1:958859651814:web:8a8686a0387d41767ae927",
  measurementId: "G-5HLPFTSZSY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

// Initialize analytics only in the browser
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, auth, analytics, db };
