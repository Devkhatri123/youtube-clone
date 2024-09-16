import React,{useState,useEffect} from 'react'
import { Link } from 'react-router-dom';
import { BsThreeDotsVertical } from "react-icons/bs";
import shortsIcon from "../Pics/Youtube_shorts_icon.webp";
import "../CSS/Video.css"
function Largescreencomponent(props) {
   
  return (
    <div className='large-screen-main-videoPage'>
    <div className='videos'>
  {props.FullLengthVideos && props.FullLengthVideos.slice(0,6).map((FullLengthVideo,index)=>{
      return  <div id="video" key={index}>
      <Link to={`/watch/${FullLengthVideo.id}`}>
      <div id="thumbnail_container">
      <img src={FullLengthVideo.Videodata.Thumbnail} alt="" className="video"/>
      </div>
         </Link>
        
         <div className="video_bottom">
                      <div className="video_bttom_left">
                        <img
                          src={FullLengthVideo.UserData?.channelURL}
                          alt={FullLengthVideo.UserData?.name}
                        />
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
    <div className="videos">
       {props.FullLengthVideos && props.FullLengthVideos.slice(6).map((FullLengthVideo,index)=>{
      return  <div id="video" key={index}>
      <Link to={`/watch/${FullLengthVideo.id}`}>
      <div id="thumbnail_container">
      <img src={FullLengthVideo.Videodata.Thumbnail} alt="" className="video"/>
      </div>
         </Link>
         <div className="video_bottom">
                      <div className="video_bttom_left">
                        <img
                          src={FullLengthVideo.UserData?.channelURL}
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
            <BsThreeDotsVertical className="videomenu" />
        </div>
        </div>
    })}
    </div>
    </div>
  )
}

export default Largescreencomponent
