import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export const doSignInWithEmailAndPassword = async (email) => {
  try {
    // Sanitize email for document ID
    const sanitizedEmail = email.replace(/[.@]/g, '_');
    
    // Create a user in Firebase Authentication
    let userCredential;
    try {
      userCredential = await createUserWithEmailAndPassword(auth, email, "defaultPassword123");
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        userCredential = await signInWithEmailAndPassword(auth, email, "defaultPassword123");
      } else {
        throw error;
      }
    }

    // Create a document with user data in Firestore
    const userRef = doc(db, 'users', sanitizedEmail);
    const userData = {
      email: email,
      lastLogin: new Date().toISOString(),
      verified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Use merge: true to not overwrite existing data
    await setDoc(userRef, userData, { merge: true });
    console.log("User data stored in Firestore:", userData);
    
    return { user: userData };
  } catch (error) {
    console.error("Error signing in:", error);
    throw new Error("Login failed - please try again");
  }
};

export const sendOtp = async (email) => {
  try {
    const response = await fetch('http://localhost:5000/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    const data = await response.json();
    if (response.ok) {
      return data.otp;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};