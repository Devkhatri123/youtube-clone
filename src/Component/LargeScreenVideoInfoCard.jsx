import React,{useEffect,useState,useContext} from 'react'
import {CurrentState} from "../Context/HidevideoinfoCard"
import {sanitize} from "dompurify"
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
import { Link } from "react-router-dom";
import { auth, firestore } from '../firebase/firebase';
import CommentBody from './CommentBody';
import Linkify from "linkify-react";
import { Dangerous } from '@mui/icons-material';
import { color } from '@mui/system';
function LargeScreenVideoInfoCard(props) {
    const currentState= useContext(CurrentState);
    let [isLiked, setisLiked] = useState(false);
    const [showFullComment,setshowFullComment] = useState(false);
    let [isSubscribed,setisSubscribed] = useState(false);
    const [showFullText,setshowFullText] = useState(false);
    let [Loading, setLoading] = useState(true);
    const [Error,SetError] = useState(false);
    const [ErrorMessage,SetErrorMessage] = useState('');
    const [user,setuser] = useState(null);
    useEffect(()=>{
    auth.onAuthStateChanged((currentuser)=>{
      setuser(currentuser);
    })
    },[])
    useEffect(()=>{
     const checkCurrentWatchedVideo = async () => {
      setLoading(true);
      try {
    const videoDocRef = doc(collection(firestore,`users/${props.CurrentUser?.uid}/watchedVideos`),props.videoId);
    const videoDoc = await getDoc(videoDocRef);
    const videoCollection = doc(firestore,"videos",props.videoId);
    if(!videoDoc.exists()){
      const data = {
        videoUrl:props.videoId,
      }
      await setDoc(videoDocRef,data);
      await updateDoc(videoCollection,{
        views:props.Video?.views + 1
      })
    }
    }catch (error){
     SetError(true);
    SetErrorMessage(error)
    }finally{
      setLoading(false);
    }
  }
      checkCurrentWatchedVideo();
    },[props.videoId,props.CurrentUser])



    const makeSubscribe = async() => {
        if(user){
        const docRef = doc(collection(firestore,`users/${props.CurrentUser?.uid}/subscribedChannel`),props.user.uid);
        const channelDocRef = doc(collection(firestore,`users`),props.user.uid);
        const subscribersReference = doc(collection(firestore,`users/${props.user.uid}/subscribers`),auth.currentUser.uid);
        const data = {
          name:props.user.name,
          email:props.user.email,
          channePic:props.user.channelURL,
          userId:props.user.uid
        }
        await setDoc(docRef,data);
         await updateDoc(channelDocRef,{
         subscribers:props.user.subscribers +=1,
        });
        await setDoc(subscribersReference,{
          userId:auth.currentUser.uid,
        });
        setisSubscribed(true);
      }else{
        alert("You are not signedIn");
      }
      }
      // Showing user that has he subscribed or not in every render
      useEffect(()=>{
        const checkSubscribedOrNot = async() => {
          if(user){
          if(props.user){
          const docRef = doc(collection(firestore,`users/${props.CurrentUser?.uid}/subscribedChannel`),props.user.uid);
          const Doc = await getDoc(docRef);
          if(Doc.exists()){
           setisSubscribed(true);
          }
        }
      }
          }
        checkSubscribedOrNot()
      },[props.videoId,props.user,props.CurrentUser]);
      const UnSubscribeChannel = async() => {
        if(props.user){
       await deleteDoc(doc(collection(firestore,`users/${props.CurrentUser?.uid}/subscribedChannel`),props.user.uid));
       const channelDocRef = doc(collection(firestore,`users`),props.user.uid);
       await updateDoc(channelDocRef,{
        subscribers:props.user.subscribers -=1,
       })
       setisSubscribed(false);
        }
      }
      const doLike = async() => {
       if(props.CurrentUser){
        const docRef = doc(collection(firestore,`users/${props.CurrentUser?.uid}/LikedVideos`),props.videoId);
        const videoDocRef = doc(firestore,"videos",props.videoId);
        const getLikedDoc = await getDoc(docRef);
        if(!getLikedDoc.exists()){
        const data = {
          VideoTitle:props.Video.Title,
          description:props.Video.description,
          Thumbnail:props.Video.Thumbnail,
        }
        await setDoc(docRef,data);
        await updateDoc(videoDocRef,{
          likes:props.Video.likes + 1,
         })
        setisLiked(true);
        }
      }
      }
      useEffect(()=>{
        const checkLikedOrNot = async() => {
          if(props.CurrentUser){
          const LikedDocRef = doc(collection(firestore,`users/${props.CurrentUser?.uid}/LikedVideos`),props.videoId);
          const GetLikedDoc = await getDoc(LikedDocRef);
          if(GetLikedDoc.exists()){
            setisLiked(true);
          }else{
            setisLiked(false);
          }
        }
      }
        checkLikedOrNot();
      },[props.videoId,props.user,props.CurrentUser])
      const doUnLike = async() => {
          try{
        await deleteDoc(doc(collection(firestore,`users/${props.CurrentUser?.uid}/LikedVideos`),props.videoId));
        const videoDocRef = doc(firestore,"videos",props.videoId);
        await updateDoc(videoDocRef,{
          likes: props.Video.likes - 1,
        });
        setisLiked(false);
      }catch(error){
        console.log("Error :" + error);
      }
       }
       
        const urlify = (text) => {
          const sanitizedHtml = sanitize(text);
         
          console.log(sanitizedHtml)
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
          <img src={props.user?.channelURL} alt={props.user?.name} />
          <div style={{margin:"3px 0px 0px 5px",lineHeight: "1.1"}}>
         <span className="channeName">{props.user?.name}</span>
         <p style={{fontsize:"13px"}}>{props.user?.subscribers} subscribers</p>
         </div>
         </div>
      {isSubscribed === true ? <button className="subscribe_btn subscribed_btn" onClick={UnSubscribeChannel}>Subscribed</button>:<button className="subscribe_btn" onClick={makeSubscribe}>Subscribe</button>} 
      </div>
      <div className="like_share_save_container">
        <div>
        {isLiked === false ? (
            <BiLike onClick={doLike} />
          ) : (
            <BiSolidLike onClick={doUnLike} />
          )}
          <span className="likes">{props.Video?.likes}</span>
          <span>|</span>
          <BiDislike />
          </div>
       <div>
          <RiShareForwardLine />
          <span className="share">Share</span>
        </div>
        <div style={{padding: "0.3rem 0.7rem"}}>
          <PiDotsThreeBold/>
        </div>
        </div>
        </div>
        <div className="main-description">
              <div onClick={()=>setshowFullText(!showFullText)} style={{overflow:"auto"}} dangerouslySetInnerHTML={{__html:  props.Video?.description.length > 0 ? (
                  props.Video?.description.length > 160 ? (
                    showFullText?urlify(props.Video.description):urlify(props.Video.description.substring(0,160))+`...`):(urlify(props.Video.description.substring(0,100)))):("no text")
               }}
                  >
                 </div>
              
              
            </div>
    <div className='large-screen-commnets-section'>
      {props.Video?.comments === "On"?(
        <>
        <CommentBody videoId = {props.videoId} video = {props.Video}/>
        </>
      ) : (
         <p className="comments_turnedOff_message">Comments are Turned Off for this video</p>
      )}
      </div>
      {/* <div className="Next_videos">
       <Videos video={props?.NextVideos}/>
    </div> */}
    </div>
    ):<p style={{color:"white"}}>Loading...</p>
  ):<p style={{color:"white"}}>{ErrorMessage.message}</p>
}

export default LargeScreenVideoInfoCard
