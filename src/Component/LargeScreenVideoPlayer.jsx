import React,{useState,useEffect} from 'react'
import { useRef } from 'react';
import { useParams } from 'react-router';
import { MdClosedCaptionOff } from "react-icons/md";
import { BiSolidCaptions } from "react-icons/bi";
import { MdPause } from "react-icons/md";
import { IoMdPlay } from "react-icons/io";
import { MdSkipNext } from "react-icons/md";
import { IoVolumeMuteSharp } from "react-icons/io5";
import { VscUnmute } from "react-icons/vsc";
import { MdSkipPrevious } from "react-icons/md";
import { IoReloadOutline } from "react-icons/io5";
import { RxEnterFullScreen } from "react-icons/rx";
import "../CSS/VideoPage.css";
import { onSnapshot,doc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
function LargeScreenVideoPlayer() {
    const params = useParams();
    const videoRef = useRef();
    const parentProgressBarRef = useRef();
    const ProgressBarWidth = useRef();
    let [reloadVideo,setreloadVideo] = useState(false);
    let [TotalVideoSeconds, setTotalVideoSeconds] = useState(0);
    let [TotalVideoMinutes, setTotalVideoMinutes] = useState(0);
    let [TotalVideoHours, setTotalVideoHours] = useState(0);
    let [isMute,setisMute] = useState(false);
    let [isPaused, setisPaused] = useState(true);
    let [Duration, setDuration] = useState(0);
    let [Progress, setProgress] = useState(0);
    let [seconds, setseconds] = useState(0);
    let [minutes, setminutes] = useState(0);
    let [hours, sethours] = useState(0);
    const [videoWidth,setvideoWidth] = useState();
    const [videoHeight,setvideoHeight] = useState();
    let [Video, Setvideo] = useState(null);
    const FetchVideo = async () => {
      try {
          if(params.id){
        const VideoRef = doc(firestore, "videos", params.id);
        // const video = await getDoc(videoRef);
         onSnapshot(VideoRef,async(videDoc)=>{
        if (videDoc.exists()) {
          Setvideo(videDoc.data());
        }
     })
  }
      } catch (error) {
        console.log(error);
      } finally {
          console.log("Fetching finished");
          console.log(Video)
      }
    };
    useEffect(()=>{
      setProgress(0);
     FetchVideo()
      videoRef.current.addEventListener("loadeddata",()=>{
      if(videoRef.current.readyState >= 3){
        videoRef.current.play();
        videoRef.current.muted = false;
        setisMute(false);
        setisPaused(false);
      }
     })
     },[params.id])
  
     useEffect(()=>{
      const currentVideo = videoRef.current;
      if(window.innerWidth < 1115){
        setvideoWidth(640);
        // setvideoHeight(360);
      }else if (window.innerWidth >= 1115 && window.innerWidth <= 1745){
      setvideoWidth(window.innerWidth - 474);
      setvideoHeight(videoWidth * 0.5625);
      }else{
        setvideoWidth(1271);
        setvideoHeight(688);
      }
       const updateVideoSize = () => {
        if (currentVideo) {
          if(window.innerWidth < 1115){
            setvideoWidth(640);
            setvideoHeight(360);
          }else if (window.innerWidth >= 1115 && window.innerWidth <= 1745){
            setvideoWidth(window.innerWidth - 474);
            setvideoHeight(videoWidth * 0.5625);
            }else{
              setvideoWidth(1271);
              setvideoHeight(688);
            }
        }
      
      }
       window.addEventListener('resize', updateVideoSize);
  
      return () => {
        window.removeEventListener('resize', updateVideoSize);
      };
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
      ProgressBarWidth.current.style.width = Progress + "%";
      if(Progress < 100 && duration === e.target.duration){
        ProgressBarWidth.current.style.width = Progress+ 1 + "%";
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
      videoRef.current.requestFullscreen();
    };
    const GetValue = (event) => {
      const progress =
        (event.clientX / parentProgressBarRef.current.offsetWidth) * 100;
        setProgress(progress);
        ProgressBarWidth.current.style.width = progress + "%";
      const newTime = progress * (Duration / 100);
      videoRef.current.currentTime = newTime;
    };
  
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
     const checkVideoHeight = (event) => {
     const video = document.getElementById("currentVideo");
      video.addEventListener('playing',()=>{
      if(video.videoHeight > 720) {
        console.log("Height is greater than threeshold...");
       }
      })
     }
    return (
      <div className="video_section">
          <div className='videoContainer'>
               <video
                src={Video?.videoURL}
                poster={Video?.Thumbnail}
                onLoadedData={TotalTime}
                onTimeUpdate={HandlProgress}
                ref={videoRef}
                onLoadedMetadata={checkVideoHeight}
                id="currentVideo"
                style={{width:videoWidth,height:videoHeight}}
     />
             </div>
                <div className="middle_controls">
               
                  <div>
                   </div>
                </div>
                <div className="below_controls">
                <div className="progressBar" onMouseDown={GetValue} ref={parentProgressBarRef} >
                    <span id="progressBar_width" ref={ProgressBarWidth}></span>
                  </div>
                  <div className='bottom-toggle-buttons'>
                  <div className='bottom-toggle-buttons-left'>
                    { isPaused ? <IoMdPlay onClick={HandlePlayPause} />:<MdPause onClick={HandlePlayPause} />}
                    <MdSkipNext />
                  <p>
                      <span>{minutes + ":" + seconds.toString().padStart(2, 0)}</span>{" "} /{" "}
                      <span>{TotalVideoHours !== 0 ? TotalVideoHours +":" + TotalVideoMinutes +":" +TotalVideoSeconds.toString().padStart(2, 0): TotalVideoMinutes +":" +TotalVideoSeconds.toString().padStart(2, 0)}</span>
                   </p>
                   </div>
                   <div className='bottom-toggle-buttons-right'>
                    <MdClosedCaptionOff/>
                    <RxEnterFullScreen onClick={HandleFullScreen} />
                  </div>
                  </div>
                </div>
              </div>
    )
}

export default LargeScreenVideoPlayer