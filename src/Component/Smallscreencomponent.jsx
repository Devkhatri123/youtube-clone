import React,{useState,useEffect, useContext, useRef} from 'react'
import { Link } from 'react-router-dom';
import { BsThreeDotsVertical } from "react-icons/bs";
import shortsIcon from "../Pics/Youtube_shorts_icon.webp";
import { FiClock } from "react-icons/fi";
import { TiThumbsUp } from "react-icons/ti";
import { GoThumbsdown } from "react-icons/go";
import { IoMdClose } from "react-icons/io";
import "../CSS/HomeScreen.css"
import BottomLayout from './BottomLayout';
import ToastNotification from './ToastNotification';
import VideoInfoCard from './VideoInfoCard';
import { videoContext } from '../Context/VideoContext';
import { auth } from '../firebase/firebase';
 function Smallscreencomponent(props) {
  const videocontext = useContext(videoContext)
  const [ThumbnailHeight,setThumbnailHeight] = useState(null);
  const [ThumbnailWidth,setThumbNailWidth] = useState(null);
  const [bottomLayout,setbottomLayout] = useState(false);
  const [ActiveVideoIndex,setActiveVideoIndex] = useState(null);
  const [LoggedInUser,setLoggedInUser] = useState(null);
  useEffect(()=>{
    auth.onAuthStateChanged((currentUser)=>{
    setLoggedInUser(currentUser)
    })
  },[])
  const [Top,setTop] = useState(null);
  const [Left,setLeft] = useState(null);
  useEffect(()=>{
    if(window.location.href == "/"){
    if(window.innerWidth <= 600){
      setThumbNailWidth(window.innerWidth);
      setThumbnailHeight(ThumbnailWidth * (9/16));
      }
    const updateVideoSize = () => {
      if(window.innerWidth <= 600){
      setThumbNailWidth(window.innerWidth);
      setThumbnailHeight(ThumbnailWidth * (9/16));
      }
    }
    window.addEventListener("resize",updateVideoSize)
    return ()=>{
      window.removeEventListener("resize",updateVideoSize)
    }
  }
},[ThumbnailHeight,ThumbnailWidth]);
const showLayout = (e,i) => {
  videocontext.setbottomlayout(true);
  // setbottomLayout(!bottomLayout);
  setActiveVideoIndex(i);
  if(window.innerWidth <= 600){
  document.body.style.opacity = "0.7";
  setLeft(null);
  setTop(null);
  }else{
    setLeft(e.pageX - 246);
    setTop(e.clientY);
  }
  document.body.style.overflow = "hidden";
  console.log(e.clientY)
}
useEffect(()=>{
  if(videocontext.bottomlayout){
    if(window.innerWidth <= 600){
      document.body.style.opacity = "0.7";
    }
     document.body.style.overflow="hidden";
  }
  else{
    document.body.style.overflow="scroll"
    document.body.style.opacity = "1";
  } 
},[videocontext.bottomlayout])
const dots = document.getElementById("dots");
if(dots){
  window.addEventListener("resize",()=>{
    if(window.innerWidth > 600){
    setLeft(dots.getBoundingClientRect().left - 246);
    }else{
      setLeft(null)
      setTop(null);
    }
  })
}
useEffect(()=>{
if(videocontext.showToastNotification) setbottomLayout(false)
},[videocontext.showToastNotification])


  return (
    <>
   <div className='videos'>
  {props.FullLengthVideos && props.FullLengthVideos.slice(0,1).map((FullLengthVideo,index)=>{
     return  <div id="video" key={index}>
      <Link to={`/watch?v=${FullLengthVideo.id}`}>
      <div id="thumbnail_container">
      <img src={FullLengthVideo.Videodata.Thumbnail} alt="" className="video" style={!props.areSearchResult ? {height:ThumbnailHeight, width:ThumbnailWidth}:null}/>
      <p className='videoLength'>{videocontext.returnvideoTime(FullLengthVideo.Videodata.videoLength)}</p>
      </div>
         </Link>
         <div className="video_bottom">
                      <div className="video_bttom_left">
                      <Link to={`/${FullLengthVideo.Videodata.createdBy}/${FullLengthVideo.UserData?.name.replace(" ","")}/videos`} >
                      {FullLengthVideo.UserData?.channelURL ? (
                        <img
                          src={FullLengthVideo.UserData?.channelURL}
                          alt={FullLengthVideo.UserData?.name}
                        />
                      ) : (
                        <img
                          src={FullLengthVideo.UserData?.channelURL}
                          alt={FullLengthVideo.UserData?.name}
                        />
                      )}
                        </Link>
                        <div className="video_title_and_channelName">
                          <h3 id="video_title" className="title">
                            {FullLengthVideo.Videodata?.Title}
                          </h3>
                          <div style={{color:"#aaa",display:"flex",flexWrap:"wrap"}}>
                            <p>
                              {FullLengthVideo.UserData?.name} •
                              {" "} {FullLengthVideo.Videodata?.views} Views •
                            </p>
                            <p>{videocontext.getVideoPublishedTime(FullLengthVideo)}</p>
                          </div>
                        </div>
                      </div>
                      <div onClick={(e)=>{showLayout(e,index)}}><BsThreeDotsVertical className="videomenu" id={ActiveVideoIndex === index ? 'dots':null}/></div>
        </div>
        {index === ActiveVideoIndex && (
                  <>
                    {videocontext.bottomlayout && !videocontext.showToastNotification && (
                      <div  id="Layout">
                        <BottomLayout
                          Left={Left}
                          Top={Top}
                          videoURL={FullLengthVideo.id}
                          video={FullLengthVideo.Videodata}
                           user={LoggedInUser}
                        />
                      </div>
                    )}
                    {videocontext.showToastNotification && (
                        <ToastNotification />
                    )}
                  </>
                )}
        </div>
    })}
    </div>
    {props.ShortVideos && props.ShortVideos.length > 0&& (
    <div class="short-videos">
     <div className="short-video-section">
        <div className="shelf-header">
           <img src={shortsIcon} alt="shorts-icon" />
           <h4>Shorts</h4>
        </div>
        <div className="short-video-shelf">
       {props.ShortVideos && props.ShortVideos.map((shortvideo,index)=>{
          return <div className="short-video" key={index}>
          <div id="short-video">
            
            <img src={shortvideo.Videodata.Thumbnail} alt=''></img>
            <div className="short-video-detail">
            <div className="short-video-title">{shortvideo.Videodata.Title}</div>
            <div className="views">{shortvideo.Videodata.views} Views</div>
            </div>
            </div>
            
          </div>
       })}
       </div>
       </div>
    </div>
      )}
    <div className="videos">
       {props.FullLengthVideos && props.FullLengthVideos.slice(1).map((FullLengthVideo,index)=>{
    return  <div id="video" key={index + 1} style={index===props.FullLengthVideos.length?{marginBottom:"50px"}:null}>
      <Link to={`/watch?v=${FullLengthVideo.id}`}>
      <div id="thumbnail_container">
      <img src={FullLengthVideo.Videodata.Thumbnail} alt="" className="video" style={!props.areSearchResult ? {height:ThumbnailHeight, width:ThumbnailWidth}:null}/>
      <p className='videoLength'>{videocontext.returnvideoTime(FullLengthVideo.Videodata.videoLength)}</p>
      </div>
         </Link>
         <div className="video_bottom">
                      <div className="video_bttom_left">
                      {FullLengthVideo.UserData?.channelURL ? (
                        <img
                          src={FullLengthVideo.UserData?.channelURL}
                          alt={FullLengthVideo.UserData?.name}
                        />
                      ) : (
                        <img
                          src={FullLengthVideo.UserData?.channelURL}
                          alt={FullLengthVideo.UserData?.name}
                        />
                      )}
                        <div className="video_title_and_channelName">
                          <h3 id="video_title" className="title">
                            {FullLengthVideo.Videodata?.Title}
                          </h3>
                          <div style={{color:"#aaa",display:"flex",flexWrap:"wrap"}}>
                            <p>
                              {FullLengthVideo.UserData?.name} •
                              {" "} {FullLengthVideo.Videodata?.views} Views •
                            </p>
                            <p>{videocontext.getVideoPublishedTime(FullLengthVideo)}</p>
                          </div>
                        </div>
                      </div>
            <div onClick={(e)=>{
             showLayout(e,index + 1)
             }}
           ><BsThreeDotsVertical className="videomenu" id={ActiveVideoIndex === index ? 'dots':null}/></div>
        </div>
        {index+1 === ActiveVideoIndex && (
                  <>
                    {videocontext.bottomlayout && !videocontext.showToastNotification && (
                      <div  id="Layout">
                        <BottomLayout
                          Left={Left}
                          Top={Top}
                          videoURL={FullLengthVideo.id}
                          video={FullLengthVideo.Videodata}
                          user={LoggedInUser}
                        />
                      </div>
                    )}
                    {videocontext.showToastNotification && (
                        <ToastNotification />
                    )}
                  </>
                )}
        </div>
    })}
    </div>
    </>
  )
}

export default Smallscreencomponent
