// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDcBfLZr0nx7aXWUThapTUp4vPHhwB8azA",
  authDomain: "newproject-34a9e.firebaseapp.com",
  projectId: "newproject-34a9e",
  storageBucket: "newproject-34a9e.appspot.com",
  messagingSenderId: "813090913972",
  appId: "1:813090913972:web:0991cb9e95e8b4ce18e1e1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);