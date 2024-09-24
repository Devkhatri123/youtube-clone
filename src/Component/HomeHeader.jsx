import React, { useContext, useEffect, useState } from 'react'
import { HomeContext } from '../Context/HomePageContext';
import { auth, firestore } from '../firebase/firebase';
import "../CSS/HomePage.css"
import { collection, doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router';
function HomeHeader(props) {
  const params = useParams();
  const [LoggedInUser,SetLoggedInUser] = useState(null);
  const [isSubscribed,setisSubscribed] = useState(false);
  const [btnLoading,setbtnLoading] = useState(true);
   const homeContext = useContext(HomeContext);
   useEffect(()=>{
   console.log(homeContext.user);
    
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
      setbtnLoading(true);
      try{
      if(LoggedInUser){
    const subscribedDocRef = doc(collection(firestore,`users/${LoggedInUser.uid}/subscribedChannel`),params.id);
    const subscribedDocData = await getDoc(subscribedDocRef);
    if(subscribedDocData.exists()){
      setisSubscribed(true);
    }
  }
    }catch(error){
      console.log(error)
    }finally{
      setbtnLoading(false);
    }
  }
    GetSubscribedDoc();
  },[LoggedInUser,params.id]);
  return (
    <>
    <div id="header">
         <img src={homeContext.user?.channelPic} alt="" />
         <div id="header-top">
         <h1>{homeContext.user?.name}</h1>
        {btnLoading ? <button disabled>Loading...</button>:<button style={isSubscribed ?{color:"white",background:"#272727"}:{color:"black",background:"white"}}>{isSubscribed ? "subscribed":"subscribe"}</button>} 
         </div>
         </div>
    </>
  )
}

export default HomeHeader
