import React, { useContext, useEffect, useRef } from "react";
import "../CSS/Library.css";
import { Link } from "react-router-dom";
import { videoContext } from "../Context/VideoContext";
function WatchedVideo({ video }) {
  const videocontext = useContext(videoContext)
  return (
    <div className="watched_video">
      <div className="videoThumbnail">
        <Link to={`/watch?v=${video.videoId}}`}>
        <img src={video.Videodata?.Thumbnail} alt={video.Videodata?.Title} id="videoThumbnail"/>
        </Link>
        <p className='videoLength' style={{position:"relative",bottom:"25px"}}>{videocontext.returnvideoTime(video.Videodata?.videoLength)}</p>
      </div>
      <div className="videoInfo">
        <p className="text-white " id="watchedVideoTitle">
          {video.Videodata?.Title}
        </p>
        <div style={{display:"flex",alignItems:"baseline",gap:"3px",flexWrap:"wrap"}}>
        <p id="watchedVideoChannelName"> {video.userData.name} • </p>
        <p id="WatchedVideo_views_publishedTime">
          Views {video.Videodata?.views} •  
        </p>
        <p style={{fontSize:"0.7rem",color:"#aaa"}}>{videocontext.getVideoPublishedTime(video)}</p>
        </div>
      </div>
    </div>
  );
}

export default WatchedVideo;
