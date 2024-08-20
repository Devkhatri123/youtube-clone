import React, { useEffect, useState } from "react";
import { IoMdMenu } from "react-icons/io";
import youtubeImage from "../Pics/youtube.png";
import { CiSearch } from "react-icons/ci";
import { FaRegUserCircle } from "react-icons/fa";
import "../CSS/Navbar.css";
import SearchBar from "./SearchBar";
import { auth,firestore } from "../firebase/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc,setDoc } from "firebase/firestore";
import { useNavigate } from "react-router";
function Navbar() {
  const navigate = useNavigate();
  let [IsSearchBarVisible, setIsSearchBarVisible] = useState(true);
  let [user,Setuser] = useState(null);
  const HandleSeachToggle = () => {
    setIsSearchBarVisible(false);
    console.log("clicked");
  };
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
        channelPic:res.user.photoURL,  
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
  useEffect(()=>{
    auth.onAuthStateChanged(async(user)=>{
    Setuser(user);       
    })
 },[]);

  return (
    <>
      {IsSearchBarVisible === false ? (
        <SearchBar />
      ) : (
        <>
          <div className="header">
            <div className="left_side">
              <IoMdMenu id="menu" />
              <img src={youtubeImage} alt="logo" id="logo" onClick={()=>navigate("/")}/>
            </div>
            <div className="center"></div>
            <div className="right_side">
              <CiSearch id="search_logo" onClick={HandleSeachToggle} />
              {auth.currentUser ? (
                <img src={user?.photoURL} alt="profileImg" onClick={()=>auth.signOut()}/>
              ) : (
                <FaRegUserCircle
                  className="FaRegUserCircle"
                  onClick={SignUpWithGoogle}
                />
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Navbar;
