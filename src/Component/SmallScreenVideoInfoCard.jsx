import React,{useEffect,useState,useContext} from 'react'
import DescriptionPage from './DescriptionPage';
import VideoDetail from './VideoDetail';
import Comment from './Comment';
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
import { useSearchParams } from "react-router-dom";
import { auth } from '../firebase/firebase';
import { videoContext } from '../Context/VideoContext';
function SmallScreenVideoInfoCard(props) {
    const currentState= useContext(videoContext);
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
        if(LoggedInUser){
          setisbuttonDisable(true);
          currentState.subscribeChannel(LoggedInUser,props.user);
          setisbuttonDisable(false);
      }else{
        alert("You are not signedIn");
      }
    }catch(Error){
      console.log(Error);
    }
      }
       useEffect(()=>{
         currentState.CheckSubscribedOrNot(LoggedInUser,props.user)
         },[props.videoId,props.user,LoggedInUser]);
      useEffect(()=>{
        currentState.checKLikedOrNot(LoggedInUser,props.videoId)
      },[props.videoId,LoggedInUser])
       useEffect(()=>{
        currentState.getWatchlaterVideo(LoggedInUser,searchQuery);
      },[LoggedInUser,searchQuery])
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
              {currentState.isSubscribed === true ? <button className="subscribe_btn subscribed_btn" onClick={makeSubscribe} disabled={isbuttonDisable ? true : false}>Subscribed</button>:<button className="subscribe_btn" onClick={makeSubscribe} disabled={isbuttonDisable ? true : false}>Subscribe</button>} 
              </div>
              <div className="like_share_save_container">
                <div>
                  {currentState.isLiked === false ? (
                    <BiLike onClick={()=>{currentState.LikeVideo(LoggedInUser,props.videoId,props.Video)}} />
                  ) : (
                    <BiSolidLike onClick={()=>{currentState.LikeVideo(LoggedInUser,props.videoId,props.Video)}} />
                  )}
                  <span className="likes">{props.Video?.likes}</span>
                  <span>|</span>
                  {currentState.isDisLiked ? <BiSolidDislike onClick={()=>{currentState.DisLikeVideo(LoggedInUser,props.videoId,props.Video)}}/> :  <BiDislike onClick={()=>{currentState.DisLikeVideo(LoggedInUser,props.videoId,props.Video)}}/>}
                </div>
                <div>
                  <RiShareForwardLine />
                  <span className="share">Share</span>
                </div>
                <div onClick={async()=>{await currentState.WatchLater(LoggedInUser,props.videoId);}}>
                {!currentState.isSaved ? <FaRegBookmark /> : <FaBookmark/>}
                  <span className="save">Save</span>
                </div>
              </div>
              <div className="comments">
              {props.Video?.comments === "On"?(
                <>
                {props.Video?.Comments ? (
                  <>
                <div className="comments_top">
                  <p>
                    Comments <span style={{color: "#aaa"}}>{props.Video?.NumberOfComments}</span>
                  </p>
                </div>
                
                <div className="comment" onClick={()=>{currentState.setshortvideoShowMessages(true);document.body.style.overflow="hidden";window.scrollTo(0,0)}}>
                  <img src={props.Video?.Comments[0]?.userPic} alt={props.Video?.Comments[0]?.name} />
                  <span>{props.Video?.Comments[0]?.CommentText}</span>
                </div>
                </>
                 ):<p  onClick={()=>{currentState.setshortvideoShowMessages(true);document.body.style.overflow="hidden";window.scrollTo(0,0)}}>No Comments Till Now</p>}
                </>
              ) : (
                 <p className="comments_turnedOff_message">Comments are Turned Off for this video</p>
              )}
              </div>
            </div>
  )
}

export default SmallScreenVideoInfoCard
