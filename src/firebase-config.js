// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
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
  databaseURL: "https://react-firebase-v9-b1a6f-default-rtdb.asia-southeast1.firebasedatabase.app",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);