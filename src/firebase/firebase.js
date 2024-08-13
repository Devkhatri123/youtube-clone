// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChcfbuG7nsMxAj4w0qyhO-IVYMj_voE_s",
  authDomain: "reactapp-9cd63.firebaseapp.com",
  projectId: "reactapp-9cd63",
  storageBucket: "reactapp-9cd63.appspot.com",
  messagingSenderId: "551881012127",
  appId: "1:551881012127:web:fec7dbfe3a2d5a1d56c3aa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);