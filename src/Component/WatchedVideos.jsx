import React, { useEffect, useRef, useState } from "react";
import WatchedVideo from "./WatchedVideo";
import "../CSS/Library.css"
import { collection,doc, getDoc, onSnapshot } from "firebase/firestore";
import { auth, firestore } from "../firebase/firebase";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { GoHistory } from "react-icons/go";
import { Link } from "react-router-dom";
function WatchedVideos() {
  const [watchedVideos,setwatchedVideos] = useState([]);
  const contentsRef = useRef();
  const [scrolled,setscrolled] = useState(false);
  const GetWatchedVideos = () => {
    onSnapshot(collection(firestore,`users/${auth.currentUser.uid}/WV`),async(snapShot)=>{
      setwatchedVideos(await Promise.all(
      snapShot.docs.map(async(Doc)=>{
         const VideoDocRef = doc(firestore,"videos",Doc.data().videoURL);
       const getVideo = await getDoc(VideoDocRef);
       const userDocRef = doc(firestore,"users",getVideo.data()?.createdBy);
       const user = await getDoc(userDocRef);
       return {
        videoId:VideoDocRef.id,
        Videodata:getVideo.data(),
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
    contentsRef.current.scrollBy({
      left: 847,
      behavior: 'smooth'
  });
  setscrolled(true)
  }
  const ScrollLeft = (e) => {
    contentsRef.current.scrollBy({
      left: -847,
      behavior: 'smooth'
  });
  setscrolled(false)
  }
  return watchedVideos.length > 0 &&(
    <>
     <div className="top_Section">
              <div className="left">
                <GoHistory />
                <h4>History</h4>
              </div>
              <Link to={`/playlist?list=WV`} className='viewAll'>View all</Link>
            </div>
            {watchedVideos.length >= 5 && (
     <div className='forwardIcon watched_VideosforwardIcon' style={{display: !scrolled?"block": "none"}} onClick={(e)=>{ScrollRight(e)}}><IoIosArrowForward/></div>
            )}
     <div ref={contentsRef} className="watchedVideos_body" style={{
      display: "flex",
      overflowX: "scroll",
      width: "-webkit-fill-available",
      gap:'8px'
     }}>
      {watchedVideos.slice(0,6).filter((video)=>{
        return !video.Videodata.shortVideo
      }).map((video,i)=>{
        return <WatchedVideo video={video} key={i} />;
      })}
      </div>
       <div className="backwardIcon"style={scrolled?{display:"block",position:"absolute",bottom:"0",top:"0",height:"36px",transform: "translate(-17px, 174px)"}:{display:"none"}} onClick={(e)=>{ScrollLeft(e)}}><IoIosArrowBack/></div>
    </>
  );
}

export default WatchedVideos;