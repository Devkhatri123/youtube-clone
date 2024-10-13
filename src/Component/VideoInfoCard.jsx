import React, { useState, useEffect, useContext } from "react";
import VideoPlayer from "./VideoPlayer";
import {auth } from "../firebase/firebase";
import "../CSS/VideoPage.css";
import { CurrentState } from "../Context/HidevideoinfoCard";
import SmallScreenVideoInfoCard from "./SmallScreenVideoInfoCard";
import LargeScreenVideoInfoCard from "./LargeScreenVideoInfoCard";
function VideoInfoCard(props) {
  const currentState = useContext(CurrentState);
  const [CurrentUser, setCurrentUser] = useState(null);
  const [windowWidth, setwindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    setwindowWidth(window.innerWidth);
    const updateVideoSize = () => {
      setwindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", updateVideoSize);
    return () => {
      window.removeEventListener("resize", updateVideoSize);
    };
  }, [windowWidth]);
  // Fetching current Video on which user clicked on
  useState(() => {
    auth.onAuthStateChanged((currentUser) => {
      setCurrentUser(currentUser);
    });
  }, []);

  return (
  <div className="fullVideoPage" style={props.FullLengthVideos.length > 0?{ width:props.CalculatedscreenWidth,maxWidth:props.CalculatedscreenWidth }:{width:"100%",left:"0",right:"0",margin:"0 auto",maxWidth:"821px"}}>
          <div id="videoPlayer" >
            <VideoPlayer areNextVideos={props.FullLengthVideos.length > 0 ? true : false} NextVideos={props.FullLengthVideos}/>
          </div>
          {windowWidth < 990 ? (
            <>
              <SmallScreenVideoInfoCard
                Video={props.Video}
                user={props.user}
                videoId={props.videoId}
                CurrentUser={CurrentUser}
                currentState={currentState}
                NextVideos={props.nextVideos}
              />
            </>
          ) : (
            <>
              <div className="large-screen-fullVideoPage">
          
                <LargeScreenVideoInfoCard
                  Video={props.Video}
                  user={props.user}
                  videoId={props.videoId}
                  CurrentUser={CurrentUser}
                  currentState={currentState}
                />
               
              </div>
            </>
          )}
        </div>
  );
}

export default VideoInfoCard;
