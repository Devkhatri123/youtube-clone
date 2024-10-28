import React, { useState,useEffect, useRef, useContext } from 'react'
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
import ErrorPage from './ErrorPage';
import { videoContext } from '../Context/VideoContext';
function Library() {
    const videocontext = useContext(videoContext);
    const contentsRef = useRef();
    let [isUploadVideoEnabled,setisUploadVideoEnabled] = useState(false);
    let [user,Setuser] = useState(null);
    const [scrolled,setscrolled] = useState(false);
    const [Loading,setLoading] = useState(true);
    const [LikedVideos,setLikedVideos] = useState([]);
    const [Watchlater,setWatchlater] = useState([]);
    const [error,setError] = useState(false)
    const [ErrorMessage,setErrorMessage] = useState(false)
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
      if(User.data()){
      onSnapshot(collection(firestore,`users/${user?.uid}/LV`),async(snanpShot)=>{
       const fetchedLikedVideos = await Promise.all(
        snanpShot.docs.map(async(Doc)=>{
         const VideoDocRef = doc(firestore,"videos",Doc.id);
         const getVideo = await getDoc(VideoDocRef);
         return {
          videoId:VideoDocRef.id,
          Videodata:getVideo.data(),
          // userData:User.data(),
         }
        },(error)=>{
          setError(true)
          setErrorMessage(error.message)
          console.log(error)
        }
      ),
      
      )
      setLikedVideos({LikedVideos:fetchedLikedVideos,user:User.data()})
      });
    }
    }
    setLoading(false)
    }catch(error){
      console.log(error);
      setError(true)
      setErrorMessage(error.message)
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

        onSnapshot(collection(firestore,`users/${user?.uid}/WL`),async(snanpShot)=>{
         const fetchedWatchlatervideos = await Promise.all(
          snanpShot.docs.map(async(Doc)=>{
           const VideoDocRef = doc(firestore,"videos",Doc.id);
           const getVideo = await getDoc(VideoDocRef);
           return {
            videoId:VideoDocRef.id,
            Videodata:getVideo.data(),
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
    console.log(Watchlater);
    
    },[Watchlater])
    const HandleUploadVideo = () => {
        setisUploadVideoEnabled(true);
    }
    const scrollLikeVideoRight = (e) => {
      contentsRef.current.scrollBy({
        left: 847,
        behavior: 'smooth'
    });
    setscrolled(true);
    }
    const scrollLikeVideoLeft = (e) => {
     contentsRef.current.scrollBy({
        left: -847,
        behavior: 'smooth'
    });
    setscrolled(false)
    }
    return (
      isUploadVideoEnabled ? (
        <UploadvideoProvider>
        <UploadVideo />
        </UploadvideoProvider>
      ) : (
        user ? (
          !error || !ErrorMessage ? (
            <div className='libraryPage'>
            <div className="watched_Videos">
           
              <WatchedVideos />
            </div>
            {LikedVideos.LikedVideos && LikedVideos.LikedVideos.length > 0 &&(
              
              <>
            <div className="playlists">
              <div className="playlist-header">
                <h3>Playlists</h3>
              </div>
              <div className='playlists-cards'>
                {!Loading ? (
                  LikedVideos.LikedVideos && (
              <div className="playlist-card">
                <Link to={`/playlist?list=LV`}>
        <div class="thumbnail">
      {LikedVideos.LikedVideos &&
      <>
       <img src={LikedVideos.LikedVideos[0]?.Videodata.Thumbnail} alt=""/>
            <div className="overlay">
            <BiLike style={{fontsize: "1.5rem"}}/>
            <p>Liked Videos</p>
                <span className="video-count"><CgPlayList />{LikedVideos.LikedVideos.length} {LikedVideos.LikedVideos.length > 1 ? "videos":"video"} </span>
            </div>
            </>
}
        </div>
        </Link>
    </div>
  )
  ):<p>Loading...</p>}
    {!Loading ? (
      Watchlater.Watchlater &&
    <div class="playlist-card">
      <Link to={`/playlist?list=WL`}>
        <div className="thumbnail">
      <>
       <img src={Watchlater.Watchlater[0].Videodata.Thumbnail} alt=""/>
            <div className="overlay">
            <FiClock style={{fontsize: "1.5rem"}}/>
            <p>Watch Later Videos</p>
                <span className="video-count"><CgPlayList />{Watchlater.Watchlater?.length} {Watchlater.Watchlater?.length > 1 ? "videos":"video"} </span>
            </div>
            </>
        </div>
        </Link>
    </div>
     ):<p>Loading...</p>}
    </div>
            </div>
            </>
    )}
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
            {LikedVideos.LikedVideos && LikedVideos.LikedVideos.length > 0 && (
              <>
             <div  className='Shelf'>
             <div  className='Shelf-header'>
             <h3>Liked Videos <span style={{color:"#8e9493"}}>{LikedVideos.LikedVideos.length}</span></h3>
             <Link to={`/playlist?list=LV`}>View all</Link>
             </div>
             <div id="contents" ref={contentsRef}>
             {LikedVideos && LikedVideos.LikedVideos.slice(0,6).map((LikedVideo,index)=>{
              return <div id="video" key={index}>
              <Link to={`/watch?v=${LikedVideo?.videoId}`}>
              <div id="thumbnail_container">
              <img src={LikedVideo.Videodata?.Thumbnail} alt="" className="video"/>
              <p className='videoLength'>{videocontext.returnvideoTime(LikedVideo.Videodata.videoLength)}</p>
              </div>
                 </Link>
                 <div className="video_bottom">
                              <div className="video_bttom_left">
                                <div className="video_title_and_channelName">
                                  <h3 id="video_title" className="title">
                                    {LikedVideo.Videodata?.Title}
                                  </h3>
                                  <div>
                                  <p>
                            {LikedVideos.user?.name} • {LikedVideo.Videodata.views} Views • {videocontext.getVideoPublishedTime(LikedVideo)}
                          </p>
                                  </div>
                                </div>
                              </div>
                    <BsThreeDotsVertical className="videomenu" />
                </div>
                </div>
             })}
             </div>
             {LikedVideos.LikedVideos.length >= 5 &&   <div className="forwardIcon" style={{display: !scrolled?"block": "none"}} onClick={(e)=>{scrollLikeVideoRight(e)}}><IoIosArrowForward/></div>}
             <div className="backwardIcon" style={{display: scrolled?"block": "none"}} onClick={(e)=>{scrollLikeVideoLeft(e)}}><IoIosArrowBack/></div>
             </div>
             
             </>
            )}
            { Watchlater.Watchlater&&Watchlater.Watchlater.length > 0 &&(
             <div  className='Shelf'>
             <div  className='Shelf-header'>
             <h3>Watch later <span style={{color:"#8e9493"}}>{Watchlater?.Watchlater?.length}</span></h3>
            <Link to={`/playlist?list=WL`}>View all</Link>
             </div>
            <div id="contents">
            {Watchlater.Watchlater && Watchlater.Watchlater.slice(0,6).map((Watchlatervideo,i)=>{
              return <div id="video" key={i}>
              <Link to={`/watch?v=${Watchlatervideo.Videodata?.videoId}`}>
              <div id="thumbnail_container">
              <img src={Watchlatervideo.Videodata?.Thumbnail} alt="" className="video"/>
             <p className='videoLength'>{videocontext.returnvideoTime(Watchlatervideo.Videodata.videoLength)}</p>
              </div>
                 </Link>
                 <div className="video_bottom">
                              <div className="video_bttom_left">
                                <div className="video_title_and_channelName">
                                  <h3 id="video_title" className="title">
                                    {Watchlatervideo.Videodata?.Title}
                                  </h3>
                                  <div>
                                  <p>
                            {Watchlater.user?.name} • {Watchlatervideo.Videodata.views} Views • {videocontext.getVideoPublishedTime(Watchlatervideo)}
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
            )}
          </div>
          ):<ErrorPage ErrorMessage={ErrorMessage}/>
        ) : (
          <NotSignedIn />
        )
      )
    );
    
}

export default Library
