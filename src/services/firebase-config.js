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
};

// Initialize Firebase
<<<<<<< HEAD:src/firebase-config.js
export const app = initializeApp(firebaseConfig);
=======
export const firebaseApp = initializeApp(firebaseConfig);
>>>>>>> 1cae993dce956785ea6dc33f94cc5b8d9234f8ae:src/services/firebase-config.js
