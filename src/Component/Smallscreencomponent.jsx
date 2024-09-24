import React,{useState,useEffect} from 'react'
import { Link } from 'react-router-dom';
import { BsThreeDotsVertical } from "react-icons/bs";
import shortsIcon from "../Pics/Youtube_shorts_icon.webp";
import { FiClock } from "react-icons/fi";
import { TiThumbsUp } from "react-icons/ti";
import { GoThumbsdown } from "react-icons/go";
import { IoMdClose } from "react-icons/io";
import "../CSS/HomeScreen.css"
import BottomLayout from './BottomLayout';
function Smallscreencomponent(props) {
  console.log(props)
  const [ThumbnailHeight,setThumbnailHeight] = useState();
  const [ThumbnailWidth,setThumbNailWidth] = useState();
  const [bottomLayout,setbottomLayout] = useState(false);
  useEffect(()=>{
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
},[ThumbnailHeight,ThumbnailWidth]);
  return (
    <div>
    <div className='videos'>
  {props.FullLengthVideos && props.FullLengthVideos.slice(0,1).map((FullLengthVideo,index)=>{
      return  <div id="video" key={index}>
      <Link to={`/watch?v=${FullLengthVideo.id}`}>
      <div id="thumbnail_container">
      <img src={FullLengthVideo.Videodata.Thumbnail} alt="" className="video" style={!props.areSearchResult ? {height:ThumbnailHeight, width:ThumbnailWidth}:null}/>
      </div>
         </Link>
         <div className="video_bottom">
                      <div className="video_bttom_left">
                      <Link to={`/${FullLengthVideo.Videodata.createdBy}/${FullLengthVideo.UserData?.name.replace(" ","")}/videos`} >
                        <img
                          src={FullLengthVideo.UserData?.channelPic}
                          alt={FullLengthVideo.UserData?.name}
                        />
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
                      <div onClick={()=>{setbottomLayout(true);console.log("clciked")}}><BsThreeDotsVertical className="videomenu" /></div>
        </div>
        {bottomLayout && (
        <BottomLayout/>
        )}
        </div>
    })}
    </div>
    {props.ShortVideos.length > 0 && (
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
            
            <video src={shortvideo.Videodata.videoURL} ></video>
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
      return  <div id="video" key={index}>
      <Link to={`/watch?v=${FullLengthVideo.id}`}>
      <div id="thumbnail_container">
      <img src={FullLengthVideo.Videodata.Thumbnail} alt="" className="video" style={{height:ThumbnailHeight, width:ThumbnailWidth}}/>
      </div>
         </Link>
         <div className="video_bottom">
                      <div className="video_bttom_left">
                        <img
                          src={FullLengthVideo.UserData?.channelPic}
                          alt={FullLengthVideo.UserData?.name}
                        />
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
            <div onClick={()=>{setbottomLayout(true);console.log("clciked")}}><BsThreeDotsVertical className="videomenu" /></div>
        </div>
        {bottomLayout && (
        <BottomLayout/>
        )}
        </div>
    })}
    </div>
    </div>
  )
}

export default Smallscreencomponent
