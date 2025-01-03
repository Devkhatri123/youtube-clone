import React, { useContext, useEffect, useState } from 'react'
import { HomeContext } from '../Context/HomePageContext';
import { auth, firestore } from '../firebase/firebase';
import "../CSS/HomePage.css"
import { useParams } from 'react-router';
import { videoContext } from '../Context/VideoContext';
function HomeHeader(props) {
  const params = useParams();
  const [LoggedInUser,SetLoggedInUser] = useState(null);
  const homeContext = useContext(HomeContext);
   const VideoContext = useContext(videoContext);
   useEffect(()=>{
    const GetLoggeInUser = async () => {
      try{
    auth.onAuthStateChanged((currentuser)=>{
     SetLoggedInUser(currentuser);
    })
  }catch(Error){
    console.log(Error);
  }
  }
  GetLoggeInUser();
   },[])
   useEffect(()=>{
    const GetSubscribedDoc = async () => {
      try{
        VideoContext.CheckSubscribedOrNot(LoggedInUser,homeContext?.user);
    }catch(error){
      console.log(error)
    }
  }
    GetSubscribedDoc();
  },[LoggedInUser,params.id,homeContext?.user]);
  const unSubscribe = () => {
    VideoContext.subscribeChannel(LoggedInUser,homeContext?.user);
  }
  return (
    <>
    <div id="header">
         <img src={homeContext.user?.channelPic} alt="" />
         <div id="header-top">
         <h1>{homeContext.user?.name}</h1>
         {VideoContext.isSubscribed ? <button style={{color:"white",background:"#272727"}} onClick={unSubscribe}>Subscribed</button>:<button style={{color:"black",background:"white"}} onClick={unSubscribe}>Subscribe</button>}
         </div>
         </div>
    </>
  )
}

export default HomeHeader
