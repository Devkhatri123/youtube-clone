import React,{useState,useEffect, useRef} from 'react'
import { createSearchParams, Link, useNavigate } from 'react-router-dom';
import { IoVolumeMuteSharp } from "react-icons/io5";
import { VscUnmute } from "react-icons/vsc";
import { BiSolidCaptions } from "react-icons/bi";
import { MdClosedCaptionOff } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import shortsIcon from "../Pics/Youtube_shorts_icon.webp";
import {FaRegUserCircle} from "react-icons/fa";
import "../CSS/Video.css"
import { ref } from 'firebase/storage';
import { Update } from '@mui/icons-material';
function Largescreencomponent(props) {
  const LinkRef = useRef();
  const navigate = useNavigate();
  const [muteIcon,setmuteIcon] = useState(false);
  const [ShowPoster,setShowPoster] = useState(true);
  const [showlink,setshowlink] = useState(true)
  const [showControls,setshowControls] = useState(false);
  const [ActiveIndex,setActiveIndex] = useState(null);
  const videoRef = useRef();
  const InputRef = useRef();
  const PlayVideo = (e,index) => {
    try{
    }catch(error){
      console.log(error)
    }
  }
  const PauseVideo = (e,index) => {
    try{
 
  }catch(error){
    console.log(error)
  }
  }
  const checkPlayVideo = (e,index,Title) => {
   setActiveIndex(index);
    setshowlink(false);
    console.log(Title)
    setshowControls(true);
    if(videoRef.current){
      videoRef.current.play();
      document.title = Title;
  console.log(videoRef.current.textTracks)
    }
  }

const UpdateInputValue = (e) => {
  const Progress = Math.floor((e.target.currentTime / e.target.duration) * 100);
  InputRef.current.value = Progress;
}
const ChangeVideoDuration = (e) => {
  videoRef.current.currentTime = e.target.value * (videoRef.current.duration / 100);
}
const checkPauseVideo = (e) => {
setActiveIndex(null);
if(videoRef.current){
  videoRef.current.pause();
  videoRef.current.currentTime = 0;
  document.title = "YoutubeClone"
  setmuteIcon(!muteIcon);
}
  setshowlink(true)
setshowControls(false);
}
const HideLink = () => {
  setshowlink(false);
}
const showLink = () => {
  setshowlink(true);
}
const MuteUnmuteToggle = () => {
  if(videoRef.current.play()){
    videoRef.current.muted = !videoRef.current.muted;
    setmuteIcon(!muteIcon);
  }
}

  return (
    <div className='large-screen-main-videoPage'>
    <div className='videos'>
  {props.FullLengthVideos && props.FullLengthVideos.slice(0,6).map((FullLengthVideo,index)=>{
      return  <div id="video" key={index} onMouseEnter={(e)=>{checkPlayVideo(e,index,FullLengthVideo.Videodata.Title);showLink()}} onMouseLeave={(e)=>{checkPauseVideo(e)}}>
      <Link to={ showlink ? `/watch?v=${FullLengthVideo.id}`:null}>
      <div id="thumbnail_container">
        {!ShowPoster ? (
          <>
          
          {showControls && ActiveIndex === index && (
         <div className='large-screen_component_videoplayer_top_controls' onMouseEnter={HideLink} onMouseLeave={showLink}>
            <div className="mute_UnmuteIcon" >
           {!muteIcon ? <IoVolumeMuteSharp onClick={MuteUnmuteToggle}/>:<VscUnmute  onClick={MuteUnmuteToggle}/>}  
            </div>
            <div className="Unmute_icon" > 
             <MdClosedCaptionOff />
            </div>
          </div>
          )}
         {ActiveIndex === index ?(
          <>
        <video src={FullLengthVideo.Videodata.videoURL} muted poster={FullLengthVideo.Videodata.Thumbnail} style={{position:"absolute",top:"0"}} onMouseOver={(e)=>{PlayVideo(e,index)}} onMouseOut={(e)=>{PauseVideo(e,index)}} ref={videoRef}
          onTimeUpdate={UpdateInputValue}
          />
        <input type="range" value={0} min={0} max={100} ref={InputRef} id='previewVideo_time' onChange={ChangeVideoDuration} onMouseEnter={HideLink} onMouseLeave={showLink}/>
        </>
         ):
          <img src={FullLengthVideo.Videodata.Thumbnail} alt="" className="video" onMouseOver={()=>{setShowPoster(false);setActiveIndex(index)}}/> }
        </>
        ):(
          <>
       <img src={FullLengthVideo.Videodata.Thumbnail} alt="" className="video" onMouseOver={()=>{setShowPoster(false);setActiveIndex(index)}}/> 
       </>
        )}
      </div>
         </Link>
        
         <div className="video_bottom">
                      <div className="video_bttom_left">
                      <Link to={`/${FullLengthVideo.Videodata.createdBy}/${FullLengthVideo.UserData?.name.replace(" ","")}/videos`} >
                       {FullLengthVideo.UserData?.channelPic ? (
                        <img
                          src={FullLengthVideo.UserData?.channelPic}
                          alt={FullLengthVideo.UserData?.name}
                        />
                        ):<FaRegUserCircle/>}
                        </Link>
                        <Link to={`/watch/${FullLengthVideo.id}`}>
                        <div className="video_title_and_channelName">
                          <h3 id="video_title" className="title">
                            {FullLengthVideo.Videodata?.Title}
                          </h3>
                          <div className='channelnameandviews'>
                            <p id='channelName'>
                              {FullLengthVideo.UserData?.name} 
                            </p>
                            <p id='video-views'>{FullLengthVideo.Videodata?.views} Views</p>
                          </div>
                        </div>
                        </Link>
                      </div>
                     
            <BsThreeDotsVertical className="videomenu" />
        </div>
        </div>
    })}
    </div>
    {props.ShortVideos.length > 0 && (
    <div className="short-videos">
      
     <div className="short-video-section">
        <div className="shelf-header">
           <img src={shortsIcon} alt="shorts-icon" />
           <h4>Shorts</h4>
        </div>
        <div className="short-video-shelf">
       {props.ShortVideos && props.ShortVideos.map((shortvideo,index)=>{
          return <div className="short-video" key={index}>
          <div id="short-video">
            <Link to={`/short/${shortvideo?.id}`}>
            <video src={shortvideo.Videodata.videoURL} ></video>
            <div className="short-video-detail">
            <div className="short-video-title">{shortvideo.Videodata.Title}</div>
            <div className="views">{shortvideo.Videodata.views} Views</div>
            </div>
            </Link>
            </div>
          </div>
       })}
       </div>
       </div>
    </div>
      )}
      {props.FullLengthVideos && props.FullLengthVideos.slice(6).length > 0 &&(
    <div className="videos">
       {props.FullLengthVideos && props.FullLengthVideos.slice(6).map((FullLengthVideo,index)=>{
      return  <div id="video" key={index}>
      <Link to={`/watch?v=${FullLengthVideo.id}`}>
      <div id="thumbnail_container">
      <img src={FullLengthVideo.Videodata.Thumbnail} alt="" className="video"/>
      </div>
         </Link>
         <div className="video_bottom">
                      <div className="video_bttom_left">
                        <Link to={`/${FullLengthVideo.Videodata.createdBy}/${FullLengthVideo.UserData?.name.replace(" ","")}/videos`} >
                        {FullLengthVideo.UserData?.channelPic ? (
                        <img
                          src={FullLengthVideo.UserData?.channelPic}
                          alt={FullLengthVideo.UserData?.name}
                        />
                        ):<FaRegUserCircle/>}
                        </Link>
                        <div className="video_title_and_channelName">
                          <h3 id="video_title" className="title">
                            {FullLengthVideo.Videodata?.Title}
                          </h3>
                          <div>
                            <p>
                              {FullLengthVideo.UserData?.name} •
                              {" "} {FullLengthVideo.Videodata?.views} Views
                            </p>
                          </div>
                        </div>
                      </div>
            <BsThreeDotsVertical className="videomenu" />
        </div>
        </div>
    })}
    </div>
      )}
    </div>
  )
}

export default Largescreencomponent
