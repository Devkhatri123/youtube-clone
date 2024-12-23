import React,{createContext, useContext, useState} from "react";
import { collection,doc,setDoc,updateDoc,getDoc, getDocs, deleteDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import { ToastContainer,toast } from "react-toastify";
export const videoContext = createContext();

 const VideoActionProvider = ({children}) => {
    const [showModal,setshowModal] = useState(false);
    const [bottomlayout,setbottomlayout] = useState(false);
    const [showToastNotification,setshowToastNotification] = useState(false);
    const [NotificationMessage,setNotificationMessage] = useState('');
    const [isSubscribed,setisSubscribed] = useState(false);
    const [isLiked,setisLiked] = useState(false);
    const [Description,setDescription] = useState(false);
    const [shortvideoShowMessages,setshortvideoShowMessages] = useState(false);


    const LikeVideo = async(user,videoId,video) => {
      console.log(video)
      if(user){
        const docRef = doc(collection(firestore,`users/${user.uid}/LV`),videoId);
        const videoDocRef = doc(firestore,"videos",videoId);
        const getLikedDoc = await getDoc(docRef);
        const dislikedocRef = doc(collection(firestore,`users/${user.uid}/DV`),videoId);
        const getdislikeDoc = await getDoc(dislikedocRef);
        if(getdislikeDoc.data()){
          await deleteDoc(dislikedocRef);
            //  return "videoRemoved From dislikes"
            setisLiked(true)
        }
        if(!getLikedDoc.exists()){
        const data = {videoURL:videoId}
        await setDoc(docRef,data);
        await updateDoc(videoDocRef,{
          likes:video.likes + 1,
         });
         setshowToastNotification(true);
         setNotificationMessage("videoLiked");
         setisLiked(true)
        }else{
          await deleteDoc(docRef);
          await updateDoc(videoDocRef,{
            likes: video.likes - 1,
          });
          setshowToastNotification(true);
          setNotificationMessage("video disliked");
          setisLiked(false)
        }
      }else{
        setNotificationMessage("You are not logged in");
        setshowToastNotification(true);
      }
    }
    const checKLikedOrNot = async (user,videoId,video) => {
    if(user){
      const docRef = doc(collection(firestore,`users/${user.uid}/LV`),videoId);
      if((await getDoc(docRef)).exists()) setisLiked(true);
      else setisLiked(false);
    }
    }
    const DisLikeVideo = async(user,videoId,video)=>{
      if(user){
      const dislikedocRef = doc(collection(firestore,`users/${user.uid}/DV`),videoId);
      const videoDocRef = doc(firestore,"videos",videoId);
      const getdislikeDoc = await getDoc(dislikedocRef);
      const docRef = doc(collection(firestore,`users/${user.uid}/LV`),videoId);
      const getLikedDoc = await getDoc(docRef);
     if(getLikedDoc.exists()){
          await deleteDoc(doc(collection(firestore,`users/${user?.uid}/LV`),videoId));
          await updateDoc(videoDocRef,{
            likes: video.likes - 1,
          });
          const data = {videoURL:videoId}
          await setDoc(dislikedocRef,data);
          setNotificationMessage("video disliked");
          setshowToastNotification(true);
       }else{
        if(getdislikeDoc.exists()){
          await deleteDoc(dislikedocRef);
          setNotificationMessage("videoRemoved From dislikes");
          setshowToastNotification(true);
        }else{
          const data = {videoURL:videoId}
          await setDoc(dislikedocRef,data);
          setNotificationMessage("video disliked");
          setshowToastNotification(true);
        }
       }
      }else{
        setNotificationMessage("You are not Logged In");
        setshowToastNotification(true);
      }
    }
    const WatchLater = async(LoggedInUser,videoId) => {
       if(LoggedInUser){
        const watchlaterDocRef = doc(collection(firestore,`users/${LoggedInUser?.uid}/WL`),videoId);
        const watchlaterDoc = await getDoc(watchlaterDocRef);
        if(!watchlaterDoc.exists()){
          await setDoc(watchlaterDocRef,{videoURL:videoId});
          setNotificationMessage("Saved to Watchlater");
           return "videoAddedFromWatchLater"
       }else{
        await deleteDoc(doc(collection(firestore,`users/${LoggedInUser?.uid}/WL`),videoId));
        setNotificationMessage("videoRemovedFromWatchLater");
        return "videoRemovedFromWatchLater"
       }
      }else{
        setNotificationMessage("You are not LoggedIn");
      }
      document.body.style.opacity = "1";
      setshowToastNotification(true);
 }
 const subscribeChannel = async(LoggedInUser,videoCreator) => {
  const docRef = doc(collection(firestore,`users/${LoggedInUser?.uid}/subscribedChannel`),videoCreator.uid);
  const channelDocRef = doc(collection(firestore,`users`),videoCreator.uid);
  const subscribersReference = doc(collection(firestore,`users/${videoCreator.uid}/subscribers`),LoggedInUser.uid);
  const data = {
    name:videoCreator.name,
    email:videoCreator.email,
    channel:videoCreator.channelPic,
    userId:videoCreator.uid
  }
  if(!(await getDoc(docRef)).exists()){
  await setDoc(docRef,data); 
   await updateDoc(channelDocRef,{
   subscribers:videoCreator.subscribers +=1,
  });
  await setDoc(subscribersReference,{
    userId:LoggedInUser.uid,
  });
  setisSubscribed(true);
}else {
  await deleteDoc(doc(collection(firestore,`users/${LoggedInUser.uid}/subscribedChannel`),videoCreator.uid));
  const channelDocRef = doc(collection(firestore,`users`),videoCreator.uid);
  await updateDoc(channelDocRef,{
   subscribers:videoCreator.subscribers -=1,
  });
  setisSubscribed(false);
}
 }
 const CheckSubscribedOrNot = async(LoggedInUser,SubscribedUser) => {
  if(LoggedInUser){
  if(SubscribedUser){
  const docRef = doc(collection(firestore,`users/${LoggedInUser?.uid}/subscribedChannel`),SubscribedUser.uid);
  const Doc = await getDoc(docRef);
  if(Doc.exists()){
    setisSubscribed(true);
  }else  setisSubscribed(false);;
}
}
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
const returnvideoTime = (duration) => {
  const seconds = Math.floor(duration % 60);
  const minutes = Math.floor(duration / 60) % 60;
  const hours = Math.floor(duration / 3600)
  if(hours !== 0){
    return hours + ":" + minutes + ":" + seconds;
  }else{
   return  minutes + ":" + seconds.toString().padStart(2, 0)
  }
}
    return <videoContext.Provider value={{showModal,showToastNotification,shortvideoShowMessages,NotificationMessage,Description,bottomlayout,isSubscribed,isLiked,setisLiked,setisSubscribed,setDescription,setshortvideoShowMessages,setbottomlayout,setshowModal,setNotificationMessage,setshowToastNotification,LikeVideo,WatchLater,getVideoPublishedTime,returnvideoTime,subscribeChannel,DisLikeVideo,CheckSubscribedOrNot,checKLikedOrNot}}>{children}</videoContext.Provider>
}
export default VideoActionProvider
