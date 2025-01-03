/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import VideoInfoCard from "./VideoInfoCard";
import "../CSS/VideoPage.css";
import { firestore } from "../firebase/firebase";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { useSearchParams } from "react-router-dom";
import Smallscreencomponent from "./Smallscreencomponent";
import ErrorPage from "./ErrorPage";
function VideoPage() {
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get('v');
  const [FullLengthVideos, setFullLengthVideos] = useState([]);
  const [ShortVideos, SetShortVideos] = useState([]);
  const [videos,setvideos] = useState([]);
  let [user, setUser] = useState();
  const [Video,Setvideo] = useState();
  const [Loading,setLoading] = useState(false);
  const [Error,SetError] = useSearchParams(false);
  const [ErrorMessage,SetErrorMessage] = useState('');
  const [CalculatedscreenWidth, setCalculatedscreenWidth] = useState(null);
  const [TotalScreenWidth, setTotalScreenWidth] = useState(null);
  const [nextVideosPortionWidth, setnextVideosPortionWidth] = useState(null);
  const [videoPlayerHeight,setvideoPlayerHeight] = useState(null)
  const [NextVideosLoading,setNextVideosLoading] = useState(true);
  const FetchVideo = async () => {
    setLoading(true);
    try {
      const VideoRef = doc(firestore, "videos", videoId);
          onSnapshot(VideoRef, async (videDoc) => {
        if (videDoc.exists()) {
          Setvideo(videDoc.data());
          const userRef = doc(firestore, "users", videDoc.data().createdBy);
          onSnapshot(userRef, (userDoc) => {
            if (userDoc.exists()) {
              setUser(userDoc.data());
            }
          });
        }else{
          SetError(true);
          SetErrorMessage("Video not found")
        }
      },(error)=>{
        SetError(true);
        SetErrorMessage("Some Error Occured")
      }
    );
      setLoading(false);
    } catch (error) {
      console.log(error);
      SetError(true);
      SetErrorMessage(error.message);
    } 
  };

  useEffect(() => {
    FetchVideo();
    setCalculatedscreenWidth(null);
    setvideoPlayerHeight(null);
  }, [videoId]);

  useEffect(() => {
    setNextVideosLoading(true);
    try{
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
        },(error)=>{
          SetError(true);
          SetErrorMessage(error.message)
        })
      );
      setvideos(FetchedData);
    });
  }catch(error){
    console.log(error.message);
    SetError(true);
    SetErrorMessage(error.message)
  }finally{ setNextVideosLoading(false)}
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
    const video = document.createElement('video');
    video.src = Video?.videoURL;
    video.addEventListener("loadeddata",()=>{
      if(window.innerWidth < 990){
        setCalculatedscreenWidth("unset");
       }else if (window.innerWidth >= 990 && window.innerWidth <= 1115) {
      if(video.videoHeight > 720 && video.videoHeight < 1080){
        setCalculatedscreenWidth(window.innerWidth - 474);
        setvideoPlayerHeight(CalculatedscreenWidth / 2)
        setnextVideosPortionWidth(window.innerWidth-581);
       }else{
       setCalculatedscreenWidth(640);
       setnextVideosPortionWidth(window.innerWidth - 664);
      }
      setTotalScreenWidth(0);
    } else if (window.innerWidth > 1115 && window.innerWidth <= 1754) {
      setCalculatedscreenWidth(window.innerWidth - 474);
      if(video.videoHeight > 720 && video.videoHeight < 1080){
        setvideoPlayerHeight(CalculatedscreenWidth / 2)
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
      setCalculatedscreenWidth(1291);
      setnextVideosPortionWidth(window.innerWidth - 1558);
    }
    const updateVideoSize = () => {
      if(window.innerWidth < 990){
        setCalculatedscreenWidth("unset");
      }else if (window.innerWidth >= 990 && window.innerWidth <= 1115) {
        if(video.videoHeight > 720 && video.videoHeight < 1080){
          setCalculatedscreenWidth(window.innerWidth - 474);
          setvideoPlayerHeight(CalculatedscreenWidth / 2)
          setnextVideosPortionWidth(window.innerWidth-581);
         }else{
         setCalculatedscreenWidth(640);
         setnextVideosPortionWidth(window.innerWidth - 664);
         
        }
        setTotalScreenWidth(0);
      } else if (window.innerWidth > 1115 && window.innerWidth < 1754) {
        setCalculatedscreenWidth(window.innerWidth - 474);
        if(video.videoHeight > 720 && video.videoHeight < 1080){
          setvideoPlayerHeight(CalculatedscreenWidth / 2)
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
        setCalculatedscreenWidth(1291);
        setnextVideosPortionWidth(window.innerWidth - 1558);
      }
    };
    window.addEventListener("resize", updateVideoSize);
    return () => {
      window.removeEventListener("resize", updateVideoSize);
    };
  })
  }, [CalculatedscreenWidth, nextVideosPortionWidth,Video?.videoURL]);

  return !ErrorMessage || !Error ?(
    !Loading ? (
    <div className="greaterthan-2000px-screen-div">
    <VideoInfoCard CalculatedscreenWidth={CalculatedscreenWidth} NextVideos={FullLengthVideos} videoId={videoId} nextVideos={videos}
    Video={Video}
    user={user}
    FullLengthVideos={FullLengthVideos}
    videoPlayerHeight={videoPlayerHeight}
   />
   {!NextVideosLoading ? (
    <div className="Next_videos"  style={FullLengthVideos.length >0?{ width: nextVideosPortionWidth }:{display:"none"}}>
                        <Smallscreencomponent
                          FullLengthVideos={FullLengthVideos}
                          shortVideos={ShortVideos}
                        />
                      </div>
                      ):<p>Loading</p>}
      </div>
    ):<p style={{display:"flex",justifyContent:"center",alignContent:"center",height:"100vh"}}>Loading</p>
   ):<ErrorPage ErrorMessage={ErrorMessage}/>
}

export default VideoPage;
