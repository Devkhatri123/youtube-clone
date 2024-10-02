import React, { useContext, useEffect } from 'react'
import { MdMenu } from "react-icons/md";
import youtubeImage from "../Pics/youtube.png";
import { MdHomeFilled } from "react-icons/md";
import { SiYoutubeshorts } from "react-icons/si";
import { MdOutlineSubscriptions } from "react-icons/md";
import { MdOutlineLibraryAdd } from "react-icons/md";
import { Navbarcontext } from '../Context/NavbarContext';
import { HomeContext } from '../Context/HomePageContext';

function LargeScreenSideBar() {
    const currentState = useContext(Navbarcontext);
  return currentState.showSidebar === true && (
    <div className='LargeScreenSideBar' style={currentState.showSidebar === true ? {display:"block"}:{display:"none"}}>
     <div className='LargeScreenSideBar_top'>
     <MdMenu/>
     <img src={youtubeImage} alt='logo'/>
     </div>
     <div className='LargeScreenSideBar-items'>
        <div className='LargeScreenSideBar-items-top'>
     <div className="LargeScreenSideBar-home-item">
       <MdHomeFilled/>
        <p>Home</p>
      </div>
      <div className="LargeScreenSideBar-shorts-item">
        <SiYoutubeshorts/>
        <p>Shorts</p>
      </div>
      <div className="LargeScreenSideBar-Subscriptions-item">
        <MdOutlineSubscriptions/>
        <p>Subscriptions</p>
      </div>
      </div>
      <div className='LargeScreenSideBar-items-middle'>
        <h4>Your {'>'}</h4>
        <div className="your-channel">
          <MdOutlineLibraryAdd/>
          <p>Your Channel</p>
        </div>
      </div>
     </div>
    </div>
  )
}

export default LargeScreenSideBar
