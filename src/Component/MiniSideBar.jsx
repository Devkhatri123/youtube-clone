import React, { useContext, useEffect, useState } from 'react'
import { MdHomeFilled } from "react-icons/md";
import { SiYoutubeshorts } from "react-icons/si";
import { MdOutlineSubscriptions } from "react-icons/md";
import { MdOutlineLibraryAdd } from "react-icons/md";
import "../CSS/MiniSideBar.css";
import "../CSS/VideoPage.css";
import { Link } from 'react-router-dom';
import { Navbarcontext } from '../Context/NavbarContext';
function MiniSideBar(props) {
const [shortVideo,setshortVideo] = useState([])
const navContext = useContext(Navbarcontext)
useEffect(()=>{
  console.log(props)
 setshortVideo(props.NonFilteredVideos && props.NonFilteredVideos.filter((video)=>{
    return video.Videodata.shortVideo;
  }))
},[props])
  return (
    <div className='mini-sidebar'>
      <div className="home">
       <MdHomeFilled/>
        <p>Home</p>
      </div>
      <div className="shorts">
      <Link to={shortVideo&& `/short/${shortVideo[0]?.id}`}>
        <SiYoutubeshorts/>
        <p>Shorts</p>
</Link>
      </div>
      <div className="subscription">
        <MdOutlineSubscriptions/>
        <p>Subscriptions</p>
      </div>
      <div className="library">
        <Link to={"/Library"}>
        <MdOutlineLibraryAdd/>
        <p>You</p>
        </Link>
      </div>
    </div>
  )
}

export default MiniSideBar
