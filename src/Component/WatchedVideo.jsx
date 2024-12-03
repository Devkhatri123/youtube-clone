import React, { useContext, useEffect, useRef } from "react";
import "../CSS/Library.css";
import { Link } from "react-router-dom";
import { videoContext } from "../Context/VideoContext";
import { BsThreeDotsVertical } from "react-icons/bs";
function WatchedVideo({ video }) {
  const videocontext = useContext(videoContext)
  return (
    <div id="video" style={{minWidth:"calc(26% - 16px)"}}>
              <Link to={`/watch?v=${video.Videodata?.videoId}`}>
              <div id="thumbnail_container">
              <img src={video.Videodata?.Thumbnail} alt="" className="video"/>
             <p className='videoLength'>{videocontext.returnvideoTime(video.Videodata.videoLength)}</p>
              </div>
                 </Link>
                 <div className="video_bottom">
                              <div className="video_bttom_left">
                                <div className="video_title_and_channelName">
                                  <h3 id="video_title" className="title">
                                    {video.Videodata?.Title}
                                  </h3>
                                  <div>
                                  <p>
                            {video.user?.name} • {video.Videodata.views} Views • {videocontext.getVideoPublishedTime(video)}
                          </p>
                                  </div>
                                </div>
                              </div>
                </div>
                </div>
  );
}

export default WatchedVideo;
