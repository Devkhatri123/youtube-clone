import React,{useEffect,useState,useContext, useRef} from 'react'
import { collection,doc,getDoc,updateDoc,setDoc,deleteDoc, addDoc } from 'firebase/firestore';
import { BsThreeDotsVertical } from "react-icons/bs";
import { BiLike } from "react-icons/bi";
import { MdOutlineMessage } from "react-icons/md";
import { BiSolidLike } from "react-icons/bi";
import { BiDislike } from "react-icons/bi";
import { BiSolidDislike } from "react-icons/bi";
import { IoIosShareAlt } from "react-icons/io";
import { RiShareForwardLine } from "react-icons/ri";
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import { IoReloadOutline } from "react-icons/io5";
import { FaRegFlag } from "react-icons/fa6";
import { FaFlag } from "react-icons/fa6";
import { PiDotsThreeBold } from "react-icons/pi";
import "../CSS/VideoPage.css";
import { auth, firestore } from '../firebase/firebase';
import CommentBody from './CommentBody';
import ShareOnSocialMediaModal from './ShareOnSocialMediaModal';
import { videoContext } from '../Context/VideoContext';
import ErrorPage from './ErrorPage';
function LargeScreenVideoInfoCard(props) {
   let [isLiked, setisLiked] = useState(false);
   const [issavedVideo,SetsavedVideo] = useState(false);
    let [isSubscribed,setisSubscribed] = useState(false);
    const [isDisliked,setisDisliked] = useState(false);
    const [showFullText,setshowFullText] = useState(false);
    let [Loading, setLoading] = useState(false);
    const [Error,SetError] = useState(false);
    const [ErrorMessage,SetErrorMessage] = useState('');
    const [user,setuser] = useState(null);
    const [IsbtnDisable,setIsbtnDisable] = useState(false);
    const VideoContext = useContext(videoContext);
    useEffect(()=>{
    auth.onAuthStateChanged((currentuser)=>{
      setuser(currentuser);
    })
    },[])
    useEffect(()=>{
      if(user){
     const checkCurrentWatchedVideo = async () => {
      try {
    const videoDocRef = doc(collection(firestore,`users/${user?.uid}/WV`),props.videoId);
    const videoDoc = await getDoc(videoDocRef);
    const videoCollection = doc(firestore,"videos",props.videoId);
    if(!videoDoc.exists()){
      const data = {
        videoURL:props.videoId,
      }
      await setDoc(videoDocRef,data);
      await updateDoc(videoCollection,{
        views:props.Video?.views + 1
      })
    }
    }catch (error){
     SetError(true);
    SetErrorMessage(error.message)
    }
  }
      checkCurrentWatchedVideo();
}
    },[props.videoId,user,props.Video?.views])
  const makeSubscribe = async() => {
      if(user){
          setIsbtnDisable(true);
          const result = await VideoContext.subscribeChannel(user,props.user);
          if(result === "subscribed"){
            setisSubscribed(true);
          }else{
            setisSubscribed(false);
          }
          setIsbtnDisable(false);
      }else{
        alert("You are not signedIn");
      }
      }
      useEffect(()=>{
        const checkSubscribedOrNot = async() => {
          if(user){
          if(props.user){
          const result = VideoContext.CheckSubscribedOrNot(user,props.user);
          if(result)setisSubscribed(true);
          else setisSubscribed(false);
        }
      }
          }
        checkSubscribedOrNot()
      },[props.user,user]);
      const doLike = async() => {
       if(props.CurrentUser){
        const result = VideoContext.LikeVideo(user,props.videoId,props.Video)
        if(result === "videoLiked") setisLiked(true);
        else setisLiked(false);
        setisDisliked(false);
      }
      }
      useEffect(()=>{
        const checkLikedOrNot = async() => {
          try{
          if(user){
          const LikedDocRef = doc(collection(firestore,`users/${user?.uid}/LV`),props.videoId);
          const GetLikedDoc = await getDoc(LikedDocRef);
          if(GetLikedDoc.exists()){
            setisLiked(true);
          }else{
            setisLiked(false);
          }
        }
      }catch(error){
        console.log(error.message)
        SetError(true)
        SetErrorMessage(error.message)
      }
      }
        checkLikedOrNot();
      },[props.videoId,props.user,user]);
      const dislikevideo = ()=>{
      VideoContext.DisLikeVideo(user,props.videoId,props.Video).then((res)=>{
        if(res == "video disliked"){
          if(isLiked) setisLiked(false);
        setisDisliked(true);
       }else{
        setisDisliked(false);
       }
       })
      }
      useEffect(()=>{
          const checkDislikedOrNot = async() => {
           try{
            if(user){
              const LikedDocRef = doc(collection(firestore,`users/${user?.uid}/DV`),props.videoId);
              const GetLikedDoc = await getDoc(LikedDocRef);
              if(GetLikedDoc.exists()){
                setisDisliked(true);
              }else{
                setisDisliked(false);
              }
            }
          }catch(error){
            console.log(error.message);
          }
        }
        checkDislikedOrNot()
      },[props.videoId,props.user,user])
      const watchlater = async() => {
        if(user){
          const result = await VideoContext.WatchLater(user,props.videoId);
          if(result === "videoAddedFromWatchLater") SetsavedVideo(true);
          else SetsavedVideo(false);
          }
      }
      useEffect(()=>{
        const getWatchlaterVideo = async() => {
        if(user){
          const LikedDocRef = doc(collection(firestore,`users/${user?.uid}/Watchlater`),props.videoId);
          const GetLikedDoc = await getDoc(LikedDocRef)
          if(GetLikedDoc.exists()){
            SetsavedVideo(true);
          }else{
            SetsavedVideo(false);
          }
        }
      }
        getWatchlaterVideo();
       },[user,props.videoId])
       const urlify = (text) => {
          var urlRegex = /(https?:\/\/[^\s]+)/g;
          return text.replace(urlRegex, function(url) {
           if(url.includes("youtube")){
            return `<div style="display:flex;align-items:center;background-color: rgba(255, 255, 255, 0.102);width: fit-content;border-radius: 12px;padding: 0px 7px;"><img src="https://www.gstatic.com/youtube/img/watch/yt_favicon.png" style="height:13px">•<a href=${url}>${url}</a></div>`
           }else if (url.toLowerCase().includes("facebook")){
               return `<div style="display:flex;align-items:center;background-color: rgba(255, 255, 255, 0.102);width: fit-content;border-radius: 12px;padding: 0px 7px;"><img src="https://www.gstatic.com/youtube/img/watch/social_media/facebook_1x.png" style="height:13px">•<a href=${url}>${url}</a></div>`
            }else if (url.toLowerCase().includes("instagram")){
              return `<div style="display:flex;align-items:center;background-color: rgba(255, 255, 255, 0.102);width: fit-content;border-radius: 12px;padding: 0px 7px;"><img src="https://www.gstatic.com/youtube/img/watch/social_media/instagram_1x.png" style="height:13px">•<a href=${url}>${url}</a></div>`
           }else{
            return `<div style="display:flex;align-items:center;background-color: rgba(255, 255, 255, 0.102);width: fit-content;border-radius: 12px;padding: 0px 7px;"><a href=${url}>${url}</a></div>`
           }
          })
        }
 
  return !Error ? (
    !Loading ? (
    <div className="largescreen-videoInfoCard">
      
    <div>
    <h3 id="video-title" >{props.Video?.Title}</h3>
    </div>
  
     <div className="large-screen-channel_details">
        <div className="large-screen-channel_details_left_part">
          <div className='large-screen-left-part'>
          <img src={props.user?.channelPic} alt={props.user?.name} />
          <div style={{margin:"3px 0px 0px 5px",lineHeight: "1.1"}}>
         <span className="channeName">{props.user?.name}</span>
         <p style={{fontsize:"13px"}}>{props.user?.subscribers} subscribers</p>
         </div>
         </div>
      {isSubscribed === true ? <button className="subscribe_btn subscribed_btn" onClick={makeSubscribe} disabled={IsbtnDisable ? true : false}>Subscribed</button>:<button className="subscribe_btn" onClick={makeSubscribe} disabled={IsbtnDisable ? true : false}>Subscribe</button>} 
      </div>
      <div className="like_share_save_container">
        <div>
        {isLiked === false ? (
            <BiLike onClick={doLike} />
          ) : (
            <BiSolidLike onClick={doLike} />
          )}
          <span className="likes">{props.Video?.likes}</span>
          <span>|</span>
          {isDisliked ? <BiSolidDislike onClick={dislikevideo}/> :  <BiDislike onClick={dislikevideo} />}
          </div>
       <div onClick={()=>{VideoContext.setshowModal(true);console.log(VideoContext.showModal)}}>
          <RiShareForwardLine/>
          <span className="share">Share</span>
        </div>
        <div>
          {issavedVideo ? <FaBookmark onClick={watchlater}/>:<FaRegBookmark onClick={watchlater}/>}
          <span className="share">Save</span>
        </div>
        {VideoContext.showModal && (
          <ShareOnSocialMediaModal/>
          )}
        </div>
        </div>
        {props.Video?.description && (
        <div className="main-description">
          <p style={{color:"gray"}}>{props.Video?.views} views</p>
              <div onClick={()=>setshowFullText(!showFullText)} style={{overflow:"auto"}} dangerouslySetInnerHTML={{__html:  props.Video?.description.length > 0 ? (
                  props.Video?.description.length > 160 ? (
                    showFullText?urlify(props.Video.description):urlify(props.Video.description.substring(0,160))+`...`):(urlify(props.Video.description.substring(0,100)))):("no text")
               }}
                  >
                 </div>
            </div>
            )}
    <div className='large-screen-commnets-section'>
      {props.Video?.comments === "On"?(
        <>
        <CommentBody videoId = {props.videoId} video = {props.Video}/>
        </>
      ) : (
         <p className="comments_turnedOff_message">Comments are Turned Off for this video</p>
      )}
      </div>
    </div>
    ):<p style={{color:"white"}}>Loading...</p>
  ):<ErrorPage ErrorMessage={ErrorMessage}/>
}

export default LargeScreenVideoInfoCard
