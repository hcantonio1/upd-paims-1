// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBMLDfZjN-c10riaKLsSbvn2UZZNkunEJk",
  authDomain: "react-firebase-v9-b1a6f.firebaseapp.com",
  projectId: "react-firebase-v9-b1a6f",
  storageBucket: "react-firebase-v9-b1a6f.appspot.com",
  messagingSenderId: "1089973929613",
  appId: "1:1089973929613:web:bd6cee73d6ed7db292c4c4",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);