import { doc, getDoc } from "firebase/firestore";
import { createContext, useState } from "react";
import { firestore } from "../firebase/firebase";
export const currentVideo = createContext(null);

export const VideoProvider = ({ children }) => {
  let [Videos, setVideos] = useState([]);
  let [user,setUser] = useState([]);
   const GetNonFilteredVideos = async(id) => {
     const videoRef = doc(firestore, "videos", id);
      const video = await getDoc(videoRef);
      if (video.exists) {
        setVideos(video.data());
        const userRef = doc(firestore, "users", video.data().createdBy);
        const User = await getDoc(userRef);
        if (User.exists) {
          setUser(User.data());
        }
      }
     return{ videos:Videos,
      user:user
    }
   } 
  return (
    <currentVideo.Provider value={{GetNonFilteredVideos}}>{children}</currentVideo.Provider>
  );
};


