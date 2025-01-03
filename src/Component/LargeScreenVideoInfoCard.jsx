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
import { useSearchParams } from 'react-router-dom';
function LargeScreenVideoInfoCard(props) {
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
       VideoContext.checkCurrentWatchedVideo(user,props.videoId,props.Video?.views);
      }
    },[props.videoId,user,props.Video?.views])
  const makeSubscribe = async() => {
      if(user){
          setIsbtnDisable(true);
          await VideoContext.subscribeChannel(user,props.user);
          setIsbtnDisable(false);
      }else{
        alert("You are not signedIn");
      }
      }
      useEffect(()=>{
        const checkSubscribedOrNot = async() => {
          if(user){
          if(props.user){
         await VideoContext.CheckSubscribedOrNot(user,props.user);        }
      }
          }
        checkSubscribedOrNot()
      },[props.user,user]);
      const doLike = async() => {
       if(user){
        VideoContext.LikeVideo(user,props.videoId,props.Video)
      }
      }
      useEffect(()=>{
           try{
           VideoContext.checKLikedOrNot(user,props.videoId);
        }catch(error){
          console.log(error.message)
          SetError(true)
          SetErrorMessage(error.message)
        }
      },[props.videoId,props.user,user]);
      const dislikevideo = ()=>{
      VideoContext.DisLikeVideo(user,props.videoId,props.Video);
      }
      const watchlater = async() => {
        if(user){
          await VideoContext.WatchLater(user,props.videoId);
          }
      }
      useEffect(()=>{
        try{
        VideoContext.getWatchlaterVideo(user,props.videoId);
      }catch(error){
        SetError(true);
        SetErrorMessage(error.message)
        console.log(error.message)
      }
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
 
  return !Error || !ErrorMessage ? (
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
      {VideoContext.isSubscribed === true ? <button className="subscribe_btn subscribed_btn" onClick={makeSubscribe} disabled={IsbtnDisable ? true : false}>Subscribed</button>:<button className="subscribe_btn" onClick={makeSubscribe} disabled={IsbtnDisable ? true : false}>Subscribe</button>} 
      </div>
      <div className="like_share_save_container">
        <div>
        {VideoContext.isLiked === false ? (
            <BiLike onClick={doLike} />
          ) : (
            <BiSolidLike onClick={doLike} />
          )}
          <span className="likes">{props.Video?.likes}</span>
          <span>|</span>
          {VideoContext.isDisLiked ? <BiSolidDislike onClick={dislikevideo}/> :  <BiDislike onClick={dislikevideo} />}
          </div>
       <div onClick={()=>{VideoContext.setshowModal(true)}}>
          <RiShareForwardLine/>
          <span className="share">Share</span>
        </div>
        <div>
          {VideoContext.isSaved ? <FaBookmark onClick={watchlater}/>:<FaRegBookmark onClick={watchlater}/>}
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
