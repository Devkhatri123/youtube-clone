import React, { useState, useEffect } from "react";
import { MdClosedCaptionOff } from "react-icons/md";
import { MdPause } from "react-icons/md";
import { IoMdPlay } from "react-icons/io";
import { MdSkipNext } from "react-icons/md";
import { IoVolumeMuteSharp } from "react-icons/io5";
import { VscUnmute } from "react-icons/vsc";
import { MdSkipPrevious } from "react-icons/md";
import { IoReloadOutline } from "react-icons/io5";
import { RxEnterFullScreen } from "react-icons/rx";
import { MdOutlineFullscreenExit } from "react-icons/md";
import { MdOutlineArrowBackIos } from "react-icons/md";
import { MdOutlinePictureInPictureAlt } from "react-icons/md";
import { GoGear } from "react-icons/go";
import { useRef } from "react";
import "../CSS/VideoPage.css";
import { onSnapshot, doc } from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import { useSearchParams } from "react-router-dom";
import ErrorPage from "./ErrorPage";
function VideoPlayer(props) {
  const LargeScreenVideoBelowControls = useRef();
  const volumeRangeRef = useRef();
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get("v");
  const videoRef = useRef();
  const ProgressBarWidth = useRef();
  let [reloadVideo, setreloadVideo] = useState(false);
  let [TotalVideoSeconds, setTotalVideoSeconds] = useState(0);
  let [TotalVideoMinutes, setTotalVideoMinutes] = useState(0);
  let [TotalVideoHours, setTotalVideoHours] = useState(0);
  let [isMute, setisMute] = useState(false);
  let [isPaused, setisPaused] = useState(true);
  let [Progress, setProgress] = useState(0);
  let [seconds, setseconds] = useState(0);
  let [minutes, setminutes] = useState(0);
  let [hours, sethours] = useState(0);
  const [videoWidth, setvideoWidth] = useState(null);
  const [videoHeight, setvideoHeight] = useState(null);
 let [Video, Setvideo] = useState(null);
  let [Loading, setLoading] = useState(true);
  const [Fullscreen, setFullscreen] = useState(false);
  const [Error, SetError] = useState(false);
  const [ErrorMessage, SetErrorMessage] = useState("");
  const [openPlaySpeedModal,setopenPlaySpeedModal] = useState(false);
  const [InitialvideoWidth,setInitialvideoWidth] = useState(null);
  const [InitialvideoHeight,setInitialvideoHeight] = useState(null);
  const FetchVideo = async () => {
    setLoading(true);
    try {
      if (videoId) {
        const VideoRef = doc(firestore, "videos", videoId);
        onSnapshot(VideoRef, async (videDoc) => {
          if (videDoc.exists()) {
            Setvideo(videDoc.data());
          }
        },(error)=>{
          SetErrorMessage(error.message);
          SetError(true);
         console.log(error.message)
        })
      }
    } catch (error) {
      console.log(error);
      SetError(true);
      SetErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setProgress(0);
    setvideoHeight(null);
    setvideoWidth(null)
    const myRange = document.getElementById("myRange");
    myRange.value = 0;
    FetchVideo();
    videoRef.current?.addEventListener("loadeddata", () => {
       LargeScreenVideoBelowControls.current.style.display = "none"
      if (videoRef.current?.readyState >= 3) {
        videoRef.current.play();
        videoRef.current.playsInline = true;
        videoRef.current.muted = false;
        LargeScreenVideoBelowControls.current.style.display = "block"
        volumeRangeRef.current.value = videoRef.current.volume * 100;
        setisMute(false);
        setisPaused(false);
      }
    });
  }, [videoId]);
  useEffect(()=>{
   if(videoRef.current){
    videoRef.current?.addEventListener("loadeddata", () => {
    setInitialvideoWidth(videoRef.current.videoWidth);
    setInitialvideoHeight(videoRef.current.videoHeight);
    })
   }
  },[videoRef,videoId,Video]);
  useEffect(() => {
    const currentVideo = videoRef.current;
    const video_section = document.getElementsByClassName("video_section")[0];
    if (currentVideo) {
      if (window.innerWidth < 507) {
        setvideoWidth(window.innerWidth);
        setvideoHeight(videoWidth * (9 / 16));
      } else if (window.innerWidth >= 507 && window.innerWidth < 990) {
        
        setvideoWidth("unset");
        setvideoHeight((window.innerWidth - 171) * (9 / 16));
        currentVideo.style.margin = "0 auto";
      } else if (window.innerWidth >= 990 && window.innerWidth <= 1115) {
        if(InitialvideoHeight > 480 && InitialvideoHeight < 720){
          
          setvideoWidth(640);
          setvideoHeight("unset");
          video_section.style.height =  "306px";
          LargeScreenVideoBelowControls.current.style.bottom = "-40px";
          
        }
        else if(InitialvideoHeight > 720 && InitialvideoHeight < 1080){
          setvideoWidth(window.innerWidth - 474);
          setvideoHeight((videoWidth / 2));
          video_section.style.height = videoHeight + "px";
          LargeScreenVideoBelowControls.current.style.bottom = "-40px";
        }else{
        setvideoWidth(640);
        setvideoHeight(360);
        }
        if(props.src){
          video_section.style.height = "320px";
          currentVideo.style.margin = "0 auto";
        } else  currentVideo.style.margin = "unset";
        currentVideo.style.margin = "unset";
      } else if (window.innerWidth > 1115 && window.innerWidth <= 1754) {
        if(InitialvideoHeight > 720 && InitialvideoHeight < 1080){
          setvideoWidth(window.innerWidth - 474);
          setvideoHeight((videoWidth / 2));
          video_section.style.height = videoHeight + "px";
          LargeScreenVideoBelowControls.current.style.bottom = "-37px";
          if(props.src){
            video_section.style.height = "320px";
            currentVideo.style.margin = "0 auto";
          } else  currentVideo.style.margin = "unset";
        }else{
          setvideoHeight(videoWidth * 0.5625);
          setvideoWidth(window.innerWidth - 474);
          LargeScreenVideoBelowControls.current.style.bottom = "-30px";
          if(props.src){
            video_section.style.height = "320px";
            currentVideo.style.margin = "0 auto";
          } else  currentVideo.style.margin = "unset";
          //  video_section.style.height = videoHeight + "px";
        }
      } else {
        if(InitialvideoHeight > 720 && InitialvideoHeight < 1080){
          setvideoWidth(1280);
          setvideoHeight(640);
          video_section.style.height = videoHeight + "px";
        }else{
          setvideoWidth(1280);
          setvideoHeight(720);
        }
          LargeScreenVideoBelowControls.current.style.bottom = "-57px";
      }
      const updateVideoSize = () => {
        if (currentVideo) {
          if (window.innerWidth < 507) {
            setvideoWidth(window.innerWidth);
            setvideoHeight(videoWidth * (9 / 16));
          } else if (window.innerWidth >= 507 && window.innerWidth < 990) {
            setvideoWidth("unset");
            setvideoHeight((window.innerWidth - 171) * (9 / 16));
            currentVideo.style.margin = "0 auto";
          } else if (window.innerWidth >= 990 && window.innerWidth <= 1115) {
            if(InitialvideoHeight > 480 && InitialvideoHeight < 720){
              setvideoWidth(640);
              setvideoHeight("unset");
              video_section.style.height =  "306px";
              LargeScreenVideoBelowControls.current.style.bottom = "-40px";
            }
            else if(InitialvideoHeight > 720 && InitialvideoHeight < 1080){
              setvideoWidth(window.innerWidth - 474);
              setvideoHeight((videoWidth / 2));
              video_section.style.height = videoHeight + "px";
              LargeScreenVideoBelowControls.current.style.bottom = "-40px";
            }else{
            setvideoWidth(640);
            setvideoHeight(360);
            }
            if(props.src){
              video_section.style.height = "320px";
              currentVideo.style.margin = "0 auto";
            } else  currentVideo.style.margin = "unset";
            currentVideo.style.margin = "unset";
          } else if (window.innerWidth > 1115 && window.innerWidth <= 1754) {
           
             if(InitialvideoHeight > 720 && InitialvideoHeight < 1080){
              setvideoWidth(window.innerWidth - 474);
              setvideoHeight((videoWidth / 2));
              video_section.style.height = videoHeight + "px";
              LargeScreenVideoBelowControls.current.style.bottom = "-37px";
              if(props.src){
                video_section.style.height = "320px";
                currentVideo.style.margin = "0 auto";
              } else  currentVideo.style.margin = "unset";
            }else{
              setvideoHeight(videoWidth * 0.5625);
              setvideoWidth(window.innerWidth - 474);
              LargeScreenVideoBelowControls.current.style.bottom = "-30px";
              if(props.src){
                video_section.style.height = "320px";
                currentVideo.style.margin = "0 auto";
              } else  currentVideo.style.margin = "unset";
              //  video_section.style.height = videoHeight + "px";
            }
          }else {
            if(InitialvideoHeight > 720 && InitialvideoHeight < 1080){
              setvideoWidth(1280);
              setvideoHeight(640);
              video_section.style.height = videoHeight + "px";
            }else{
          setvideoWidth(1280);
          setvideoHeight(720);
            }
          LargeScreenVideoBelowControls.current.style.bttom = "-57px";
          }
          // setvideoWidth(window.innerWidth - 171);
        }
      window.addEventListener("resize", updateVideoSize);

      return () => {
        window.removeEventListener("resize", updateVideoSize);
       };
    }
    }
  }, [videoWidth, videoHeight,videoId,InitialvideoHeight,InitialvideoWidth]);

  const TotalTime = (e) => {
    const duration = e.target.duration;
    setTotalVideoSeconds(Math.floor(duration % 60));
    setTotalVideoMinutes(Math.floor(duration / 60) % 60);
    setTotalVideoHours(Math.floor(duration / 3600));
  };
  const HandlePlayPause = () => {
    setisPaused(!isPaused);
    if (isPaused) videoRef.current.play();
    else videoRef.current.pause();
  };

  const HandlProgress = (e) => {
    const duration = e.target.currentTime;
    setProgress(Math.floor((e.target.currentTime / e.target.duration) * 100));
    setseconds(Math.floor(duration % 60));
    setminutes(Math.floor(duration / 60) % 60);
    sethours(Math.floor(duration / 3600));
    ProgressBarWidth.current.value = Progress;
    if (Progress < 100 && duration === e.target.duration) {
      ProgressBarWidth.current.value = Progress + 1;
    }
    if (duration === e.target.duration) {
      setisPaused(true);
      setreloadVideo(true);
    } else {
      setreloadVideo(false);
    }
  };
  const HandleFullScreen = () => {
    const wrapper = document.getElementById("wrapper");
    wrapper.requestFullscreen();
    setFullscreen(true);
  };
useEffect(()=>{
  const wrapper = document.getElementById("wrapper");
  if(Fullscreen){
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.justifyContent = "center";
    videoRef.current.style.width = "-webkit-fill-available !important";
    videoRef.current.style.height = "unset !important";
    videoRef.current.style.borderRadius = "0 !important";
    }else{
      videoRef.current.style.width = videoWidth + "px";
      videoRef.current.style.height = `${videoHeight+"px !important"}`;
    }
},[Fullscreen])
  const ChangeVideoDuration = (e) => {
    try{
    videoRef.current.currentTime = e.target.value * (videoRef.current.duration / 100);
    }catch(error){
      console.log(error.message);
      SetError(true);
      SetErrorMessage(error.message)
    }
  };
  const HandleMuteUnmute = () => {
    if (videoRef.current.muted) {
      videoRef.current.muted = false;
      setisMute(false);
    } else {
      videoRef.current.muted = true;
      setisMute(true);
    }
  };
  const ReloadVideo = () => {
    setisPaused(false);
    videoRef.current.play();
  };
  const ExitFullscreen = () => {
    const wrapper = document.getElementById("wrapper");
    const currentVideo = document.getElementById("currentVideo");
    if(document.fullscreenEnabled){
    document.exitFullscreen();
    wrapper.style.display = "unset";
    wrapper.style.flexDirection = "unset";
    wrapper.style.justifyContent = "unset";
    currentVideo.style.width = videoWidth  + "px";
    currentVideo.style.height = `${videoHeight+"px !important"}`;
    // currentVideo.style.borderRadius = "12px";
    }setFullscreen(false);
  };
  const showVolumeRange = () => {
    volumeRangeRef.current.style.display = "block";
  };
  const HideVolumeRange = () => {
    volumeRangeRef.current.style.display = "none";
  };
  const changeVideoVolume = (e) => {
    const newVolume = parseFloat((e.target.value / 100).toFixed(1));
    videoRef.current.volume = newVolume;
  }
  const changePlaySpeed = (speedRate) => {
    videoRef.current.playbackRate = speedRate;
    setopenPlaySpeedModal(false);
  }
  useEffect(()=>{
  if(openPlaySpeedModal) document.body.style.overflow = "hidden";
  else document.body.style.overflow = "unset";
  },[openPlaySpeedModal])

  return !Error || !ErrorMessage ? ( 
    <div
      className="video_section"
      style={!props.src ? { width: videoWidth,height:videoHeight }: {height:"320px !important"}
      }
    >
      <div className="video_top_controls">
       {isMute ? (
          <IoVolumeMuteSharp onClick={HandleMuteUnmute} />
        ) : (
          <VscUnmute onClick={HandleMuteUnmute} />
        )}
      </div>
      <div id="wrapper">
        {Fullscreen && <div id="fullscreenDiv"><h1 className="fullscreenVideoTitle">{Video.Title}</h1></div>}
        {props.src ? (
          <video
            src={props.src}
            poster={props.poster ? props.poster : null}
            onLoadedData={TotalTime}
            onTimeUpdate={HandlProgress}
            ref={videoRef}
            id="currentVideo"
            style={{ height: "320px",margin:" 0 auto !important" }}
          />
        ) : (
          <div className="videoContainer">
            <video
              src={Video?.videoURL}
              poster={Video?.Thumbnail}
              onLoadedData={TotalTime}
              onTimeUpdate={HandlProgress}
              ref={videoRef}
              id="currentVideo"
              controls={false}
              autoPlay
              playsInline
               preload="yes"
              type="video/mp4"
              muted
              style={
               { width: !Fullscreen ? videoWidth : "100%", height: videoHeight }
                }
            />
          </div>
        )}
        <div className="middle_controls">
          <div>
            {reloadVideo ? (
              <IoReloadOutline onClick={ReloadVideo} />
            ) : isPaused ? (
              <IoMdPlay onClick={HandlePlayPause} />
            ) : (
              <MdPause onClick={HandlePlayPause} />
            )}
          </div>
        </div>
        <div className="below_controls">
          <div className="small-screen-videoplayer-below_controls">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <p>
                <span>{minutes + ":" + seconds.toString().padStart(2, 0)}</span>{" "}
                /{" "}
                <span>
                  {TotalVideoHours !== 0
                    ? TotalVideoHours +
                      ":" +
                      TotalVideoMinutes +
                      ":" +
                      TotalVideoSeconds.toString().padStart(2, 0)
                    : TotalVideoMinutes +
                      ":" +
                      TotalVideoSeconds.toString().padStart(2, 0)}
                </span>
              </p>
              {!props.src && (
              !Fullscreen ? (
                <RxEnterFullScreen onClick={HandleFullScreen} />
              ) : (
                <MdOutlineFullscreenExit onClick={ExitFullscreen} />
              )
            )}
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={Progress}
              ref={ProgressBarWidth}
              style={{ width: "100%",accentColor:"red" }}
              onChange={ChangeVideoDuration}
              id="myRange"
            />
          </div>
        </div>
        <div
          className="large-screen-video-below-controls"
         ref={LargeScreenVideoBelowControls}
         style={{bottom:Fullscreen? "-30px":null}}
        >
           {openPlaySpeedModal && (
        <>
        <div className="playBackSpeedModal">
          <div className="playBackSpeedModalHeader">
            <div>
            <MdOutlineArrowBackIos onClick={()=>setopenPlaySpeedModal(false)}/>
            <p>Playback Speed</p>
            </div>
           </div>
          <div className="options">
            <p onClick={()=>changePlaySpeed(0.25)}>0.25</p>
            <p onClick={()=>changePlaySpeed(0.5)}>0.5</p>
            <p onClick={()=>changePlaySpeed(0.75)}>0.75</p>
            <p onClick={()=>changePlaySpeed(1)}>Normal Speed</p>
            <p onClick={()=>changePlaySpeed(1.25)}>1.25</p>
            <p onClick={()=>changePlaySpeed(1.5)}>1.5</p>
            <p onClick={()=>changePlaySpeed(1.75)}>1.75</p>
            <p onClick={()=>changePlaySpeed(2)}>2</p>
          </div>
        </div>
        </>
        )}
          <input
            type="range"
            min={0}
            max={100}
            value={Progress}
            ref={ProgressBarWidth}
            style={{ width: "100%" }}
            onChange={ChangeVideoDuration}
            id="myRange"
          />
          <div className="bottom-toggle-buttons">
            <div
              className="bottom-toggle-buttons-left"
              onMouseLeave={HideVolumeRange}
            >
              {isPaused ? (
                <IoMdPlay onClick={HandlePlayPause} />
              ) : (
                <MdPause onClick={HandlePlayPause} />
              )}
              {isMute ? (
                <IoVolumeMuteSharp
                  onClick={HandleMuteUnmute}
                  onMouseEnter={showVolumeRange}
                />
              ) : (
                <VscUnmute
                  onClick={HandleMuteUnmute}
                  onMouseEnter={showVolumeRange}
                />
              )}
              <input
                type="range"
                name=""
                id="volume-range"
                min={0}
                max={100}
                step={1}
                ref={volumeRangeRef}
                style={{ display: "none",width:props.src && '30%'}}
                onChange={changeVideoVolume}
              />
              <p style={{ width: "110px", textAlign: "center" }}>
                <span>{minutes + ":" + seconds.toString().padStart(2, 0)}</span>{" "}
                /{" "}
                <span>
                  {TotalVideoHours !== 0
                    ? TotalVideoHours +
                      ":" +
                      TotalVideoMinutes +
                      ":" +
                      TotalVideoSeconds.toString().padStart(2, 0)
                    : TotalVideoMinutes +
                      ":" +
                      TotalVideoSeconds.toString().padStart(2, 0)}
                </span>
              </p>
            </div>
            {!props.src && (
            <div className="bottom-toggle-buttons-right">
              <GoGear onClick={()=>setopenPlaySpeedModal(true)}/>
              {!Fullscreen ? (
                <RxEnterFullScreen onClick={HandleFullScreen} />
              ) : (
                <MdOutlineFullscreenExit onClick={ExitFullscreen} />
              )}
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  ):<ErrorPage ErrorMessage={ErrorMessage}/>
}

export default VideoPlayer;