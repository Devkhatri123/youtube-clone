import React, { useContext, useState } from 'react'
import { FiClock } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { BiLike } from "react-icons/bi";
import { BiDislike } from "react-icons/bi";
import { RiShareForwardLine } from "react-icons/ri";
import ShareOnSocialMediaModal from './ShareOnSocialMediaModal';
import { videoContext } from '../Context/VideoContext';
function BottomLayout(props) {
    const [CloseBottomLayout,setCloseBottomLayout] = useState(false);
    const [openModal,setopenModal] = useState(false);
    const VideoContext = useContext(videoContext)
  return !CloseBottomLayout && (
    !VideoContext.showModal ? (
    <div id="video-bottom-layout" style={props && {left:props.Left,top:props.Top}}>
    <div onClick={()=>{setCloseBottomLayout(true)}} className='close-layout'><IoMdClose/> <span>Close Page</span></div> 
     <div className="watch-later">
        <FiClock />
        <p>Watch Later</p>
     </div>
     <div className="Like-video" onClick={()=>{VideoContext.LikeVideo(props.user,props.videoURL,props.video);VideoContext.setshowModal(false)}}>
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
