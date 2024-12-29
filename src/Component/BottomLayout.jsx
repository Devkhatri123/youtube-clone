import React, { useContext, useEffect, useRef, useState } from 'react'
import { FiClock } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { BiLike } from "react-icons/bi";
import { BiDislike } from "react-icons/bi";
import { RiShareForwardLine } from "react-icons/ri";
import ShareOnSocialMediaModal from './ShareOnSocialMediaModal';
import { MdDeleteForever } from "react-icons/md";
import { videoContext } from '../Context/VideoContext';

function BottomLayout(props) {
    const VideoContext = useContext(videoContext);
    const touchStartRef = useRef(0);
    const touchEndRef = useRef(0);
    const BottomLayout = useRef();
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
      VideoContext.setbottomlayout(false)
        document.body.style.overflow = "scroll";
        document.body.style.opacity = "1";
      }else{
       BottomLayout.current.style.transform= `translateY(0px)`;
      }
    } 
const watchlater = async() => {
  await VideoContext.WatchLater(props.user,props.videoURL);
   VideoContext.setbottomlayout(false)
}
const likevideo = () => {
  VideoContext.LikeVideo(props.user,props.videoURL,props.video);
  VideoContext.setshowModal(false);
  VideoContext.setbottomlayout(false);
}
const Dislikevideo = () => {
  VideoContext.DisLikeVideo(props.user,props.videoURL,props.video);
  VideoContext.setshowModal(false);
  VideoContext.setbottomlayout(false);
}
document.addEventListener("click",(e)=>{
  if(BottomLayout.current){
  if(!BottomLayout.current.contains(e.target) && e.target.localName !== "svg" && e.target.nodeName !== "path"){
  VideoContext.setbottomlayout(false)
  document.body.style.opacity = "1"; 
}else{
    VideoContext.setbottomlayout(true)
  }
}
})
  return VideoContext.bottomlayout  && (
    !VideoContext.showModal ? (
      
    <div id="video-bottom-layout" ref={BottomLayout} style={{left:props && props.Left,top:props && props.Top,overflowY:"scroll"}}>
    <div className="line" onTouchMove={drageSection} onTouchStart={sectionTouch} onTouchEnd={HideLayout}><span></span></div>
     <div className="watch-later" onClick={()=>{watchlater();}}>
        <FiClock />
        <p>Watch Later</p>
     </div>
     <div className="Like-video" onClick={()=>{likevideo()}}>
      <BiLike/>
      <p>Like Video</p>
     </div>
     <div className="DisLike-video" onClick={()=>{Dislikevideo()}}>
      <BiDislike/>
      <p>DisLike Video</p>
     </div>
     <div className="share-video" onClick={()=>{VideoContext.setshowModal(true);}}>
      <RiShareForwardLine/>
      <p>Share video</p>
     </div>
     {props.searchQuery&&(
     <div className="DeleteVideo">
      <MdDeleteForever/>
      <p>Delete Video From {props.searchQuery  == "WL" ? "Watch Later":"Liked Videos"}</p>
     </div>
     )}
   </div>
    ):<ShareOnSocialMediaModal URL={props.videoURL}/>
  )
}

export default BottomLayout
