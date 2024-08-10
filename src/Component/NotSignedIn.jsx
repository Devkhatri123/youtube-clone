import React from 'react'
import { FaRegUserCircle } from "react-icons/fa";
import "../CSS/Library.css";
import NotSignedinImg from "../Pics/sign_in_promo.png";
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, firestore } from '../firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';
function NotSignedIn() {
  const SignUpWithGoogle = async() => {
    let Provider = new GoogleAuthProvider();
    await signInWithPopup(auth, Provider)
      .then(async(res) => {
       console.log(res);
      let docRef= doc(firestore,"users",res.user.uid);
       const data = { 
        uid: res.user.uid,
        name:res.user.displayName,
        email:res.user.email,
        channelURL:res.user.photoURL,  
        subscribers:0,   
        Time: new Date(),   
       }
       await setDoc(docRef,data)
       console.log("Document Created Successfully");
       
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className='notSignedIn'>
      <div className="top">
      <FaRegUserCircle/>
      <div>Sign In</div>
      </div>
      <div className="body">
        <img src={NotSignedinImg} alt="" />
        <div className="promo_content">
            <p className='promo_title'>You're not signed in</p>
            <p className="promo_subtitle">Sign in now to upload, save and comment on videos</p>
            <button className="promo_btn" onClick={SignUpWithGoogle}>Sign In</button>
        </div>
      </div>
    </div>
  )
}

export default NotSignedIn
