import React,{createContext, useContext, useState} from "react";
import { collection,doc,setDoc,updateDoc,getDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import { ToastContainer,toast } from "react-toastify";
export const videoContext = createContext();

 const VideoActionProvider = ({children}) => {
    const [showModal,setshowModal] = useState(false);
    const [bottomlayout,setbottomlayout] = useState(false);
    const [showToastNotification,setshowToastNotification] = useState(false);
    const [NotificationMessage,setNotificationMessage] = useState('');
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
    return <videoContext.Provider value={{showModal,showToastNotification,NotificationMessage,bottomlayout,setbottomlayout,setshowModal,setNotificationMessage,setshowToastNotification,LikeVideo,WatchLater}}>{children}</videoContext.Provider>
}
export default VideoActionProvider
