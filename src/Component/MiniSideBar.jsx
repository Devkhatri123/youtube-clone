import React, { useContext, useEffect, useState } from 'react'
import { MdHomeFilled } from "react-icons/md";
import { SiYoutubeshorts } from "react-icons/si";
import { MdOutlineSubscriptions } from "react-icons/md";
import { MdOutlineLibraryAdd } from "react-icons/md";
import { CurrentState } from '../Context/HidevideoinfoCard';
import "../CSS/MiniSideBar.css";
import "../CSS/VideoPage.css";
function MiniSideBar() {
const currentState = useContext(CurrentState);
useEffect(()=>{
  console.log(currentState.LargeSideBar);
},[currentState])
  return (
    <div className='mini-sidebar'>
      <div className="home">
       <MdHomeFilled/>
        <p>Home</p>
      </div>
      <div className="shorts">
        <SiYoutubeshorts/>
        <p>Shorts</p>
      </div>
      <div className="subscription">
        <MdOutlineSubscriptions/>
        <p>Subscriptions</p>
      </div>
      <div className="library">
        <MdOutlineLibraryAdd/>
        <p>You</p>
      </div>
    </div>
  )
}

export default MiniSideBar
