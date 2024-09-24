import React, { useEffect, useState } from "react";
import WatchedVideo from "./WatchedVideo";
import "../CSS/Library.css"
import { collection,doc, getDoc, onSnapshot } from "firebase/firestore";
import { auth, firestore } from "../firebase/firebase";
function WatchedVideos() {
  const [watchedVideos,setwatchedVideos] = useState([]);
  
  const GetWatchedVideos = () => {
    onSnapshot(collection(firestore,`users/${auth.currentUser.uid}/watchedVideos`),async(snanpShot)=>{
      setwatchedVideos(await Promise.all(
      snanpShot.docs.map(async(Doc)=>{
       const VideoDocRef = doc(firestore,"videos",Doc.data().videoUrl);
       const getVideo = await getDoc(VideoDocRef);
       const userDocRef = doc(firestore,"users",getVideo.data()?.createdBy);
       const user = await getDoc(userDocRef);
       return {
        videoId:VideoDocRef.id,
        videoData:getVideo.data(),
        userData:user.data(),
       }
      }),
    )
  )
    })
  }
  useEffect(()=>{
    GetWatchedVideos();
  },[]);
  return (
    <>
      {watchedVideos.map((video, i) => {
        return <WatchedVideo video={video} key={i} />;
      })}
    </>
  );
}

export default WatchedVideos;
