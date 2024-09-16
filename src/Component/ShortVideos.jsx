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
import { Swipe } from '@mui/icons-material';
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
    }else if (window.innerWidth >= 990){
      setvideoWidth(window.innerWidth);
    }
     const updateVideoSize = () => {
      if(window.innerWidth < 684){
          setvideoWidth(window.innerWidth);
          setvideoHeight(videoWidth * (16/9));
      } else if (window.innerWidth >= 990){
        setvideoWidth(window.innerWidth); }
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

 useEffect(()=>{
  const Videoscontainer = containerRef.current
  console.log(Videoscontainer);
  if (!Videoscontainer) {
   console.error("Container not found");
   return;
 }
 if(Videoscontainer !== undefined){
  const handleScroll = () => {
    const videos = Videoscontainer.querySelectorAll('.short_video_container');
   console.log(videos)
  videos.forEach((video)=>{
   console.log(video)
   const rect = video.getBoundingClientRect();
   console.log(rect)
   if(rect.top >= 0 && rect.top < window.innerHeight / 2){
    const id = video.dataset.id;
    console.log(id)
    window.history.replaceState(null, null, `/short/${id}`);
   }
  })
 }
 Videoscontainer.addEventListener("scroll",handleScroll);
 }
//  return () => {
//   videos?.removeEventListener("scroll",handleScroll);
//  }
 },[FilteredShortVideos])


  return Loading ? (
    <p className="text-white">Loading...</p>
  ) : (
  <div className='shortVideos_container' ref={containerRef} id='shortVideoscontainer'>
   <Link to={"/"}>
    <IoIosArrowRoundBack className='back_icon'/>
    </Link>
     {FilteredShortVideos.map((shortvideo,index)=>{
    return <div className="short_video_container" key={index} style={currentState.shortvideoShowMessages ?{height:windowHeight+"px",position:"unset"}:{height:windowHeight+"px",position:"relative"}}  data-id={shortvideo.id}>
     <video src={shortvideo.Videodata.videoURL} muted id="shortvideo" data-video={index} className={shortvideo.id}
    onClick={HandlePause} onTimeUpdate={HandleProgress} data-id={params.id}
    style={{width:videoWidth}}
  />
  
  { Ispause && dataSet === index ? <div className="middle_control"><IoMdPlay/></div>:null}
    <div className='short_details' style={currentState.shortvideoShowMessages ? {zIndex:"0",position:"unset"}:{zIndex:"10",position:"absolute"}}>
      <div className='short_channel'>
          <img src={shortvideo.UserData.channelURL} alt="" />
          <p>{shortvideo.UserData.name}</p>
      </div>
      <div className="short_title">
          <p>{shortvideo.Videodata.Title}</p>
      </div>
      <div  className="shortvideoprogressBar">
                <span id="short_progressBar_width" ref={Progressref}></span>
              </div>
    </div>
    <div className="short_controls" id='shortcontrols' style={currentState.shortvideoShowMessages ? {zIndex:"0",position:"unset"}:{zIndex:"10",position:"absolute"}}>
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
      {currentState.shortvideoShowMessages === true ?<div className='shortVivdeoComment'> <Comment video={shortvideo.Videodata} user={shortvideo.UserData} videoId={params.id}/></div>:null}
      <div className="menu control">
        <BsThreeDots/>
      </div>
      <div className="channel control">
      <img src={shortvideo.UserData.channelURL} alt="" style={{width: "45px",borderRadius:"10px"}}/>
      </div>
    </div>
    </div>
  })}
  </div>
) 
  
 }
 export default ShortVideos