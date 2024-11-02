import React,{useEffect,useState,useContext} from 'react'
import DescriptionPage from './DescriptionPage';
import VideoDetail from './VideoDetail';
import Comment from './Comment';
import Videos from './Videos';
import { collection,doc,getDoc,updateDoc,setDoc,deleteDoc } from 'firebase/firestore';
import { BsThreeDotsVertical } from "react-icons/bs";
import { BiLike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";
import { BiDislike } from "react-icons/bi";
import { BiSolidDislike } from "react-icons/bi";
import { IoIosShareAlt } from "react-icons/io";
import { RiShareForwardLine } from "react-icons/ri";
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa6";
import { IoReloadOutline } from "react-icons/io5";
import { FaRegFlag } from "react-icons/fa6";
import { FaFlag } from "react-icons/fa6";
import "../CSS/VideoPage.css";
import { Link, useSearchParams } from "react-router-dom";
import { auth, firestore } from '../firebase/firebase';
import { videoContext } from '../Context/VideoContext';
function SmallScreenVideoInfoCard(props) {
    const currentState= useContext(videoContext);
    let [isLiked, setisLiked] = useState(false);
    let [isSubscribed,setisSubscribed] = useState(false);
    let [savedVideo,setsavedVideo] = useState(false);
    const [isbuttonDisable,setisbuttonDisable] = useState(false);
    const [LoggedInUser,setLoggedInUser] = useState(null);
    const [queryParameters] = useSearchParams();
  const searchQuery = queryParameters.get("v");
  const [screenWidth,setscreenWidth] = useState();
  useEffect(()=>{
   setscreenWidth(window.innerWidth);
   window.addEventListener("resize",()=>{
    setscreenWidth(window.innerWidth)
   })
  },[screenWidth])
    useEffect(()=>{
      auth.onAuthStateChanged((currentuser)=>{
        setLoggedInUser(currentuser);
      })
    },[])
    const makeSubscribe = async() => {
      try{
        if(props.CurrentUser){
          setisbuttonDisable(true);
          const result = await currentState.subscribeChannel(LoggedInUser,props.user);
          if(result === "subscribed"){
            setisSubscribed(true);
          }else{
            setisSubscribed(false);
          }
          setisbuttonDisable(false);
      }else{
        alert("You are not signedIn");
      }
    }catch(Error){
      console.log(Error);
    }
      }
       useEffect(()=>{
        const checkSubscribedOrNot = async() => {
          if(props.CurrentUser){
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
      const doLike = async() => {
      if(LoggedInUser){
        const result = await currentState.LikeVideo(LoggedInUser,props.videoId,props.Video)
        if(result === "videoLiked") setisLiked(true);
        else setisLiked(false);
      }
      }
      useEffect(()=>{
        const checkLikedOrNot = async() => {
          if(props.CurrentUser){
          const LikedDocRef = doc(collection(firestore,`users/${props.CurrentUser?.uid}/LV`),props.videoId);
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
       useEffect(()=>{
        if(LoggedInUser){
       const checkCurrentWatchedVideo = async () => {
      const videoDocRef = doc(collection(firestore,`users/${LoggedInUser?.uid}/watchedVideos`),props.videoId);
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
        }
       checkCurrentWatchedVideo();
      }
       },[props.videoId,props.Video,LoggedInUser,searchQuery]);
       useEffect(()=>{
        const getWatchlaterVideo = async() => {
        if(LoggedInUser){
          const LikedDocRef = doc(collection(firestore,`users/${LoggedInUser?.uid}/Watchlater`),searchQuery);
          const GetLikedDoc = await getDoc(LikedDocRef);
          if(GetLikedDoc.exists()){
            setsavedVideo(true);
          }else{
            setsavedVideo(false);
          }
        }
      }
        getWatchlaterVideo();
       },[LoggedInUser,searchQuery])
       const watchLater = async() => {
         if(LoggedInUser){
         const result = await currentState.WatchLater(LoggedInUser,props.videoId);
         if(result === "videoAddedFromWatchLater") setsavedVideo(true);
         else setsavedVideo(false);
         }
       }
  return (
    <div className="video_page">
       { currentState.shortvideoShowMessages && <Comment video={props.Video} user={props.user} videoId={props.videoId}/>}
       { currentState.Description && <DescriptionPage/>}
          <div onClick={()=>{currentState.setDescription(true);window.scrollTo(0,0);document.body.style.overflow="hidden";}} style={{margin:"0 0.9em"}}>
            <VideoDetail/>
            </div>
             <div className="channel_details">
                <div className="channel_details_left_part">
                  <img src={props.user?.channelPic} alt={props.user?.name} />
                 <span className="channeName">{props.user?.name}</span>
                  <span>{props.user?.subscribers}</span>
                </div>
              {isSubscribed === true ? <button className="subscribe_btn subscribed_btn" onClick={makeSubscribe} disabled={isbuttonDisable ? true : false}>Subscribed</button>:<button className="subscribe_btn" onClick={makeSubscribe} disabled={isbuttonDisable ? true : false}>Subscribe</button>} 
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
                  <BiDislike />
                </div>
                <div>
                  <RiShareForwardLine />
                  <span className="share">Share</span>
                </div>
                <div onClick={watchLater}>
                {!savedVideo ? <FaRegBookmark /> : <FaBookmark/>}
                  <span className="save">Save</span>
                </div>
                <div>
                  <FaRegFlag />
                  <span className="report">Report</span>
                </div>
              </div>
              {/* {currentState.shortvideoShowMessages ? <Comment video={Video} user={user} videoId={params.id}/>:null} */}
              <div className="comments" onClick={()=>{currentState.setshortvideoShowMessages(true);document.body.style.overflow="hidden";window.scrollTo(0,0)}}>
              {props.Video?.comments === "On"?(
                <>
                {props.Video?.Comments ? (
                  <>
                <div className="comments_top">
                  <p>
                    Comments <span style={{color: "#aaa"}}>{props.Video?.NumberOfComments}</span>
                  </p>
                </div>
                
                <div className="comment">
                  <img src={props.Video?.Comments[0]?.userPic} alt={props.Video?.Comments[0]?.name} />
                  <span>{props.Video?.Comments[0]?.CommentText}</span>
                </div>
                </>
                 ):<p>No Comments Till Now</p>}
                </>
              ) : (
                 <p className="comments_turnedOff_message">Comments are Turned Off for this video</p>
              )}
              </div>
              {/* {screenWidth <= 587 && props?.NextVideos.length > 0 && (
              <div className="Next_videos">
               <Videos video={props?.NextVideos}/>
            </div>
              )} */}
            </div>
  )
}

export default SmallScreenVideoInfoCard
