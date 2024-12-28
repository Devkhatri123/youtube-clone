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
    const [isSaved,setisSaved] = useState(false);
    const [isDisLiked,setisDisLiked] = useState(false);
    const [Description,setDescription] = useState(false);
    const [shortvideoShowMessages,setshortvideoShowMessages] = useState(false);
    const [Left,setLeft] = useState(null);
    const [Top,setTop] = useState(null);

    const LikeVideo = async(user,videoId,video) => {
      if(user){
        const docRef = doc(collection(firestore,`users/${user.uid}/LV`),videoId);
        const videoDocRef = doc(firestore,"videos",videoId);
        const getLikedDoc = await getDoc(docRef);
        const dislikedocRef = doc(collection(firestore,`users/${user.uid}/DV`),videoId);
        const getdislikeDoc = await getDoc(dislikedocRef);
        if(getdislikeDoc.data()){
          await deleteDoc(dislikedocRef);
            //  return "videoRemoved From dislikes"
            setisLiked(true);
            setisDisLiked(false);
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
    const checKLikedOrNot = async (user,videoId) => {
    if(user){
      try{
      const docRef = doc(collection(firestore,`users/${user.uid}/LV`),videoId);
      const dislikedocRef = doc(collection(firestore,`users/${user.uid}/DV`),videoId);
      if((await getDoc(docRef)).exists()){
        setisDisLiked(false);
        setisLiked(true);
      }
      else if((await getDoc(dislikedocRef)).exists()){
        setisLiked(false);
        setisDisLiked(true);
      } 
      else if(!(await getDoc(dislikedocRef)).exists()) setisDisLiked(false);
      else if(!(await getDoc(docRef)).exists()) setisLiked(false)
      }catch(error){
        console.log(error.message)
      }
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
      if(video.likes > 0){
          await deleteDoc(doc(collection(firestore,`users/${user?.uid}/LV`),videoId));
          await updateDoc(videoDocRef,{
            likes: video.likes - 1,
          });
          const data = {videoURL:videoId}
          await setDoc(dislikedocRef,data);
          setNotificationMessage("video disliked");
          setshowToastNotification(true);
          setisDisLiked(true);
          setisLiked(false);
        }
       }else{
        if(getdislikeDoc.exists()){
          await deleteDoc(dislikedocRef);
          setNotificationMessage("videoRemoved From dislikes");
          setshowToastNotification(true);
          setisDisLiked(false);
        }else{
          const data = {videoURL:videoId}
          await setDoc(dislikedocRef,data);
          setNotificationMessage("video disliked");
          setshowToastNotification(true);
          setisDisLiked(true);
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
          setisSaved(true);
       }else{
        await deleteDoc(doc(collection(firestore,`users/${LoggedInUser?.uid}/WL`),videoId));
        setNotificationMessage("videoRemovedFromWatchLater");
        setisSaved(false);
       }
      }else{
        setNotificationMessage("You are not LoggedIn");
      }
      document.body.style.opacity = "1";
      setshowToastNotification(true);
 }
  const getWatchlaterVideo = async(LoggedInUser,searchQuery) => {
         if(LoggedInUser){
          try{
           const LikedDocRef = doc(collection(firestore,`users/${LoggedInUser?.uid}/WL`),searchQuery);
           const GetLikedDoc = await getDoc(LikedDocRef);
           if(GetLikedDoc.exists()){
             setisSaved(true);
           }else{
             setisSaved(false);
           }
         }catch(error){
          console.log(error.message)
         }
             }
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
    try{
  const docRef = doc(collection(firestore,`users/${LoggedInUser?.uid}/subscribedChannel`),SubscribedUser.uid);
  const Doc = await getDoc(docRef);
  if(Doc.exists()){
    setisSubscribed(true);
  }else  setisSubscribed(false);
}catch(error){
  console.log(error.message)
}
}
}
}
const showmodal = (e) => {
  if (window.innerWidth <= 600) {
    document.body.style.opacity = "0.7";
    setLeft(null);
    setTop(null);
  } else {
    setLeft(e.pageX - 246);
    setTop(e.clientY);
  }
  document.body.style.overflow = "hidden";
};
const dots = document.getElementById("dots");
if (dots) {
  window.addEventListener("resize", () => {
    if (window.innerWidth > 600) {
      setLeft(dots.getBoundingClientRect().left - 246);
      setTop(dots.getBoundingClientRect().y + 9);
    } else {
      setLeft(null);
      setTop(null);
    }
  });
}
 const getVideoPublishedTime = (FullLengthVideo) => {
  try{
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
  }catch(error){
    console.log(error.message);
  }
}
const returnvideoTime = (duration) => {
  try{
  const seconds = Math.floor(duration % 60);
  const minutes = Math.floor(duration / 60) % 60;
  const hours = Math.floor(duration / 3600)
  if(hours !== 0){
    return hours + ":" + minutes + ":" + seconds;
  }else{
   return  minutes + ":" + seconds.toString().padStart(2, 0)
  }
}catch(error){
  console.log(error.message)
}
}
    return <videoContext.Provider value={{showModal,showToastNotification,shortvideoShowMessages,NotificationMessage,Description,bottomlayout,isSubscribed,isLiked,isDisLiked,isSaved,Left,Top,setisLiked,setisSubscribed,setDescription,setshortvideoShowMessages,setbottomlayout,setshowModal,setNotificationMessage,setshowToastNotification,LikeVideo,WatchLater,getVideoPublishedTime,returnvideoTime,subscribeChannel,DisLikeVideo,CheckSubscribedOrNot,checKLikedOrNot,setisDisLiked,setisSaved,getWatchlaterVideo,showmodal}}>{children}</videoContext.Provider>
}
export default VideoActionProvider
