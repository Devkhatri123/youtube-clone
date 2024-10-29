import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import HomeHeader from './HomeHeader'
import { HomeContext } from '../Context/HomePageContext'
import "../CSS/HomePage.css"
function HomepageShorts() {
    const homeContext = useContext(HomeContext);
    const [AllShortsVideo,setAllShortsVideo] = useState([]);
    const params = useParams()
    useEffect(()=>{
        const GetData = async() => {
            try{
      const result = await homeContext.GetchannelData(params.id);
     setAllShortsVideo(result.filter((video)=>{
        return video.Videodata.shortVideo
      }))
    }catch(error){
        console.log(error)
    }
        }
        GetData()
    },[params.id,homeContext]);
  return (
    <div className='shorts-home-page'>
      <HomeHeader/>
      <div id="tabsContainer">
          <div id="videos">
            <Link to={"#"}>Videos</Link>
          </div>
          <div id="Shortvideos">
            <Link to={`/${params.id}/${homeContext.user?.name.replace(" ","")}}/Shorts`}>Shorts</Link>
           </div>
         </div>
         <div className='user-allshortsvideos'>
         {AllShortsVideo.length > 0 && (
    <div class="short-videos">
     <div className="short-video-section">
        <div className="short-video-shelf">
       {AllShortsVideo && AllShortsVideo.map((shortvideo,index)=>{
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
       </div>
    </div>
  )
}

export default HomepageShorts
