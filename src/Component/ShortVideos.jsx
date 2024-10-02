import React, { useContext, useEffect, useRef, useState } from 'react'
import {Link} from "react-router-dom"
import "../CSS/shortvideo.css";
import { BiLike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";
import { BiDislike } from "react-icons/bi";
import { BiSolidDislike } from "react-icons/bi";
import { SlLike } from "react-icons/sl";
import { MdOutlineMessage } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { IoMdPlay } from "react-icons/io";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useParams } from 'react-router';
import { onSnapshot,doc,getDoc,collection,updateDoc, setDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import { useNavigate } from 'react-router';
import { auth } from '../firebase/firebase';
import Comment from "../Component/Comment"
import { CurrentState } from '../Context/HidevideoinfoCard';
import throttle from "lodash.throttle"

function ShortVideos() {
  let [Index,setIndex] = useState(0);
  const [user,SetUser] = useState(null)
  const [LikeShort,setLikeShort] = useState(false);
  const [Loading,setLoading] = useState(true);
  const [Ispause,setIspause] = useState(false);
  let [ShortVideos,setShortVideos] = useState([]);
  const [dataSet,setdataSet] = useState(null);
  const [FilteredShortVideos,setFilteredShortVideos] = useState([]);
  const [videoWidth,setvideoWidth] = useState(window.innerWidth);
  const [videoHeight,setvideoHeight] = useState(window.innerWidth * (16/9));
  const Progressref = useRef();
  const containerRef = useRef();
  const touchStartRef = useRef(0); // To store the initial touch position
  const touchEndRef = useRef(0);
 const navigate = useNavigate();
  const params = useParams();
  const [windowHeight,setwindowHeight] = useState(window.innerHeight);
 const currentState = useContext(CurrentState);
   useEffect(() => {
    try{
    onSnapshot(collection(firestore, "videos"), async (snapshot) => {
       const FetchedData = await Promise.all(
       snapshot.docs.map(async (Doc) => {
           const userRef = doc(firestore, "users", Doc.data().createdBy);
           const docSnap = await getDoc(userRef);
           return {
             id: Doc.id,
             Videodata: Doc.data(),
             UserData: docSnap.data(),
           };
         })
        );
        setShortVideos(FetchedData);
     });
    }catch(error){
      console.log(error);
    }finally{
       setLoading(false)
    }
   }, []);
   useEffect(()=>{
   setFilteredShortVideos(ShortVideos.filter((shortVideo)=>{
     return shortVideo.Videodata.shortVideo === true;
}));
// console.log(params.id)
  },[ShortVideos]);
 useEffect(()=>{
  auth.onAuthStateChanged(user=>{
    SetUser(user)
  })
},[]);
useEffect(()=>{
  if(window.innerWidth <= 700){
    setvideoWidth(window.innerWidth);
    // setvideoHeight(videoWidth * (16/9));
    }else if (window.innerWidth > 512 && window.innerWidth <= 1000){
      setvideoWidth(300);
     }else if (window.innerWidth > 990){
      setvideoWidth(330);
      // setvideoHeight(555);
     }
     const updateVideoSize = () => {
      if(window.innerWidth <= 700){
        setvideoWidth(window.innerWidth);
        // setvideoHeight(videoWidth * (16/9));
        }else if (window.innerWidth > 512 && window.innerWidth <= 990){
          setvideoWidth(300);
         }else if (window.innerWidth > 990){
          setvideoWidth(330);
          // setvideoHeight(555);
         }
    }
     window.addEventListener('resize', updateVideoSize);
     return ()=>{ window.removeEventListener('resize', updateVideoSize);}
},[videoWidth,videoHeight])
  useEffect(()=>{
     window.onresize = ()=>{
      setwindowHeight(window.innerHeight);
     }
  },[windowHeight])
 useEffect(()=>{
   console.log(params.id);
   const GetLikeVideo = async() => {
    if(user){
    const docRef = doc(collection(firestore,`users/${auth.currentUser?.uid}/LikedVideos`),params.id);
    const getLikedDoc = await getDoc(docRef);
    if(getLikedDoc.exists()){
      setLikeShort(true);
    }else{setLikeShort(false)}
  }
   } 
   GetLikeVideo();
 },[params.id,user])
  const HandleLike = async (id) => {
    const LikedVideo = FilteredShortVideos.filter((video)=>{
      return video.id === id;
    });
    if(user){
      const docRef = doc(collection(firestore,`users/${auth.currentUser.uid}/LikedVideos`),params.id);
      const videoDocRef = doc(firestore,"videos",params.id);
      const getLikedDoc = await getDoc(docRef);
      if(!getLikedDoc.exists()){
      const data = {
        videoURL:params.id
      }
      await setDoc(docRef,data);
      await updateDoc(videoDocRef,{
        likes:LikedVideo[0].Videodata.likes + 1,
       })
      setLikeShort(true);
      }else{
        console.log("video Already exists");
      }
    }
 }
  
  const HandlePause = (e) => {
    setIspause(!Ispause)
    const short_video_container = document.querySelectorAll(".short_video_container");
    let currentContainer = short_video_container[Index];
    let video = currentContainer.getElementsByTagName('video').shortvideo;
    let dataset = video.dataset.video;
    setdataSet(dataset);
    if(Ispause)
    video.play();
  else video.pause()
  }
  const HandleProgress = (e) => {
      const short_video_container = document.querySelectorAll(".short_video_container");
      let currentContainer = short_video_container[Index];
      const ProgressWidth = currentContainer.querySelector('span');
      const Progress = Math.round(e.target.currentTime / e.target.duration * 100);
      if(ProgressWidth)
      ProgressWidth.style.width = Progress + '%';
  }
  const handleTouchStart = (e) => {
    // Capture the initial Y position when touch starts
    touchStartRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    // Capture the final Y position when touch ends
    touchEndRef.current = e.changedTouches[0].clientY;
    handleSwipeGesture();
  };

  const handleSwipeGesture = () => {
    if(!touchEndRef.current || !touchStartRef.current) return;
    const swipeDistance = touchStartRef.current - touchEndRef.current;
    console.log(swipeDistance)
    const swipeThreshold = 100; // Minimum distance to qualify as a swipe
    let currentVideo = document.querySelectorAll(".short_video_container");
    if (swipeDistance > swipeThreshold) {
      if (Index < FilteredShortVideos.length - 1) {
        GotoNextVideo()
      }
    } else if (swipeDistance < -swipeThreshold) {
      // Swipe Down - Go to the previous video
      if (Index > 0 && Index < FilteredShortVideos.length) {
        GotoPreviousVideo()
      }
    };
    if(currentVideo.style){
      currentVideo.style.scrollSnapAlign = 'unset'; 
    touchEndRef.current = touchStartRef.current = 0;
    }
  };
 const GotoNextVideo = () => {
  console.log(Index)
  let currentVideo = document.querySelectorAll(".short_video_container")[Index];
  currentVideo.getElementsByTagName('video').shortvideo.pause();
  console.log( currentVideo.nextElementSibling);
  currentVideo.nextElementSibling.style.scrollSnapAlign = 'start';
  currentVideo.nextElementSibling.scrollIntoView({ behavior: 'smooth' });
  navigate(`/short/${currentVideo.nextElementSibling.getElementsByTagName('video').shortvideo.dataset.video}`)
  setIndex(Index + 1);
  currentVideo.style.scrollSnapAlign = 'unset'; 
}
 const GotoPreviousVideo = () => {
  let currentVideo = document.querySelectorAll(".short_video_container")[Index];
  currentVideo.getElementsByTagName('video').shortvideo.pause();
  setIndex(Index - 1);
  currentVideo = document.querySelectorAll(".short_video_container")[Index];
  currentVideo.previousElementSibling.style.scrollSnapAlign = 'end';
  currentVideo.previousElementSibling.scrollIntoView({ behavior: 'smooth' });
  navigate(`/short/${currentVideo.previousElementSibling.getElementsByTagName('video').shortvideo.dataset.video}`)
 }
 useEffect(()=>{
  window.addEventListener("keydown",(e)=>{
    if(e.key === "ArrowDown" || e.keyCode === 40){
      GotoNextVideo();
    }
  console.log(e)
  })
  return () => {
    window.removeEventListener('keydown',{})
  }
 },[Index])
useEffect(()=>{
   let currentVideo = document.querySelectorAll(".short_video_container")[Index];
    if(currentVideo){
    currentVideo.getElementsByTagName('video').shortvideo.play();
    }
},[Index,FilteredShortVideos])
  return Loading ? (
    <p className="text-white">Loading...</p>
  ) : (
  <div className='shortVideos_container' ref={containerRef} id='shortVideoscontainer'
  onTouchStart={!currentState.shortvideoShowMessages ? handleTouchStart:null}
  onTouchEnd={!currentState.shortvideoShowMessages ? handleTouchEnd : null}
  >
   <Link to={"/"}>
    <IoIosArrowRoundBack className='back_icon'/>
    </Link>
     {FilteredShortVideos.map((shortvideo,index)=>{
    return <div className="short_video_container" key={index} style={currentState.shortvideoShowMessages ?{height:windowHeight+"px",position:"unset"}:{height:windowHeight+"px",position:"relative"}}  data-id={shortvideo.id}>
     <video src={shortvideo.Videodata.videoURL}  id="shortvideo" data-video={shortvideo.id}
    onClick={HandlePause} onTimeUpdate={HandleProgress} data-id={params.id}
    style={{width:videoWidth,height:videoHeight}}
  />
  
  { Ispause && dataSet === index ? <div className="middle_control"><IoMdPlay/></div>:null}
    <div className='short_details' style={currentState.shortvideoShowMessages ? {zIndex:"0"}:{zIndex:"10",position:"absolute"}}>
      <div className='short_channel'>
          <img src={shortvideo.UserData.channelPic} alt="" />
          <p>{shortvideo.UserData.name}</p>
          <button>subscribe</button>
      </div>
      <div className="short_title">
          <p>{shortvideo.Videodata.Title}</p>
      </div>
      <div  className="shortvideoprogressBar">
                <span id="short_progressBar_width" ref={Progressref}></span>
              </div>
    </div>
    <div className="short_controls" id='shortcontrols' style={currentState.shortvideoShowMessages ? {zIndex:"0",position:"absolute",bottom:"unset"}:{zIndex:"10",position:"absolute"}}>
      <div className="like control" >
      { LikeShort  ? <BiSolidLike /> : <BiLike onClick={()=>HandleLike(shortvideo.id)}/>} 
          <p>{shortvideo.Videodata.likes}</p>
      </div>
      <div className="dislike control">
        <BiDislike/>
        <p>2</p>
      </div>
      <div className="message control" onClick={()=>{currentState.setshortvideoShowMessages(true);document.body.style.overflowY="hidden";console.log(currentState.shortvideoShowMessages)}}>
        <MdOutlineMessage/>
        <p>3520</p>
      </div>
      {currentState.shortvideoShowMessages === true &&<div className='shortVivdeoComment'> <Comment video={shortvideo.Videodata} user={shortvideo.UserData} videoId={params.id}/></div>}
      <div className="menu control">
        <BsThreeDots/>
      </div>
      <div className="channel control">
      <img src={shortvideo.UserData.channelPic} alt="" style={{width: "45px",borderRadius:"10px"}}/>
      </div>
    </div>
    </div>
  })}
  </div>
) 
  
 }
 export default ShortVideos