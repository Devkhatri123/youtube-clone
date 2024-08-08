// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBX6bDvmvkqSkpk09QMhWI5WroEjvzi-Rs",
  authDomain: "react-app-383a2.firebaseapp.com",
  projectId: "react-app-383a2",
  storageBucket: "react-app-383a2.appspot.com",
  messagingSenderId: "163064742778",
  appId: "1:163064742778:web:b5c5ef80ab95dd067bccc3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);