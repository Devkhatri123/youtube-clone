import React, { useState,useEffect } from 'react'
import { GoHistory } from "react-icons/go";
import "../CSS/Library.css"
import WatchedVideos from './WatchedVideos';
import { IoPlayOutline } from "react-icons/io5";
import { MdOutlineVideocam } from "react-icons/md";
import UploadVideo from './uploadVideo';
import { auth } from '../firebase/firebase';
import NotSignedIn from './NotSignedIn';
function Library() {
    let [isUploadVideoEnabled,setisUploadVideoEnabled] = useState(false);
    let [user,Setuser] = useState(null);
    const HandleUploadVideo = () => {
        setisUploadVideoEnabled(true);
    }
    useEffect(() => {
      auth.onAuthStateChanged((user) => {
        Setuser(user);
        console.log(user);
      });
    }, []);
  return (
    <div className='library'>
      {user?
      <>
      <div className="top_Section">
        <div className="left">
        <GoHistory/>
        <h4>History</h4>
        </div>
        <a href='#' className='viewAll'>View all</a>
      </div>
      <div className="watched_Videos">
        <WatchedVideos/>
      </div>
      <div className="createVideo">
        <a href="#">
      <IoPlayOutline/>
      <p>Your Vidoes</p>
      </a>
      <a href="#" >
      <MdOutlineVideocam onClick={HandleUploadVideo}/>
      <p onClick={HandleUploadVideo}>Create Vidoe</p>
      
      </a>
      {isUploadVideoEnabled === true ? <UploadVideo/>:null}
      </div>
      </>
      :<NotSignedIn/>}
    </div>
   
  )
}

export default Library
