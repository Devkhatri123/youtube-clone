import React,{useState,useEffect} from 'react'
import { Link } from 'react-router-dom';
import { BsThreeDotsVertical } from "react-icons/bs";
import shortsIcon from "../Pics/Youtube_shorts_icon.webp";
import "../CSS/Video.css"
function MediumScreenComponent(props) {
    const [ThumbnailHeight,setThumbnailHeight] = useState(window.innerWidth * (9/16));
    const [ThumbnailWidth,setThumbNailWidth] = useState(window.innerWidth)
//     useEffect(()=>{
//       setThumbNailWidth(window.innerWidth);
//       setThumbnailHeight(ThumbnailWidth * (9/16));
//       const updateVideoSize = () => {
//         setThumbNailWidth(window.innerWidth);
//         setThumbnailHeight(ThumbnailWidth * (9/16));
//         console.log("width : " + ThumbnailWidth);
//         console.log("height : " + ThumbnailHeight);
//       }
//       window.addEventListener("resize",updateVideoSize)
//       return ()=>{
//         window.removeEventListener("resize",updateVideoSize)
//       }
//   },[ThumbnailHeight,ThumbnailWidth]);
    return (
      <div>
      <div className='videos'>
    {props.FullLengthVideos && props.FullLengthVideos.slice(0,4).map((FullLengthVideo,index)=>{
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
                                {FullLengthVideo.UserData?.name} 
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
      <div class="short-videos">
      {props.ShortVideos && (
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
      )}
      </div>
      <div className="videos">
         {props.FullLengthVideos && props.FullLengthVideos.slice(4).map((FullLengthVideo,index)=>{
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
                                {FullLengthVideo.UserData?.name} 
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

export default MediumScreenComponent
