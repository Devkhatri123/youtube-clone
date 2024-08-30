import React, { useState,useEffect } from 'react'
import { GoHistory } from "react-icons/go";
import "../CSS/Library.css"
import WatchedVideos from './WatchedVideos';
import { IoPlayOutline } from "react-icons/io5";
import { MdOutlineVideocam } from "react-icons/md";
import UploadVideo from './uploadVideo';
import { CgPlayList } from "react-icons/cg";
import { FiClock } from "react-icons/fi";
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
      isUploadVideoEnabled ? (
        <UploadVideo />
      ) : (
        user ? (
          <div className='library'>
            <div className="top_Section">
              <div className="left">
                <GoHistory />
                <h4>History</h4>
              </div>
              <a href='#' className='viewAll'>View all</a>
            </div>
            <div className="watched_Videos">
              <WatchedVideos />
            </div>
            <div className="playlists">
              <div className="playlist-header">
                <h3>Playlists</h3>
              </div>
              <div className='playlists-cards'>
              <div class="playlist-card">
        <div class="thumbnail">
        <img src="https://firebasestorage.googleapis.com/v0/b/reactapp-9cd63.appspot.com/o/Thumbnail%2F455f776c-9a03-4914-a45d-92234ea434da?alt=media&token=c8df2950-3d75-4c33-9117-f243aa8d9f52" alt=""/>
            <div class="overlay">
                <span class="video-count"><CgPlayList /> 653 videos</span>
            </div>
        </div>
    </div>
    <div class="playlist-card">
        <div class="thumbnail">
        <img src="https://firebasestorage.googleapis.com/v0/b/reactapp-9cd63.appspot.com/o/Thumbnail%2F455f776c-9a03-4914-a45d-92234ea434da?alt=media&token=c8df2950-3d75-4c33-9117-f243aa8d9f52" alt=""/>
            <div class="overlay">
            <FiClock  style={{fontsize: "1.3em"}}/>
                <span class="watchlater-video-count" style={{fontsize: "0.9em"}}> 70 videos</span>
            </div>
            
        </div>
        </div>
    </div>
            </div>
            <div className="createVideo">
              <a href="#">
                <IoPlayOutline />
                <p>Your Videos</p>
              </a>
              <a href="#" >
                <MdOutlineVideocam onClick={HandleUploadVideo} />
                <p onClick={HandleUploadVideo}>Create Video</p>
              </a>
            </div>
          </div>
        ) : (
          <NotSignedIn />
        )
      )
    );
    
}

export default Library
