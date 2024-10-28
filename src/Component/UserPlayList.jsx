import React, { useContext, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { auth, firestore } from "../firebase/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import "../CSS/Library.css"
import BottomLayout from "./BottomLayout";
import { BsThreeDotsVertical } from "react-icons/bs";
import MiniSideBar from "./MiniSideBar";
import ToastNotification from "./ToastNotification";
import { videoContext } from "../Context/VideoContext";
function UserPlayList() {
  const videocontext = useContext(videoContext)
  const [queryParameters] = useSearchParams();
  const [user, setuser] = useState(null);
  const [listvideos, Setlistvideos] = useState([]);
  const [clickedVideoIndex,setclickedVideoIndex] = useState(null);
  const [Left,setLeft] = useState(null);
  const [Top,setTop] = useState(null);
  useEffect(() => {
    auth.onAuthStateChanged((LoggedInUser) => {
      setuser(LoggedInUser);
    });
  }, []);
  const searchQuery = queryParameters.get("list");
  useEffect(() => {
    const GetWatchlater = async () => {
      try {
        if (user) {
          const userDocRef = doc(firestore, "users", user?.uid);
          const User = await getDoc(userDocRef);
          const playlistdocref = await getDocs(
            collection(firestore, `users/${user?.uid}/${searchQuery}`)
          );
          const videos = playlistdocref.docs.map(async (playlistvideo) => {
            const VideoDocRef = doc(
              firestore,
              "videos",
              playlistvideo.data().videoURL
            );
            const videoData = await getDoc(VideoDocRef);
            return {
              videoId: playlistvideo.id,
              Videodata: videoData.data(),
            };
          });
          const resolvedPromises = Promise.all(videos);
          resolvedPromises.then((res) => {
            Setlistvideos({ listvideos: res, user: User.data() });
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    GetWatchlater();
  }, [user, searchQuery]);
  const showModal = (e,i) => {
    videocontext.setbottomlayout(true);
    setclickedVideoIndex(i);
    if(window.innerWidth <= 600){
     setLeft(null);
    setTop(null);
    }else{
      setLeft(e.pageX - 246);
      setTop(e.clientY);
    }
    document.body.style.overflow = "hidden";
  }
  useEffect(()=>{
    if(videocontext.bottomlayout){
     
       document.body.style.overflow="hidden";
    }
    else{
      document.body.style.overflow="scroll"
    } 
 },[videocontext.bottomlayout])
  const dots = document.getElementById("dots");
  if(dots){
    window.addEventListener("resize",()=>{
      if(window.innerWidth > 600){
      setLeft(dots.getBoundingClientRect().left - 246);
       }else{
        setLeft(null)
        setTop(null);
      }
    })
  }
  return (
    <>
    {listvideos.listvideos && (
      <>
    <MiniSideBar NonFilteredVideos={listvideos.listvideo && listvideos.listvideos}/>
    <div id="list">
     <div id="left">
        <div className="video">
          <img
            src={
              listvideos.listvideos[0].Videodata.Thumbnail
            }
            alt=""
          />
        </div>
        <div>
        <h3>{searchQuery == 'WL' ? "Watch later" : "Liked Videos"}</h3>
        </div>
        <p id="username">{listvideos.user?.name}</p>
        <p className="videoslength">{listvideos.listvideos.length} videos</p>
      </div>
      <div id="right">
      {listvideos.listvideos &&
            listvideos.listvideos.map((video, index) => {
              return (
                <div id="video" key={index}>
                  <Link to={`/watch/${video?.videoId}`}>
                    <div id="thumbnail_container" style={video?.Videodata.shortVideo ?{background:"black"}:{background:"unset"}}>
                      <img
                        src={video?.Videodata.Thumbnail}
                        alt=""
                        className="video" style={video?.Videodata.shortVideo ? {objectFit:"contain"}:{objectFit:"cover"}}
                      />
                   <p className="videoLength">{videocontext.returnvideoTime(video?.Videodata.videoLength)}</p>
                    </div>
                  </Link>
                  <div className="video_bottom">
                    <div className="video_bttom_left">
                      <div className="video_title_and_channelName">
                        <h3 id="video_title" className="title">
                          {video?.Videodata.Title}
                        </h3>
                        <div>
                          <p>
                            {listvideos.user?.name} • {video?.Videodata.views} Views • {videocontext.getVideoPublishedTime(video)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      onClick={(e) => {
                        showModal(e, index);
                      }}
                    >
                      <BsThreeDotsVertical
                        className="videomenu"
                        id={clickedVideoIndex === index ? "dots" : null}
                      />
                    </div>
                    {index === clickedVideoIndex && (
                      <>
                      {videocontext.bottomlayout && (
                        <BottomLayout
                          Left={Left}
                          Top={Top}
                          video={video?.Videodata}
                          videoURL={video?.videoId}
                          user={user}
                        />
                      )}
                      {videocontext.showToastNotification && (
                        <ToastNotification />
                    )}
                        </>
                    )}
                  </div>
                </div>
              );
            })}
      </div>
    </div>
    </>
  )}
    </>
  );
}

export default UserPlayList;
