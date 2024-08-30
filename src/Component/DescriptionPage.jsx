import React, { useContext, useEffect, useState } from 'react'
import { RxCross1 } from "react-icons/rx";
import "../CSS/VideoPage.css"
import VideoInfoCard from './VideoInfoCard';
import { CurrentState } from '../Context/HidevideoinfoCard';
import { useParams } from 'react-router';
import { doc,onSnapshot } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
function DescriptionPage(props) {
  const [showDescription,setshowDescription] = useState(true);
  const [Video, Setvideo] = useState();
  const [user, setUser] = useState();
  const [showFullText,setshowFullText] = useState(false);
  const params = useParams();
  const HandleCurrentComponent = () => {
    setshowDescription(false);
   // document.body.style.overflowY = "scroll";
  }
  useEffect(()=>{
   if(showDescription){
    const FetchVideo = async () => {
      try {
        const VideoRef = doc(firestore, "videos", params.id);
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
  },[params.id,showDescription]);
  
  return (
    <>
      {showDescription ? (
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
             
               {Video?.description.length > 120 ? (
               // <div>{Video.description.substring(0,100)+`...`}</div>
                 <div onClick={()=>setshowFullText(!showFullText)}>{showFullText?Video.description:Video.description.substring(0,100)+`...`} </div>
               ):(Video?.description)}
             
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
      ) : (
        <VideoInfoCard />
      )}
    </>
  );
  

}

export default DescriptionPage
