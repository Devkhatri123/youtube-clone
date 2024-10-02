import React, { useState,useEffect, useRef } from 'react'
import { GoHistory } from "react-icons/go";
import "../CSS/Library.css"
import WatchedVideos from './WatchedVideos';
import { IoPlayOutline } from "react-icons/io5";
import { BiLike } from "react-icons/bi";
import { IoIosArrowBack } from "react-icons/io";
import { MdOutlineVideocam } from "react-icons/md";
import UploadVideo from './uploadVideo';
import { CgPlayList } from "react-icons/cg";
import { FiClock } from "react-icons/fi";
import { BsThreeDotsVertical } from 'react-icons/bs';
import { IoIosArrowForward } from "react-icons/io";
import { auth } from '../firebase/firebase';
import NotSignedIn from './NotSignedIn';
import { onSnapshot,doc,getDoc,collection } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import UploadvideoProvider from '../Context/UploadVideoContext';
import { Link } from 'react-router-dom';
function Library() {
    const contentsRef = useRef();
    let [isUploadVideoEnabled,setisUploadVideoEnabled] = useState(false);
    let [user,Setuser] = useState(null);
    const [Loading,setLoading] = useState(true);
    const [LikedVideos,setLikedVideos] = useState([]);
    const [Watchlater,setWatchlater] = useState([]);
    useEffect(() => {
      auth.onAuthStateChanged((user) => {
        Setuser(user);
        console.log(user);
      });
    }, []);

    const GetLikedVideos = async() => {
      try{
        setLoading(true);
        if(user){
      const userDocRef = doc(firestore,"users",user?.uid);
      const User = await getDoc(userDocRef);
      onSnapshot(collection(firestore,`users/${user?.uid}/LikedVideos`),async(snanpShot)=>{
       const fetchedLikedVideos = await Promise.all(
        snanpShot.docs.map(async(Doc)=>{
         const VideoDocRef = doc(firestore,"videos",Doc.id);
         const getVideo = await getDoc(VideoDocRef);
         return {
          videoId:VideoDocRef.id,
          LikedvideoData:getVideo.data(),
          // userData:User.data(),
         }
        }),
      )
      setLikedVideos({LikedVideos:fetchedLikedVideos,user:User.data()})
      });
    }
    setLoading(false)
    }catch(error){
      console.log(error);
      setLoading(false)
    }
    }
   


    useEffect(()=>{
      GetLikedVideos();

    },[user]);
    useEffect(()=>{
      const GetWatchlater = async() => {
        try{
          setLoading(true);
          if(user){
        const userDocRef = doc(firestore,"users",user?.uid);
        const User = await getDoc(userDocRef);
        onSnapshot(collection(firestore,`users/${user?.uid}/Watchlater`),async(snanpShot)=>{
         const fetchedWatchlatervideos = await Promise.all(
          snanpShot.docs.map(async(Doc)=>{
           const VideoDocRef = doc(firestore,"videos",Doc.id);
           const getVideo = await getDoc(VideoDocRef);
           return {
            videoId:VideoDocRef.id,
            WatchlatervideoData:getVideo.data(),
            // userData:User.data(),
           }
          }),
        )
        setWatchlater({Watchlater:fetchedWatchlatervideos,user:User.data()})
        });
      }
      setLoading(false)
      }catch(error){
        console.log(error);
        setLoading(false)
      }
      }
    GetWatchlater()
    },[user]);
    useEffect(()=>{
    console.log(Watchlater.user);
    
    },[Watchlater])
    const HandleUploadVideo = () => {
        setisUploadVideoEnabled(true);
    }
    const ScrollRight = (e) => {
      console.log(e)
      const forwardIcon = document.getElementsByClassName("forwardIcon")[0];
      const backwardIcon = document.getElementsByClassName("backwardIcon")[0];
      contentsRef.current.scrollBy({
        left: 847,
        behavior: 'smooth'
    });
    forwardIcon.style.display = "none";
    backwardIcon.style.display = "block"
    console.log(forwardIcon)
    }
    const ScrollLeft = (e) => {
     console.log(e)
      const forwardIcon = document.getElementsByClassName("forwardIcon")[0];
      const backwardIcon = document.getElementsByClassName("backwardIcon")[0];
      contentsRef.current.scrollBy({
        left: -847,
        behavior: 'smooth'
    });
    forwardIcon.style.display = "block";
    backwardIcon.style.display = "none"
    }
    return (
      isUploadVideoEnabled ? (
        <UploadvideoProvider>
        <UploadVideo />
        </UploadvideoProvider>
      ) : (
        user ? (
          <div className='libraryPage'>
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
                {!Loading ? (
              LikedVideos && (
              <div className="playlist-card">
        <div class="thumbnail">
      {LikedVideos.LikedVideos &&
      <>
       <img src={LikedVideos.LikedVideos[1].LikedvideoData.Thumbnail} alt=""/>
            <div className="overlay">
            <BiLike style={{fontsize: "1.5rem"}}/>
            <p>Liked Videos</p>
                <span className="video-count"><CgPlayList />{LikedVideos.LikedVideos.length} {LikedVideos.LikedVideos.length > 1 ? "videos":"video"} </span>
            </div>
            </>
}
        </div>
    </div>
    )
  ):<p>Loading...</p>}
    <div class="playlist-card">
        <div className="thumbnail">
      {LikedVideos.LikedVideos &&
      <>
       <img src={LikedVideos.LikedVideos[1].LikedvideoData.Thumbnail} alt=""/>
            <div className="overlay">
            <FiClock style={{fontsize: "1.5rem"}}/>
            <p>Watch Later Videos</p>
                <span className="video-count"><CgPlayList />{Watchlater?.Watchlater?.length} {Watchlater?.Watchlater?.length > 1 ? "videos":"video"} </span>
            </div>
            </>
}
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
            {LikedVideos.LikedVideos && (
              <>
             <div  className='Shelf'>
             <div  className='Shelf-header'>
             <h3>Liked Videos <span style={{color:"#8e9493"}}>{LikedVideos.LikedVideos.length}</span></h3>
             <a href="#">View all</a>
             </div>
             <div id="contents" ref={contentsRef}>
             {LikedVideos.LikedVideos && LikedVideos.LikedVideos.filter((LikedVideo)=>{
              return !LikedVideo.LikedvideoData.shortVideo
            }).slice(0,6).map((LikedVideo,index)=>{
              return <div id="video" key={index}>
              <Link to={`/watch?v=${LikedVideo.videoId}`}>
              <div id="thumbnail_container">
              <img src={LikedVideo.LikedvideoData.Thumbnail} alt="" className="video"/>
              </div>
                 </Link>
                 <div className="video_bottom">
                              <div className="video_bttom_left">
                                <div className="video_title_and_channelName">
                                  <h3 id="video_title" className="title">
                                    {LikedVideo.LikedvideoData?.Title}
                                  </h3>
                                  <div>
                                    <p>
                                      {LikedVideos.user?.name} •
                                      {" "} {LikedVideo.LikedvideoData?.views} Views
                                    </p>
                                  </div>
                                </div>
                              </div>
                    <BsThreeDotsVertical className="videomenu" />
                </div>
                </div>
             })}
             </div>
             <div className='forwardIcon ' onClick={(e)=>{ScrollRight(e)}}><IoIosArrowForward/></div>
             <div className="backwardIcon" style={{display:"none"}} onClick={(e)=>{ScrollLeft(e)}}><IoIosArrowBack/></div>
             </div>
             
             </>
            )}
             <div  className='Shelf'>
             <div  className='Shelf-header'>
             <h3>Watch later <span style={{color:"#8e9493"}}>{Watchlater?.Watchlater?.length}</span></h3>
             <a href="#">View all</a>
             </div>
            <div id="contents">
            {Watchlater.Watchlater && Watchlater.Watchlater.filter((Watchlatervideo)=>{
              return !Watchlatervideo.WatchlatervideoData.shortVideo;
            }).slice(0,6).map((Watchlatervideo,i)=>{
              return <div id="video" key={i}>
              <Link to={`/watch?v=${Watchlatervideo.WatchlatervideoData.videoId}`}>
              <div id="thumbnail_container">
              <img src={Watchlatervideo.WatchlatervideoData.Thumbnail} alt="" className="video"/>
              </div>
                 </Link>
                 <div className="video_bottom">
                              <div className="video_bttom_left">
                                <div className="video_title_and_channelName">
                                  <h3 id="video_title" className="title">
                                    {Watchlatervideo.WatchlatervideoData?.Title}
                                  </h3>
                                  <div>
                                    <p>
                                      {Watchlater.user?.name} •
                                      {" "} {Watchlatervideo.WatchlatervideoData?.views} Views
                                    </p>
                                  </div>
                                </div>
                              </div>
                    <BsThreeDotsVertical className="videomenu" />
                </div>
                </div>
            })
            }
            </div>
            </div>
          </div>
        ) : (
          <NotSignedIn />
        )
      )
    );
    
}

export default Library
