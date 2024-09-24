import React,{useState,useEffect} from 'react'
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
import { useRef } from 'react';
import "../CSS/VideoPage.css";
import { onSnapshot,doc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import { useNavigate, useParams } from 'react-router';
import { createSearchParams, useSearchParams } from 'react-router-dom';
function VideoPlayer(props) {
  const LargeScreenVideoBelowControls = useRef();
  const volumeRangeRef = useRef();
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get('v');
  const videoRef = useRef();
  const parentProgressBarRef = useRef();
  const ProgressBarWidth = useRef();
  let [reloadVideo,setreloadVideo] = useState(false);
  let [TotalVideoSeconds, setTotalVideoSeconds] = useState(0);
  let [TotalVideoMinutes, setTotalVideoMinutes] = useState(0);
  let [TotalVideoHours, setTotalVideoHours] = useState(0);
  let [isMute,setisMute] = useState(false);
  const [FullScreenWidth,setFullScreenWidth] = useState();
  let [isPaused, setisPaused] = useState(true);
  let [Duration, setDuration] = useState(0);
  let [Progress, setProgress] = useState(0);
  let [seconds, setseconds] = useState(0);
  let [minutes, setminutes] = useState(0);
  let [hours, sethours] = useState(0);
  const [videoWidth,setvideoWidth] = useState();
  const [videoHeight,setvideoHeight] = useState();
  let [Video, Setvideo] = useState(null);
  let [Loading, setLoading] = useState(true);
  const [Fullscreen,setFullscreen] = useState(false);
  const [Error,SetError] = useState(false);
  const [ErrorMessage,SetErrorMessage] = useState('');
  const FetchVideo = async () => {
    setLoading(true);
    try {
        if(videoId){
      const VideoRef = doc(firestore, "videos", videoId);
      // const video = await getDoc(videoRef);
       onSnapshot(VideoRef,async(videDoc)=>{
      if (videDoc.exists()) {
        Setvideo(videDoc.data());
      }
   })
}
    } catch (error) {
      console.log(error);
      SetError(true);
      SetErrorMessage(error.message);
    } finally {
        setLoading(false)
    }
  };
  useEffect(()=>{
    setProgress(0);
    LargeScreenVideoBelowControls.current.style.display = "none";
    const myRange = document.getElementById("myRange");
    myRange.value = 0;
    //  ProgressBarWidth.current.value = 0;
   FetchVideo()
    videoRef.current?.addEventListener("loadeddata",()=>{
    if(videoRef.current?.readyState >= 3){
      videoRef.current.play();
      LargeScreenVideoBelowControls.current.style.display = "block";
      videoRef.current.muted = false;
      volumeRangeRef.current.value = (videoRef.current.volume * 100);
      setisMute(false);
      setisPaused(false);
    }
   })
   },[videoId])

   useEffect(()=>{
    const currentVideo = videoRef.current;
    if(currentVideo){
    if(window.innerWidth < 507){
      setvideoWidth(window.innerWidth);
      setvideoHeight(videoWidth * (9/16));
    }else if (window.innerWidth >= 507 && window.innerWidth < 990){
    setvideoWidth(window.innerWidth - 171);
    setvideoHeight(videoWidth * (9/16));
    currentVideo.style.margin = '0 auto';
    }else if (window.innerWidth >= 990 && window.innerWidth <= 1115){
      setvideoWidth(640);     
       setvideoHeight(360);
       currentVideo.style.margin = 'unset';
    }else if (window.innerWidth > 1115 && window.innerWidth <= 1745){
      setvideoWidth(window.innerWidth - 530);     
      currentVideo.style.margin = 'unset';
      setvideoHeight(videoWidth * 0.5625);
    }else {
      setvideoWidth(1225);     
      setvideoHeight(688);
    }
    setFullScreenWidth(window.innerWidth)
     const updateVideoSize = () => {
      setFullScreenWidth(window.innerWidth)
      if (currentVideo) {
        if(window.innerWidth < 507){
          setvideoWidth(window.innerWidth);
          setvideoHeight(videoWidth * (9/16));
        }else if (window.innerWidth >= 507 && window.innerWidth < 990){
        setvideoWidth(window.innerWidth - 171);
        setvideoHeight(videoWidth * (9/16));
        currentVideo.style.margin = '0 auto';
        }else if (window.innerWidth >= 990 && window.innerWidth <= 1115){
          setvideoWidth(640);
           setvideoHeight(360);
           currentVideo.style.margin = 'unset';
        }else if (window.innerWidth > 1115 && window.innerWidth <= 1745){
          setvideoWidth(window.innerWidth - 530);         
          currentVideo.style.margin = 'unset';
          setvideoHeight(videoWidth * 0.5625);
        }else {
          setvideoWidth(1225);         
          setvideoHeight(688);
        }
        // setvideoWidth(window.innerWidth - 171);
      }
    
    }
     window.addEventListener('resize', updateVideoSize);

    return () => {
      window.removeEventListener('resize', updateVideoSize);
      // setvideoWidth(0);
      // setvideoHeight(0);
    };
  }
   },[videoWidth,videoHeight])

  const TotalTime = (e) => {
    const duration = e.target.duration;
    setDuration(Math.floor(e.target.duration));
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
    if(Progress < 100 && duration === e.target.duration){
      ProgressBarWidth.current.value = Progress + 1;
      setProgress(100);
    }
    if(duration === e.target.duration) {
      setisPaused(true);
     setreloadVideo(true);
    }else{
      setreloadVideo(false);
    }
  };
  const HandleFullScreen = () => {
  const wrapper = document.getElementById("wrapper");
  const currentVideo = document.getElementById("currentVideo");
      wrapper.requestFullscreen();
      setFullscreen(true);
    wrapper.style.display="flex";
    wrapper.style.flexDirection="column";
    wrapper.style.justifyContent="center";
    currentVideo.style.width = "-webkit-fill-available !important";
    currentVideo.style.height = "unset !important";
    currentVideo.style.borderRadius="0 !important";
   };
 
 
  const ChangeVideoDuration = (e) => {
     videoRef.current.currentTime = e.target.value * (videoRef.current.duration / 100);
  }
  const HandleMuteUnmute = () => {
    if(videoRef.current.muted){
      videoRef.current.muted = false;
      setisMute(false);
    }else{
    videoRef.current.muted = true;
    setisMute(true);
    }
   }
   const ReloadVideo = () => {
    setisPaused(false);
    videoRef.current.play();
   }
   const ExitFullscreen = () => {
    const wrapper = document.getElementById("wrapper");
    const currentVideo = document.getElementById("currentVideo");
    document.exitFullscreen();
    setFullscreen(false);
    wrapper.style.display="unset";
    wrapper.style.flexDirection="unset";
    wrapper.style.justifyContent="unset";
    currentVideo.style.width = videoWidth;
    currentVideo.style.height = videoHeight;
    currentVideo.style.borderRadius="12px";
   }
  const showVolumeRange = () => {
    volumeRangeRef.current.style.display = "block"
  }
  const HideVolumeRange = () => {
    volumeRangeRef.current.style.display = "none"
  }
  const changeVideoVolume = (e) => {
    const newVolume = parseFloat((e.target.value / 100).toFixed(1));
    videoRef.current.volume = newVolume;
    console.log(videoRef.current.volume);
    console.log(newVolume);
  }
   document.onkeydown = (e) => {
    let second = 0;
    if(e.key === "ArrowRight"){
      second = 5
      videoRef.current.currentTime += second;
      second = 0;
    }else if (e.key === "ArrowLeft"){
      second = 5
      videoRef.current.currentTime -= second;
      second = 0;
    }
    console.log(e)
   } 
  return  (
    <div className="video_section" style={window.innerWidth>1040 && props.areNextVideos && !props.src ?{width:videoWidth}:null}>
              <div className="video_top_controls">
                <MdClosedCaptionOff />
                {isMute ? <IoVolumeMuteSharp onClick={HandleMuteUnmute}/>:<VscUnmute  onClick={HandleMuteUnmute}/>}
              </div>
             <div  id='wrapper'>
              {props.src ? <video
                src={props.src}
                poster={props.poster?props.poster:null}
                onLoadedData={TotalTime}
                onTimeUpdate={HandlProgress}
                ref={videoRef}
                id="currentVideo"
                // style={{width:videoWidth,height:videoHeight}}
              />:
              <div className='videoContainer'>
              <video
              src={Video?.videoURL}
              poster={Video?.Thumbnail}
              onLoadedData={TotalTime}
              onTimeUpdate={HandlProgress}
              
              ref={videoRef}
              id="currentVideo"
              controls = {false}
             style={!Fullscreen && props.areNextVideos ? {width:videoWidth}:null}
            />
           </div>
           }
              <div className="middle_controls">
                <div>
                  <MdSkipPrevious />
                  {reloadVideo?(
                      <IoReloadOutline onClick={ReloadVideo}/>
                  ):(
                    isPaused ? <IoMdPlay onClick={HandlePlayPause} />:<MdPause onClick={HandlePlayPause} />
                  )}
                  <MdSkipNext />
                </div>
              </div>
              <div className="below_controls">
            <div className='small-screen-videoplayer-below_controls'>
              <div style={{display:"flex",alignItems:"center",width:"100%",justifyContent:"space-between"}}>
                  <p>
                    <span>
                      {minutes + ":" + seconds.toString().padStart(2, 0)}
                    </span>{" "}
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
                  {!Fullscreen ? <RxEnterFullScreen onClick={HandleFullScreen} />:<MdOutlineFullscreenExit onClick={ExitFullscreen}/>}
                  </div>
                  <input type="range" min={0} max={100} ref={ProgressBarWidth}  style={{width:"100%"}} onChange={ChangeVideoDuration} id='myRange'/>
                </div>
                </div>
        <div className="large-screen-video-below-controls"  style={{bottom:"-22px"}} ref={LargeScreenVideoBelowControls}>
        
                <input type="range" min={0} max={100} value={Progress} ref={ProgressBarWidth} style={{width:"100%"}} onChange={ChangeVideoDuration} id='myRange' step={1}/>
                <div className='bottom-toggle-buttons'>
               
                  <div className='bottom-toggle-buttons-left' onMouseLeave={HideVolumeRange}>
                    { isPaused ? <IoMdPlay onClick={HandlePlayPause} />:<MdPause onClick={HandlePlayPause} />}
                    {isMute ? <IoVolumeMuteSharp onClick={HandleMuteUnmute} onMouseEnter={showVolumeRange} />:<VscUnmute  onClick={HandleMuteUnmute} onMouseEnter={showVolumeRange} />}
                      <input type="range" name="" id="volume-range" min={0} max={100} step={1} ref={volumeRangeRef} style={{display:"none"}} onChange={changeVideoVolume}/>
                  <p style={{width:"110px",textAlign:"center"}}>
                      <span>{minutes + ":" + seconds.toString().padStart(2, 0)}</span>{" "} /{" "}
                      <span>{TotalVideoHours !== 0 ? TotalVideoHours +":" + TotalVideoMinutes +":" +TotalVideoSeconds.toString().padStart(2, 0): TotalVideoMinutes +":" +TotalVideoSeconds.toString().padStart(2, 0)}</span>
                   </p>
                   </div>
                   <div className='bottom-toggle-buttons-right'>
                  {!Fullscreen ? <RxEnterFullScreen onClick={HandleFullScreen} />:<MdOutlineFullscreenExit onClick={ExitFullscreen}/>}
                  </div>
                  </div>
                  </div>
                  </div>
                  </div>
  )
}

export default VideoPlayer
