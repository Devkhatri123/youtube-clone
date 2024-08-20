import React,{useState,useEffect} from 'react'
import { MdClosedCaptionOff } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdPause } from "react-icons/md";
import { IoMdPlay } from "react-icons/io";
import { MdSkipNext } from "react-icons/md";
import { IoVolumeMuteSharp } from "react-icons/io5";
import { VscUnmute } from "react-icons/vsc";
import { MdSkipPrevious } from "react-icons/md";
import { IoReloadOutline } from "react-icons/io5";
import { RxEnterFullScreen } from "react-icons/rx";
import { useRef } from 'react';
import "../CSS/VideoPage.css";
import { onSnapshot,doc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import { useParams } from 'react-router';
function VideoPlayer(props) {
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
     FetchVideo();
   },[params.id])



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
    videoRef.current.style.width = "unset";
     videoRef.current.style.height = "unset";
     videoRef.current.style.objectFit = "unset"; 
    const video = document.getElementById("currentVideo");
    console.log("Width:", video.videoWidth);
    console.log("Height:", video.videoHeight);
     if(video.videoHeight > 720) {
      console.log("Height is greater than threeshold...");
         videoRef.current.style.width = 100 + "%";
         videoRef.current.style.height = 400 + "px";
         videoRef.current.style.objectFit = "contain"; 
     }
   }
  return (
    <div className="video_section">
              <div className="video_top_controls">
                <MdClosedCaptionOff />
                {isMute ? <IoVolumeMuteSharp onClick={HandleMuteUnmute}/>:<VscUnmute  onClick={HandleMuteUnmute}/>}
              </div>
              {props.src ? <video
                src={props.src}
                poster={props.poster?props.poster:null}
                onLoadedData={TotalTime}
                onTimeUpdate={HandlProgress}
                ref={videoRef}
                onLoadedMetadata={checkVideoHeight}
                id="currentVideo"
                className={props.src}
              />:<video
              src={Video?.videoURL}
              poster={Video?.Thumbnail}
              onLoadedData={TotalTime}
              onTimeUpdate={HandlProgress}
              ref={videoRef}
              onLoadedMetadata={checkVideoHeight}
              id="currentVideo"
            />}
           
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
                <div>
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
                  <RxEnterFullScreen onClick={HandleFullScreen} />
                </div>
                <div
                  className="progressBar"
                  onMouseDown={GetValue}
                  ref={parentProgressBarRef}
                >
                  <span id="progressBar_width" ref={ProgressBarWidth}></span>
                </div>
              </div>
            </div>
  )
}

export default VideoPlayer
