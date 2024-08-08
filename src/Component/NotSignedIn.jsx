import React from 'react'
import { FaRegUserCircle } from "react-icons/fa";
import "../CSS/Library.css";
import NotSignedinImg from "../Pics/sign_in_promo.png";
function NotSignedIn() {
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
            <button className="promo_btn">Sign In</button>
        </div>
      </div>
    </div>
  )
}

export default NotSignedIn
