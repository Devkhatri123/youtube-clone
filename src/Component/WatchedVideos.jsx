import React, { useEffect, useRef, useState } from "react";
import WatchedVideo from "./WatchedVideo";
import "../CSS/Library.css"
import { collection,doc, getDoc, onSnapshot } from "firebase/firestore";
import { auth, firestore } from "../firebase/firebase";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
function WatchedVideos() {
  const [watchedVideos,setwatchedVideos] = useState([]);
  const contentsRef = useRef();
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
  const ScrollRight = (e) => {
    console.log(e)
    const forwardIcon = document.getElementsByClassName("forwardIcon")[0];
    const backwardIcon = document.getElementsByClassName("backwardIcon")[0];
    contentsRef.current.scrollBy({
      left: 847,
      behavior: 'smooth'
  });
  forwardIcon.style.display = "none";
  backwardIcon.style.display = "block"
  backwardIcon.style.position = "absolute"
  backwardIcon.style.transform = "translate(-18px, 37px)"
  backwardIcon.style.bottom = "unset"
  }
  const ScrollLeft = (e) => {
   console.log(e)
    const forwardIcon = document.getElementsByClassName("forwardIcon")[0];
    const backwardIcon = document.getElementsByClassName("backwardIcon")[0];
    contentsRef.current.scrollBy({
      left: -847,
      behavior: 'smooth'
  });
  forwardIcon.style.display = "block";
  backwardIcon.style.display = "none"
  }
  return (
    <>
     <div className='forwardIcon watched_VideosforwardIcon' onClick={(e)=>{ScrollRight(e)}}><IoIosArrowForward/></div>
     <div ref={contentsRef} style={{
      display: "flex",
      overflowX: "scroll",
      width: "-webkit-fill-available",
      gap:'8px'
     }}>
      {watchedVideos.slice(0,6).filter((video)=>{
        return !video.videoData.shortVideo
      }).map((video,i)=>{
        return <WatchedVideo video={video} key={i} />;
      })}
      </div>
       <div className="backwardIcon" style={{display:"none"}} onClick={(e)=>{ScrollLeft(e)}}><IoIosArrowBack/></div>
    </>
  );
}

export default WatchedVideos;
