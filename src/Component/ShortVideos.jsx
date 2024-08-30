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
  const navigate = useNavigate();
  const params = useParams();
  const [showComment,setshowComment] = useState(false);
  const [windowHeight,setwindowHeight] = useState(window.innerHeight);
 const containerRef = useRef();
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
  if(window.innerWidth < 684){
    setvideoWidth(window.innerWidth);
    setvideoHeight(videoWidth * (16/9));
    }
     const updateVideoSize = () => {
      if(window.innerWidth < 684){
          setvideoWidth(window.innerWidth);
          setvideoHeight(videoWidth * (16/9));
      }
    }
     window.addEventListener('resize', updateVideoSize);
     return ()=>{ window.addEventListener('resize', updateVideoSize);}
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
      console.log(getLikedDoc.id)
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

  useEffect(() => {
    if(FilteredShortVideos){
    const short_video_container = document.querySelectorAll(".short_video_container");
    let currentContainer = short_video_container[Index];
    if (currentContainer) {
      let video = currentContainer.getElementsByTagName('video').shortvideo;
      video.autoplay = true;
      video.play();
      video.muted = false;
      video.loop = true;
  
      let touchStart = 0;
      let touchEnd = 0;
  
      const handleTouchStart = (e) => {
        touchStart = e.targetTouches[0].clientY;
      };
  
      const handleTouchMove = (e) => {
        touchEnd = e.targetTouches[0].clientY;

      };
  
      const handleTouchEnd = () => {
        if(touchStart === 0 || touchEnd === 0){return};
        const distance = touchStart - touchEnd;
        if(distance > currentContainer.clientHeight / 2){
          
          const observer = new IntersectionObserver((entries)=>{
            console.log(entries)
            entries.forEach((Entry)=>{
              if(Entry.intersectionRatio === 1){
               
                if(FilteredShortVideos[Index + 1]){
                  setIndex(Index + 1);
                navigate(`/short/${FilteredShortVideos[Index + 1]?.id}`);
                }
              }else{
                console.log("Next Element is not tvisible");
              }
            })
          },{threshold:1})
          if (short_video_container[Index + 1]) {
            observer.observe(short_video_container[Index + 1]);
            video = currentContainer.getElementsByTagName('video')[0];
            video.pause();
        }
      }
     else if(distance <= -currentContainer.clientHeight / 2){
      const observer = new IntersectionObserver((entries)=>{
        entries.forEach((Entry)=>{
          if(Entry.isIntersecting){
            if(FilteredShortVideos[Index - 1]){
              setIndex(Index - 1);
            navigate(`/short/${FilteredShortVideos[Index - 1]?.id}`);
            }
          }else{
            console.log("Next Element is not tvisible");
          }
        })
      },{threshold:1})
        if (short_video_container[Index - 1]) {
          observer.observe(short_video_container[Index - 1]);
          video = currentContainer.getElementsByTagName('video')[0];
          video.pause();
      }
    }
        touchStart = 0;
        touchEnd = 0;
      
      };
  
      currentContainer.addEventListener("touchstart", handleTouchStart, false);
      currentContainer.addEventListener("touchmove", handleTouchMove, false);
      currentContainer.addEventListener("touchend", handleTouchEnd, false);
  
      return () => {
        // Cleanup event listeners
        currentContainer.removeEventListener("touchstart", handleTouchStart);
        currentContainer.removeEventListener("touchmove", handleTouchMove);
        currentContainer.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }
  },[Index,FilteredShortVideos])


  return Loading ? (
    <p className="text-white">Loading...</p>
  ) : (
  <div className='shortVideos_container' ref={containerRef} >
   <Link to={"/"}>
    <IoIosArrowRoundBack className='back_icon'/>
    </Link>
     {FilteredShortVideos.map((shortvideo,index)=>{
    return <div className="short_video_container" key={index} style={currentState.shortvideoShowMessages ?{height:windowHeight+"px",position:"unset"}:{height:windowHeight+"px",position:"relative"}} id={index}>
     <video src={shortvideo.Videodata.videoURL} muted id="shortvideo" data-video={index} className={shortvideo.id}
    onClick={HandlePause} onTimeUpdate={HandleProgress} 
    style={{width:videoWidth}}
  />
  
  { Ispause && dataSet === index ? <div className="middle_control"><IoMdPlay/></div>:null}
    <div className='short_details' style={currentState.shortvideoShowMessages ? {zIndex:"0"}:{zIndex:"10"}}>
      <div className='short_channel'>
          <img src={shortvideo.UserData.channelPic} alt="" />
          <p>{shortvideo.UserData.name}</p>
      </div>
      <div className="short_title">
          <p>{shortvideo.Videodata.Title}</p>
      </div>
      <div  className="shortvideoprogressBar">
                <span id="short_progressBar_width" ref={Progressref}></span>
              </div>
    </div>
    <div className="short_controls" style={currentState.shortvideoShowMessages ? {zIndex:"0"}:{zIndex:"10"}}>
      <div className="like control" >
      { LikeShort  ? <BiSolidLike /> : <SlLike onClick={()=>HandleLike(shortvideo.id)}/>} 
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
      {currentState.shortvideoShowMessages === true ? <Comment video={shortvideo.Videodata} user={shortvideo.UserData} videoId={params.id}/>:null}
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