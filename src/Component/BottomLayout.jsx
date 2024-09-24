import React, { useState } from 'react'
import { FiClock } from "react-icons/fi";
import { TiThumbsUp } from "react-icons/ti";
import { GoThumbsdown } from "react-icons/go";
import { IoMdClose } from "react-icons/io";
function BottomLayout() {
    const [CloseBottomLayout,setCloseBottomLayout] = useState(false)
  return !CloseBottomLayout && (
    <div id="video-bottom-layout">
    <div onClick={()=>{setCloseBottomLayout(true);console.log(CloseBottomLayout)}}><IoMdClose/> <span>Close Page</span></div> 
     <div className="watch-later">
        <FiClock />
        <p>Watch Later</p>
     </div>
     <div className="Like-video">
      <TiThumbsUp/>
      <p>Like Video</p>
     </div>
     <div className="DisLike-video">
      <GoThumbsdown/>
      <p>DisLike Video</p>
     </div>
   </div>
  )
}

export default BottomLayout
