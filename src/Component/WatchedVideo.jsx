import React from "react";
import "../CSS/Library.css";
function WatchedVideo({ video }) {
  return (
    <div className="watched_video">
      <div className="videoThumbnail">
        <img src={video.videoThumbnail} alt={video.videoTitle} />
      </div>
      <div className="videoInfo">
        <p className="text-white " id="watchedVideoTitle">
          {video.videoTitle}
        </p>
        <p id="watchedVideoChannelName"> {video.ChannelName}</p>
        <p id="WatchedVideo_views_publishedTime">
          Views {video.Views}M {video.Time} Years Ago
        </p>
      </div>
    </div>
  );
}

export default WatchedVideo;
