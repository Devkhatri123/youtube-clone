import React,{useEffect, useState} from 'react'
import Navbar from './Navbar'
import { onSnapshot,collection,getDoc,doc } from 'firebase/firestore'
import { auth, firestore } from '../firebase/firebase'
import { Link } from 'react-router-dom'
import BottomLayout from './BottomLayout'
import { BsThreeDotsVertical } from 'react-icons/bs'
import "../CSS/History.css"
import shortsIcon from "../Pics/Youtube_shorts_icon.webp";

 function History() {
    const [watchedVideos,setwatchedVideos] = useState([]);
    const [LoggedInUser,setLoggedInUser] = useState(null);
    const [bottomLayout,setbottomLayout] = useState(false);
    const [ActiveVideoIndex,setActiveVideoIndex] = useState(null);
    const [Left,setLeft] = useState(null);
    const [Top,setTop] = useState(null);
    useEffect(()=>{
     auth.onAuthStateChanged((currentUser)=>{
        setLoggedInUser(currentUser);
     })
    },[])
    const GetWatchedVideos = () => {
        if(LoggedInUser){
        onSnapshot(collection(firestore,`users/${LoggedInUser?.uid}/watchedVideos`),async(snanpShot)=>{
         const Data = await Promise.all(
          snanpShot.docs.map(async(Doc)=>{
           const VideoDocRef = doc(firestore,"videos",Doc.data().videoUrl);
           const getVideo = await getDoc(VideoDocRef);
           const userDocRef = doc(firestore,"users",getVideo.data()?.createdBy);
           const user = await getDoc(userDocRef);
           return {
            videoId:VideoDocRef.id,
            Videodata:getVideo.data(),
            UserData:user.data(),
           }
          }),
      )
    setwatchedVideos(Data)
    console.log(Data)
        })
    }
      }
      useEffect(()=>{
        GetWatchedVideos();
      },[]);
    useEffect(()=>{
    console.log(watchedVideos)
    },[watchedVideos])
    const showLayout = (e,i) => {
        setbottomLayout(!bottomLayout);
        setActiveVideoIndex(i);
        if(window.innerWidth > 600){
        setLeft(e.pageX - 246);
        setTop(e.clientY);
        }else{
          setLeft(null);
          setTop(null);
        }
        document.body.style.overflow = "hidden";
      }
      const dots = document.getElementById('dots');
if(dots){
  window.addEventListener("resize",()=>{
    if(window.innerWidth > 600){
    setLeft(dots.getBoundingClientRect().left - 246);
    setTop(dots.getBoundingClientRect().y + 9);
    }else{
      setLeft(null);
      setTop(null);
    }
  })
}
  return (
    <>
    <Navbar/>
    {watchedVideos.length > 0 ? (
    <div id='historypage'>
      <h1>History Page</h1>
      <div className="Watchedvideos">
        {/* Shorts Section First */}
        <div className="shortsShelf">
        <div className="shelf-header">
           <img src={shortsIcon} alt="shorts-icon" />
           <h4>Shorts</h4>
        </div>
        {watchedVideos && watchedVideos.filter((video)=>{
            return video.Videodata.shortVideo
        }).map((shortvideo,index)=>{
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
        <div className="FullLengthVideos">
            {watchedVideos && watchedVideos.filter((FullLengthVideo)=>{
                return !FullLengthVideo.Videodata.shortVideo
            }).map((FullLengthVideo,index)=>{
                return  <div id="video" key={index}>
                <Link to={`/watch?v=${FullLengthVideo.videoId}`}>
                <div id="thumbnail_container">
                <img src={FullLengthVideo.Videodata.Thumbnail} alt="" className="video"/>
                </div>
                   </Link>
                   <div className="video_bottom">
                                <div className="video_bttom_left">
                                <Link to={`/${FullLengthVideo.Videodata.createdBy}/${FullLengthVideo.UserData?.name.replace(" ","")}/videos`} >
                                  <img
                                    src={FullLengthVideo.UserData?.channelPic}
                                    alt={FullLengthVideo.UserData?.name}
                                  />
                                  </Link>
                                  <div className="video_title_and_channelName">
                                    <h3 id="video_title" className="title">
                                      {FullLengthVideo.Videodata?.Title}
                                    </h3>
                                    <div>
                                      <p>
                                        {FullLengthVideo.UserData?.name} •
                                        {" "} {FullLengthVideo.Videodata?.views} Views
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div onClick={(e)=>{showLayout(e,index)}}><BsThreeDotsVertical className="videomenu" id={ActiveVideoIndex === index ? 'dots':null}/></div>
                  </div>
                  {bottomLayout && (
                    ActiveVideoIndex === index && (
                  <BottomLayout Left={Left} Top={Top} videoURL = {FullLengthVideo.videoId} user={LoggedInUser}/>
                    )
                  )}
                  </div>
            })}
        </div>
      </div>
    </div>
    ):<p style={{display:"flex",justifyContent:"center",alignItems:"center",height:"50vh",color:"white"}}>No videos</p>}
    </>
  )
}
export default History
