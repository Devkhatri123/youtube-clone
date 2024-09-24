import React, { useContext, useEffect, useState } from 'react'
import { RxCross1 } from "react-icons/rx";
import "../CSS/VideoPage.css"
import VideoInfoCard from './VideoInfoCard';
import { useParams } from 'react-router';
import { doc,onSnapshot } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import { CurrentState } from '../Context/HidevideoinfoCard';
import { useSearchParams } from 'react-router-dom';
function DescriptionPage(props) {
  const [showDescription,setshowDescription] = useState(true);
  const [Video, Setvideo] = useState();
  const [user, setUser] = useState();
  const [showFullText,setshowFullText] = useState(false);
  const currentState = useContext(CurrentState)
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get('v');
  const HandleCurrentComponent = () => {
    currentState.setDescription(false)
   // document.body.style.overflowY = "scroll";
  }
  useEffect(()=>{
   if(currentState.Description){
    const FetchVideo = async () => {
      try {
        const VideoRef = doc(firestore, "videos", videoId);
        // const video = await getDoc(videoRef);
        onSnapshot(VideoRef,async(videDoc)=>{
        if (videDoc.exists()) {
          Setvideo(videDoc.data());
          const userRef = doc(firestore, "users", videDoc.data().createdBy);
          //const User = await getDoc(userRef);
         onSnapshot(userRef,(userDoc)=>{
          if (userDoc.exists()) {
            setUser(userDoc.data());
          }
        })
        }
     })
      } catch (error) {
        console.log(error);
        document.write(error);
      }
    };
    FetchVideo();
   }
  },[videoId,showDescription]);
  const urlify = (text) => {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function(url) {
     if(url.includes("youtube")){
      return `<div style="display:flex;align-items:center;background-color: rgba(255, 255, 255, 0.102);width: fit-content;border-radius: 12px;padding: 0px 7px;"><img src="https://www.gstatic.com/youtube/img/watch/yt_favicon.png" style="height:13px">•<a href=${url}>${url}</a></div>`
     }else if (url.toLowerCase().includes("facebook")){
         return `<div style="display:flex;align-items:center;background-color: rgba(255, 255, 255, 0.102);width: fit-content;border-radius: 12px;padding: 0px 7px;"><img src="https://www.gstatic.com/youtube/img/watch/social_media/facebook_1x.png" style="height:13px">•<a href=${url}>${url}</a></div>`
      }else if (url.toLowerCase().includes("instagram")){
        return `<div style="display:flex;align-items:center;background-color: rgba(255, 255, 255, 0.102);width: fit-content;border-radius: 12px;padding: 0px 7px;"><img src="https://www.gstatic.com/youtube/img/watch/social_media/instagram_1x.png" style="height:13px">•<a href=${url}>${url}</a></div>`
     }else{
      return `<div style="display:flex;align-items:center;background-color: rgba(255, 255, 255, 0.102);width: fit-content;border-radius: 12px;padding: 0px 7px;"><a href=${url}>${url}</a></div>`
     }
    })
  }
  return (
    <>
      {currentState.Description && (
        <div id='description_page'>
          <div className="description_top">
            <h3>Description</h3>
            <RxCross1 onClick={HandleCurrentComponent} />
          </div>
          <div className="description_body">
            <div className="primary-info">
              <div className="video-title">
                <h2>{Video?.Title}</h2>
              </div>
              <div className="creator-channel">
                <img src={user?.channelURL} alt="" />
                <p>{user?.name}</p>
              </div>
            </div>
            <div className="video-views-Likes-uploadDate">
              <div className="Likes">
                <p>{Video?.likes}</p>
                <p>Likes</p>
              </div>
              <div className="views">
                <p>{Video?.views}</p>
                <p>Views</p>
              </div>
              <div className="uploadDate">
                <p>24 Aug</p>
                <p>2024</p>
              </div>
            </div>
            <div className="main-description">
            <div onClick={()=>setshowFullText(!showFullText)} style={{overflow:"auto"}} dangerouslySetInnerHTML={{__html:  
            Video?.description.length > 0 ? (
                  Video?.description.length > 160 ? (
                    showFullText?urlify(Video.description):urlify(Video.description.substring(0,160))+`...`):(urlify(Video.description))):("no text")
               }}
                  >
                
                 </div>
            </div>
            <div className="creator-channel">
                <img src={user?.channelURL} alt="" />
                <div style={{height: "32px"}}>
                <p style={{fontsize: "0.8rem"}}>{user?.name}</p>
                <p style={{fontsize: "0.8rem",color:"darkgray",marginleft: "0.5rem"}}>{user?.subscribers} {user?.subscribers > 1? "subscribers":"subscriber"}  </p>
                </div>
              </div>
          </div>
        </div>
      )}
    </>
  );
  

}

export default DescriptionPage
