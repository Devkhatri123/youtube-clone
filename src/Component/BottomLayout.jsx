import React, { useContext, useEffect, useRef, useState } from 'react'
import { FiClock } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { BiLike } from "react-icons/bi";
import { BiDislike } from "react-icons/bi";
import { RiShareForwardLine } from "react-icons/ri";
import ShareOnSocialMediaModal from './ShareOnSocialMediaModal';
import { videoContext } from '../Context/VideoContext';
function BottomLayout(props) {
    const [CloseBottomLayout,setCloseBottomLayout] = useState(true);
    const VideoContext = useContext(videoContext);
    const touchStartRef = useRef(0);
    const touchEndRef = useRef(0);
    const BottomLayout = useRef();
    const [height,setheight] = useState(248);
    const sectionTouch = (e) => {
      touchStartRef.current = e.touches[0].clientY;
    }
    const drageSection = (e) => {
      touchEndRef.current = e.changedTouches[0].clientY;
      const swipeDistance = touchStartRef.current - touchEndRef.current;
      if(swipeDistance < 0)
      BottomLayout.current.style.transform = `translateY(${Math.abs(swipeDistance)}px)`
     }
    const HideLayout = (e) => {
      const swipeDistance = touchStartRef.current - touchEndRef.current;
      if(swipeDistance <= -65){
        BottomLayout.current.style.display = "none";
      //  setCloseBottomLayout(false)
      VideoContext.setbottomlayout(false)
        document.body.style.overflow = "scroll";
        document.body.style.opacity = "1";
      }else{
        setheight(248)
        BottomLayout.current.style.transform= `translateY(0px)`;
      }
    } 
const watchlater = async() => {
  await VideoContext.WatchLater(props.user,props.videoURL)
  VideoContext.setshowToastNotification(true);
  VideoContext.setNotificationMessage('Saved to Watchlater');
  setTimeout(() => {
    VideoContext.setbottomlayout(false)
   }, 3000);
}
const likevideo = async() => {
 const result = VideoContext.LikeVideo(props.user,props.videoURL,props.video);
 if(result) VideoContext.setshowToastNotification(true);
 VideoContext.setNotificationMessage('Video Liked!');
 setTimeout(() => {
  VideoContext.setbottomlayout(false)
 }, 3000);
}
document.addEventListener("click",(e)=>{
  if(BottomLayout.current){
  if(!BottomLayout.current.contains(e.target) && e.target.localName !== "svg" && e.target.nodeName !== "path"){
  VideoContext.setbottomlayout(false)
  }else{
    VideoContext.setbottomlayout(true)
  }
}
// console.log(e)
})
  return VideoContext.bottomlayout  && (
    !VideoContext.showModal ? (
      
    <div id="video-bottom-layout" ref={BottomLayout} style={{left:props && props.Left,top:props && props.Top,maxHeight:height,overflowY:"scroll"}}>
    <div className="line" onTouchMove={drageSection} onTouchStart={sectionTouch} onTouchEnd={HideLayout}><span></span></div>
     <div className="watch-later" onClick={()=>{watchlater();}}>
        <FiClock />
        <p>Watch Later</p>
       
     </div>
     <div className="Like-video" onClick={()=>{likevideo()}}>
      <BiLike/>
      <p>Like Video</p>
     </div>
     <div className="DisLike-video">
      <BiDislike/>
      <p>DisLike Video</p>
     </div>
     <div className="share-video" onClick={()=>{VideoContext.setshowModal(true)}}>
      <RiShareForwardLine/>
      <p>Share video</p>
     </div>
   </div>
    ):<ShareOnSocialMediaModal URL={props.videoURL}/>
  )
}

export default BottomLayout
