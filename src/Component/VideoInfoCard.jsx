import React, { useState, useEffect, useContext } from "react";
import VideoPlayer from "./VideoPlayer";
import { firestore, auth } from "../firebase/firebase";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import "../CSS/VideoPage.css";
import { CurrentState } from "../Context/HidevideoinfoCard";
import SmallScreenVideoInfoCard from "./SmallScreenVideoInfoCard";
import LargeScreenVideoInfoCard from "./LargeScreenVideoInfoCard";
import { useSearchParams } from "react-router-dom";
import VideoPageLoadingScreen from "./VideoPageLoadingScreen";
import NextVideosLoadingComponent from "./NextVideosLoadingComponent";
import Largescreencomponent from "./Largescreencomponent";
import Smallscreencomponent from "./Smallscreencomponent";
function VideoInfoCard() {
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get('v');
  const [NextVideosLoading,setNextVideosLoading] = useState(true);
  const currentState = useContext(CurrentState);
  let [Video, Setvideo] = useState();
  let [NextVideos, setNextVideos] = useState([]);
  let [user, setUser] = useState();
  const [videos, setvideos] = useState([]);
  let [Loading, setLoading] = useState(true);
  const [Error, SetError] = useState(false);
  const [ErrorMessage, SetErrorMessage] = useState("");
  const [CurrentUser, setCurrentUser] = useState(null);
  const [windowWidth, setwindowWidth] = useState(window.innerWidth);
  const [FullLengthVideos, setFullLengthVideos] = useState([]);
  const [ShortVideos, SetShortVideos] = useState([]);
  const [CalculatedscreenWidth, setCalculatedscreenWidth] = useState(null);
  const [TotalScreenWidth, setTotalScreenWidth] = useState(null);
  const [nextVideosPortionWidth, setnextVideosPortionWidth] = useState(null);
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
  const FetchVideo = async () => {
    setLoading(true);
    try {
      const VideoRef = doc(firestore, "videos", videoId);
      // const video = await getDoc(videoRef);
      onSnapshot(VideoRef, async (videDoc) => {
        if (videDoc.exists()) {
          Setvideo(videDoc.data());
          const userRef = doc(firestore, "users", videDoc.data().createdBy);
          //const User = await getDoc(userRef);
          onSnapshot(userRef, (userDoc) => {
            if (userDoc.exists()) {
              setUser(userDoc.data());
            }
          });
        }
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
      SetError(true);
      SetErrorMessage(error.message);
    } 
  };

  useEffect(() => {
    FetchVideo();
  }, [videoId]);
  useEffect(() => {
    setNextVideosLoading(true);
    try{
    // Fetching next Videos to play
    onSnapshot(collection(firestore, "videos"), (snapShot) => {
      const FetchedVideos = Promise.all(
        snapShot.docs.map(async (Doc) => {
          const userRef = doc(firestore, "users", Doc.data().createdBy);
          const userDoc = await getDoc(userRef);
          return {
            id: Doc.id,
            Videodata: Doc.data(),
            UserData: userDoc.data(),
          };
        })
      );
      FetchedVideos.then((FetchedVideos) => {
        setNextVideos(FetchedVideos);
      });
    });
    setNextVideosLoading(false);
  }catch(error){
    console.log(error);
  }
  }, [videoId]);
  useEffect(() => {
    onSnapshot(collection(firestore, "videos"), async (snapshot) => {
      const FetchedData = await Promise.all(
        snapshot.docs.map(async (Doc) => {
          const userRef = doc(firestore, "users", Doc.data().createdBy);
          const docSnap = await getDoc(userRef);
          return {
            id: Doc.id,
            Videodata: Doc.data(),
            UserData: docSnap.data(),
          };
        })
      );
      setvideos(FetchedData);
    });
  }, [videoId]);
  useEffect(() => {
    setFullLengthVideos(
      videos?.filter((FullLengthVideo) => {
        if (videoId) {
          return (
            !FullLengthVideo.Videodata.shortVideo &&
            videoId !== FullLengthVideo.id
          );
        } else {
          return !FullLengthVideo.Videodata.shortVideo;
        }
      })
    );
    SetShortVideos(
      videos?.filter((shortVideo) => {
        return shortVideo.Videodata.shortVideo === true;
      })
    );
  }, [videos, videoId]);

  useEffect(() => {
    const videoPlayer = document.getElementById("videoPlayer");
    const video = document.createElement('video');
    video.src = Video?.videoURL;
    video.addEventListener("loadeddata",()=>{
      console.log("Testing videoHeight : " + video.videoHeight);
    if (window.innerWidth >= 990 && window.innerWidth <= 1115) {
      if(video.videoHeight > 720 && video.videoHeight < 1080){
        setCalculatedscreenWidth(window.innerWidth - 474);
        videoPlayer.style.height = CalculatedscreenWidth / 2  + "px";
        setnextVideosPortionWidth(466);
       }else{
       setCalculatedscreenWidth(640);
       setnextVideosPortionWidth(window.innerWidth - 664);
      }
      setTotalScreenWidth(0);
    } else if (window.innerWidth > 1115 && window.innerWidth <= 1754) {
      setCalculatedscreenWidth(window.innerWidth - 474);
      if(video.videoHeight > 720 && video.videoHeight < 1080){
        videoPlayer.style.height = CalculatedscreenWidth / 2  + "px";
      }
      setnextVideosPortionWidth(403);
      setTotalScreenWidth(0);
    } else if (window.innerWidth > 1754 && window.innerWidth < 2000) {
      if(video.videoHeight > 720 && video.videoHeight < 1080){
        setCalculatedscreenWidth(1280);
        setnextVideosPortionWidth(415);
      }else{
      setCalculatedscreenWidth(1225);
      setnextVideosPortionWidth(window.innerWidth - 1304);
      }
    } else if (window.innerWidth >= 2000) {
      setCalculatedscreenWidth(1225);
      setnextVideosPortionWidth(window.innerWidth - 1558);
    }
    const updateVideoSize = () => {
      if (window.innerWidth >= 990 && window.innerWidth <= 1115) {
        if(video.videoHeight > 720 && video.videoHeight < 1080){
          setCalculatedscreenWidth(window.innerWidth - 474);
          videoPlayer.style.height = CalculatedscreenWidth / 2  + "px";
          setnextVideosPortionWidth(466);
         }else{
         setCalculatedscreenWidth(640);
         setnextVideosPortionWidth(window.innerWidth - 664);
         
        }
        setTotalScreenWidth(0);
      } else if (window.innerWidth >= 990 && window.innerWidth < 1754) {
        setCalculatedscreenWidth(window.innerWidth - 474);
        if(video.videoHeight > 720 && video.videoHeight < 1080){
          videoPlayer.style.height = CalculatedscreenWidth / 2  + "px";
        }
        setnextVideosPortionWidth(403);
        setTotalScreenWidth(0);
      } else if (window.innerWidth >= 1754 && window.innerWidth < 2000) {
        if(video.videoHeight > 720 && video.videoHeight < 1080){
          setCalculatedscreenWidth(1280);
          setnextVideosPortionWidth(415);
        }else{
        setCalculatedscreenWidth(1225);
        setnextVideosPortionWidth(window.innerWidth - 1304);
        }
      } else if (window.innerWidth >= 2000) {
        setCalculatedscreenWidth(1225);
        setnextVideosPortionWidth(window.innerWidth - 1558);
      }
    };
    window.addEventListener("resize", updateVideoSize);
    return () => {
      window.removeEventListener("resize", updateVideoSize);
    };
  })
  }, [CalculatedscreenWidth, TotalScreenWidth, nextVideosPortionWidth,Video,videoId]);

  return !Loading ? (
    !Error ? (
      <div className="fullVideoPage" style={FullLengthVideos.length > 0?{ width: CalculatedscreenWidth }:{width:"100%",left:"0",right:"0",margin:"0 auto",maxWidth:"821px"}}>
          <div id="videoPlayer" >
            <VideoPlayer areNextVideos={FullLengthVideos.length > 0 ? true : false} NextVideos={FullLengthVideos}/>
          </div>
          {windowWidth < 990 ? (
            <>
              <SmallScreenVideoInfoCard
                Video={Video}
                user={user}
                videoId={videoId}
                CurrentUser={CurrentUser}
                currentState={currentState}
                NextVideos={NextVideos}
              />
            </>
          ) : (
            <>
              <div className="large-screen-fullVideoPage">
          
                <LargeScreenVideoInfoCard
                  Video={Video}
                  user={user}
                  videoId={videoId}
                  CurrentUser={CurrentUser}
                  currentState={currentState}
                />
                 {!NextVideosLoading ? (
                    FullLengthVideos.length > 0 && (
                      <div
                        className="Next_videos"
                        style={{ width: nextVideosPortionWidth }}
                      >
                        <Smallscreencomponent
                          FullLengthVideos={FullLengthVideos}
                          shortVideos={ShortVideos}
                        />
                      </div>
                    )
                  ) : (
                   <NextVideosLoadingComponent/>
                  )}
               
              </div>
            </>
          )}
        </div>
    ) : (
      <p
        style={{
          height: "50vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
        }}
      >
       {ErrorMessage}
      </p>
    )
  ) : (
    <VideoPageLoadingScreen/>
  );
}

export default VideoInfoCard;
