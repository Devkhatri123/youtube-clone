import React, { useEffect, useRef } from "react";
import "../CSS/Library.css";
import { Link } from "react-router-dom";
function WatchedVideo({ video }) {
  const ImgRef = useRef();
  useEffect(()=>{
    const thumbNail = document.querySelectorAll(".videoThumbnail");
    thumbNail.forEach((ImagesCollection)=>{
     const img =  ImagesCollection.getElementsByTagName('img');
     img[0].addEventListener('load',()=>{
      if(img[0].height < 74){
        img[0].style.height = 80+"px";
      }
      console.log(img[0].naturalHeight)
     })
    })
  },[]);
  return (
    <div className="watched_video">
      <div className="videoThumbnail">
        <Link to={`/watch/${video.videoId}`}>
        <img src={video.videoData.Thumbnail} alt={video.videoData.Title} ref={ImgRef} id="videoThumbnail"/>
        </Link>
      </div>
      <div className="videoInfo">
        <p className="text-white " id="watchedVideoTitle">
          {video.videoData.Title}
        </p>
        <p id="watchedVideoChannelName"> {video.userData.name}</p>
        <p id="WatchedVideo_views_publishedTime">
          Views {video.videoData.views} M 
        </p>
      </div>
    </div>
  );
}

export default WatchedVideo;
