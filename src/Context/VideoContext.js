import React,{createContext, useContext, useState} from "react";
import { collection,doc,setDoc,updateDoc,getDoc, getDocs } from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import { ToastContainer,toast } from "react-toastify";
export const videoContext = createContext();

 const VideoActionProvider = ({children}) => {
    const [showModal,setshowModal] = useState(false);
    const [bottomlayout,setbottomlayout] = useState(false);
    const [showToastNotification,setshowToastNotification] = useState(false);
    const [NotificationMessage,setNotificationMessage] = useState('');
    const [Description,setDescription] = useState(false);
    const [shortvideoShowMessages,setshortvideoShowMessages] = useState(false);


    const LikeVideo = async(user,videoId,video) => {
       const docRef = doc(collection(firestore,`users/${user.uid}/LV`),videoId);
        const videoDocRef = doc(firestore,"videos",videoId);
        const getLikedDoc = await getDoc(docRef);
        if(!getLikedDoc.exists()){
        const data = {videoURL:videoId}
        await setDoc(docRef,data);
        await updateDoc(videoDocRef,{
          likes:video.likes + 1,
         })
         console.log("video has been liked")
         return true
        }else{
          console.log("Video is Already liked")
        }
    }
    const WatchLater = async(LoggedInUser,videoId) => {
       if(LoggedInUser){
        const watchlaterDocRef = doc(collection(firestore,`users/${LoggedInUser?.uid}/WL`),videoId);
        const watchlaterDoc = await getDoc(watchlaterDocRef);
        if(!watchlaterDoc.exists()){
          await setDoc(watchlaterDocRef,{videoURL:videoId});
       }
      setNotificationMessage("Saved to Watchlater");
      }else{
        setNotificationMessage("You are not LoggedIn");
      }
      document.body.style.opacity = "1";
      setshowToastNotification(true);
 }
 const getVideoPublishedTime = (FullLengthVideo) => {
  if(FullLengthVideo.Videodata.Time){
     let seconds = Math.floor((Date.now() - FullLengthVideo.Videodata.Time)/1000);
      let value = seconds;
      if(seconds >= 31536000){
        value = Math.floor(seconds/31536000);
        if(value > 1) return value + "  " +"years ago";
        else return value+ "  " + "year ago";
      }else if (seconds >= 2419200){
        value = Math.floor(seconds/2419200);
        if(value > 1) return value+ "  " +"months ago";
        else return value + "  " + "month ago";
      }else if(seconds >= 604800){
        value = Math.floor(seconds/604800);
        if(value > 1) return value + "  " + "weeks ago";
        else return value + "  " + "week ago";
      }else if(seconds >=86400){
        value = Math.floor(seconds/86400);
        if(value > 1)return value+ "  " +"days ago";
        else return value + "  " + "day ago";
      }else if(seconds>=3600){
        value = Math.floor(seconds/3600);
        if(value > 1)return value + "  " + "hours ago";
        else return value + "  " + "hour ago";
      }else if(seconds >= 60){
        value = Math.floor(seconds/60);
        if(value > 1)return value + "  " + "minutes ago";
        else return value + "  " + "minute ago";
      }else{
        value = Math.floor(seconds);
        if(value > 1)return value+ "  " +"seconds ago";
        else return "now";
      }
    }
}
    return <videoContext.Provider value={{showModal,showToastNotification,shortvideoShowMessages,NotificationMessage,Description,bottomlayout,setDescription,setshortvideoShowMessages,setbottomlayout,setshowModal,setNotificationMessage,setshowToastNotification,LikeVideo,WatchLater,getVideoPublishedTime}}>{children}</videoContext.Provider>
}
export default VideoActionProvider
