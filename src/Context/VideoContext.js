import React,{createContext, useContext, useState} from "react";
import { collection,doc,setDoc,updateDoc,getDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebase";
export const videoContext = createContext();

 const VideoActionProvider = ({children}) => {
    const [showModal,setshowModal] = useState(false)
    const LikeVideo = async(user,videoId,video) => {
      console.log(videoId)
        const docRef = doc(collection(firestore,`users/${user.uid}/LikedVideos`),videoId);
        const videoDocRef = doc(firestore,"videos",videoId);
        const getLikedDoc = await getDoc(docRef);
        if(!getLikedDoc.exists()){
        const data = {
          VideoTitle:video.Title,
          description:video.description,
          Thumbnail:video.Thumbnail,
        }
        await setDoc(docRef,data);
        await updateDoc(videoDocRef,{
          likes:video.likes + 1,
         })
         console.log("video has been liked")
        }else{
          console.log("Video is Already liked")
        }
    }
    return <videoContext.Provider value={{showModal,setshowModal,LikeVideo}}>{children}</videoContext.Provider>
}
export default VideoActionProvider
