import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../CSS/shortvideo.css";
import { BiLike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";
import { BiDislike } from "react-icons/bi";
import { BiSolidDislike } from "react-icons/bi";
import { RiMenu2Fill } from "react-icons/ri";
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa6";
import { MdOutlineMessage } from "react-icons/md";
import { VscUnmute } from "react-icons/vsc";
import { BsThreeDots } from "react-icons/bs";
import { IoMdPlay } from "react-icons/io";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useParams } from "react-router";
import {
  onSnapshot,
  doc,
  getDoc,
  collection,
} from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import { useNavigate } from "react-router";
import { auth } from "../firebase/firebase";
import Comment from "../Component/Comment";
import { videoContext } from "../Context/VideoContext";
import DescriptionPage from "./DescriptionPage";
import { VscMute } from "react-icons/vsc";
function ShortVideos() {
  let [Index, setIndex] = useState(0);
  const [user, SetUser] = useState(null);
  const [Loading, setLoading] = useState(true);
  const [Ispause, setIspause] = useState(false);
  const [isMuted, setisMuted] = useState(false);
  const [ShortVideos, setShortVideos] = useState([]);
  const [FilteredShortVideos, setFilteredShortVideos] = useState([]);
  const [videoWidth, setvideoWidth] = useState(window.innerWidth);
  const [videoHeight, setvideoHeight] = useState();
  const [shortvideoLayout,setshortvideoLayout] = useState(false);
  const [ActiveIndex,setActiveIndex] = useState(0);
  const [IsbtnDisable,setIsbtnDisable] = useState(false);
  const shortvideolayout = useRef();
  const Progressref = useRef();
  const containerRef = useRef();
  const touchStartRef = useRef(0); // To store the initial touch position
  const touchEndRef = useRef(0);
  const navigate = useNavigate();
  const params = useParams();
  const [windowHeight, setwindowHeight] = useState();
  const currentState = useContext(videoContext);
  useEffect(() => {
    try {
      onSnapshot(collection(firestore, "videos"), async (snapshot) => {
        const FetchedData = await Promise.all(
          snapshot.docs.map(async (Doc) => {
            const userRef = doc(firestore, "users", Doc.data().createdBy);
            const docSnap = await getDoc(userRef);
            return {
              id: Doc.id,
              Videodata: Doc.data(),
              UserData: docSnap.data(),
            };
          })
        );
        setShortVideos(FetchedData);
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    setFilteredShortVideos(
      ShortVideos.filter((shortVideo) => {
        return shortVideo.Videodata.shortVideo === true;
      })
    );
    // console.log(params.id)
  }, [ShortVideos]);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      SetUser(user);
    });
  }, []);
  useEffect(() => {
    setwindowHeight(window.innerHeight)
    if (window.innerWidth <= 700) {
      setvideoWidth(window.innerWidth);
      // setvideoHeight(videoWidth * (16/9));
    } else if (window.innerWidth > 700 && window.innerWidth <= 990) {
      setvideoWidth(565);
      setvideoHeight(window.innerHeight);
    } else if (window.innerWidth > 990) {
      setwindowHeight("unset")
      setvideoWidth("unset");
      setvideoHeight(window.innerHeight - 18);
    }
    const updateVideoSize = () => {
      setwindowHeight(window.innerHeight)
      if (window.innerWidth <= 700) {
        setvideoWidth(window.innerWidth);
        //  setvideoHeight(videoWidth * (16/9));
      } else if (window.innerWidth > 700 && window.innerWidth <= 990) {
        setvideoWidth(565);
        setvideoHeight(window.innerHeight);
      } else if (window.innerWidth > 990) {
        setwindowHeight("unset")
        setvideoWidth("unset");
        setvideoHeight(window.innerHeight - 18);
      }
    };
    window.addEventListener("resize", updateVideoSize);
    return () => {
      window.removeEventListener("resize", updateVideoSize);
    };
  }, [videoWidth, videoHeight,windowHeight]);

  const HandleLike = async (id) => {
    const LikedVideo = FilteredShortVideos.filter((video) => {
      return video.id === id;
    });
   await currentState.LikeVideo(user,params.id,LikedVideo[0].Videodata);
  };
  useEffect(()=>{
     currentState.checKLikedOrNot(user,params.id);
  },[params.id,FilteredShortVideos])
   useEffect(()=>{
        if(user){
          const LikedVideo = FilteredShortVideos.filter((video) => {
            return video.id === params.id;
          });
          currentState.checkCurrentWatchedVideo(user,params.id,LikedVideo[0]?.Videodata?.views);
        }
      },[params.id,user,FilteredShortVideos])
  const HandlePause = (e,currentVideoindex) => {
    setActiveIndex(currentVideoindex);
    setIspause(!Ispause);
    const short_video_container = document.querySelectorAll(".short_video_container");
    let currentContainer = short_video_container[Index];
    let video = currentContainer.getElementsByTagName("video").shortvideo;
    if (Ispause) video.play();
    else video.pause();
  };
  const HandleProgress = (e) => {
    const short_video_container = document.querySelectorAll(
      ".short_video_container"
    );
    let currentContainer = short_video_container[Index];
    const ProgressWidth = currentContainer.querySelector("span");
    const Progress = Math.round(
      (e.target.currentTime / e.target.duration) * 100
    );
    if (ProgressWidth) ProgressWidth.style.width = Progress + "%";
  };
  const handleTouchStart = (e) => {
    // Capture the initial Y position when touch starts
    touchStartRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    // Capture the final Y position when touch ends
    touchEndRef.current = e.changedTouches[0].clientY;
    handleSwipeGesture();
  };

  const handleSwipeGesture = () => {
    if (!touchEndRef.current || !touchStartRef.current) return;
    const swipeDistance = touchStartRef.current - touchEndRef.current;
    const swipeThreshold = 100; // Minimum distance to qualify as a swipe
    let currentVideo = document.querySelectorAll(".short_video_container");
    if (swipeDistance > swipeThreshold) {
      if (Index < FilteredShortVideos.length - 1) {
        GotoNextVideo();
        setIspause(false)
      }
    } else if (swipeDistance < -swipeThreshold) {
      // Swipe Down - Go to the previous video
      if (Index > 0 && Index < FilteredShortVideos.length) {
        GotoPreviousVideo();
        setIspause(false)
      }
    }
    if (currentVideo.style) {
      touchEndRef.current = touchStartRef.current = 0;
    }
  };
  const GotoNextVideo = () => {
    const shortVideoContainers = document.querySelectorAll( ".short_video_container");
    if (Index > shortVideoContainers.length) return; 
    let currentVideo = shortVideoContainers[Index];
    if(currentVideo.nextElementSibling){
    currentVideo.getElementsByTagName("video")[0].pause(); // Pause the current video
    currentVideo.nextElementSibling?.scrollIntoView({ behavior: "smooth",block:"start" }); // Scroll to the next video
    currentVideo.nextElementSibling.style.scrollSnapAlign = "start"; // Snap the next video to the start of the container

    setIndex(Index + 1);
    navigate(
      `/short/${
        currentVideo.nextElementSibling?.getElementsByTagName("video")[0]
          .dataset.video
      }`
    );
    setActiveIndex(parseInt(currentVideo.nextElementSibling?.getElementsByTagName("video")[0].dataset.index))
    currentVideo.style.scrollSnapAlign = "unset";
  };
  };
  const GotoPreviousVideo = () => {
    const shortVideoContainers = document.querySelectorAll(".short_video_container");
    if (Index <= 0) return;
    let currentVideo = shortVideoContainers[Index];
    currentVideo.getElementsByTagName("video")[0].pause(); 
    currentVideo.previousElementSibling?.scrollIntoView({ behavior: "smooth" });
    currentVideo.previousElementSibling.style.scrollSnapAlign = "end";
    setIndex(Index - 1);
    navigate(`/short/${currentVideo.previousElementSibling?.getElementsByTagName("video")[0].dataset.video}`);
    setActiveIndex(parseInt(currentVideo.previousElementSibling?.getElementsByTagName("video")[0].dataset.index))
    currentVideo.style.scrollSnapAlign = "unset";
  };
  useEffect(() => {
    const handleKeyup = (e) => {
      
      if (e.key === "ArrowDown" || e.keyCode === 40) {
        if(currentState.Description){
          currentState.setDescription(false);
          currentState.setshortvideoShowMessages(false);
        } 
        GotoNextVideo();
      } else if (e.key === "ArrowUp") {
        if(currentState.Description){
          currentState.setDescription(false);
          currentState.setshortvideoShowMessages(false);
        } 
        GotoPreviousVideo();
      }
  }
  if( !currentState.shortvideoShowMessages || !currentState.Description)window.addEventListener("keyup", handleKeyup);
    return () => {
      window.removeEventListener("keyup", handleKeyup);
    };
  }, [Index, FilteredShortVideos,currentState.shortvideoShowMessages,currentState.Description]);
  useEffect(() => {
      try{
        let currentVideo = document.querySelectorAll(".short_video_container")[Index];
    if (currentVideo) {
     const promise =  currentVideo.getElementsByTagName("video").shortvideo.play();
     if(promise !== undefined){
      promise.then(_=>{
        console.log("Autoplay started")
      }).catch((error)=>{
        console.log(error);
        currentVideo.getElementsByTagName("video").shortvideo.muted = true;
        setisMuted(true);
        currentVideo.getElementsByTagName("video").shortvideo.play();
      })
     }
    }
    }catch(error){
      console.log(error.message);
    }
  }, [Index, FilteredShortVideos]);
  const sectionTouch = (e) => {
    touchStartRef.current = e.touches[0].clientY;
  }
  const drageSection = (e) => {
    touchEndRef.current = e.changedTouches[0].clientY;
    const swipeDistance = touchStartRef.current - touchEndRef.current;
    
    shortvideolayout.current.style.transform= `translateY(${Math.abs(swipeDistance)}px)`;
  }
  const HideLayout = () => {
    const swipeDistance = touchStartRef.current - touchEndRef.current;
    if(swipeDistance <= -60){
      shortvideolayout.current.style.display = "none";
      setshortvideoLayout(false);
      document.body.style.overflow = "Scroll";
    }else{
      shortvideolayout.current.style.transform= `translateY(0px)`;
    }
  } 
  const subscribeChannel = async(creatorData) => {
    setIsbtnDisable(true);
    await currentState.subscribeChannel(user,creatorData);
    setIsbtnDisable(false);
  }
   useEffect(()=>{
          const checkSubscribedOrNot = async() => {
            if(user){
              const currentVideo = FilteredShortVideos.filter((video)=>{
                return params.id == video.id
              });
            await currentState.CheckSubscribedOrNot(user,currentVideo[0]?.UserData);
        }
            }
          checkSubscribedOrNot()
        },[user,params.id,FilteredShortVideos]);
        const HandleMute = () =>{
          const short_video_container = document.querySelectorAll(".short_video_container");
          let currentContainer = short_video_container[Index];
          let video = currentContainer.getElementsByTagName("video").shortvideo;
          video.muted = !isMuted;
          setisMuted(!isMuted);
}
useEffect(()=>{
 currentState.getWatchlaterVideo(user,params.id);
},[params.id,FilteredShortVideos])
  return Loading ? (
    <p className="text-white">Loading...</p>
  ) : (
    <div
      className="shortVideos_container"
      ref={containerRef}
      id="shortVideoscontainer"
      onTouchStart={
        !currentState.shortvideoShowMessages ? handleTouchStart : null
      }
      onTouchEnd={!currentState.shortvideoShowMessages ? handleTouchEnd : null}
      style={currentState.shortvideoShowMessages || currentState.Description ? { pointerEvents: "none" } : null}
    >
      <Link to={"/youtube-clone"}>
        <IoIosArrowRoundBack className="back_icon" />
      </Link>
      {FilteredShortVideos.map((shortvideo, index) => {
        return (
          <div
            className="short_video_container"
            key={index}
            style={
              currentState.shortvideoShowMessages
                ? { height:windowHeight, position: "unset" }
                : {  height:windowHeight, position: "relative" }
            }
            data-id={shortvideo.id}
          >
            <video
              src={shortvideo.Videodata.videoURL}
              id="shortvideo"
              data-video={shortvideo.id}
              onClick={(e)=>{HandlePause(e,index)}}
              onTimeUpdate={HandleProgress}
              data-id={params.id}
              playsInline={true}
              data-index={index}
              style={{ width: videoWidth,height:videoHeight }}
            />

            {Ispause && ActiveIndex === index ? (
              <div className="shortVideo_middle_control" onClick={(e)=>{HandlePause(e,index)}}>
                <IoMdPlay/>
              </div>
            ) : null}
            <div
              className={`short_details ${Ispause && ActiveIndex === index ? "ActivesmalldevicesBottomtransition":"RemovesmalldevicesBottomtransition"}`}
              style={
                currentState.shortvideoShowMessages || currentState.Description? { zIndex: "0",visibility:"hidden" }: { zIndex: "10", position: "absolute",visibility:"visible"}
              }
            >
              <div className="short_channel">
                <img src={shortvideo.UserData.channelPic || shortvideo.UserData.channelURL} alt="" />
                <p>{shortvideo.UserData.name}</p>
                {currentState.isSubscribed === true ? <button className="subscribe_btn subscribed_btn" style={{background: "rgba(255, 255, 255, 0.1)"}} onClick={()=>{subscribeChannel(shortvideo.UserData)}} disabled={IsbtnDisable ? true : false}>Subscribed</button>:<button className="subscribe_btn" onClick={()=>{subscribeChannel(shortvideo.UserData)}} style={{backgroundColor:" #fff"}} disabled={IsbtnDisable ? true : false}>Subscribe</button>} 
              </div>
              <div className="short_title">
                <p>{shortvideo.Videodata.Title}</p>
              </div>
              <div id="shortvideoprogressBar" className={`shortvideoprogressBar ${Ispause && ActiveIndex === index ? "ActivesmalldevicesProgressWidthtransition":"RemovesmalldevicesProgressWidthtransition"}`}>
                <span id="short_progressBar_width" ref={Progressref}></span>
              </div>
            </div>
            <div
              className={`short_controls ${Ispause && ActiveIndex === index ? "ActivesmalldevicesBottomtransition":"RemovesmalldevicesBottomtransition"}`}
              id="shortcontrols"
              style={
                currentState.shortvideoShowMessages || currentState.Description ? { zIndex: "0", position: "absolute"}: { zIndex: "10", position: "absolute"}
              }
            >
              <div className="like control" style={
                currentState.shortvideoShowMessages || currentState.Description? { visibility:"hidden" }: {visibility:"visible"}
              }>
                {currentState.isLiked ? (
                  <BiSolidLike onClick={() => HandleLike(shortvideo.id)}/>
                ) : (
                  <BiLike onClick={() => HandleLike(shortvideo.id)} />
                )}
                <p>{shortvideo.Videodata.likes}</p>
              </div>
              <div className="dislike control" style={
                currentState.shortvideoShowMessages || currentState.Description? { visibility:"hidden" }: {visibility:"visible"}
              }>
                {currentState.isDisLiked ? <BiSolidDislike onClick={() => {currentState.DisLikeVideo(user,params.id,shortvideo.Videodata)}}/> : <BiDislike onClick={() => {currentState.DisLikeVideo(user,params.id,shortvideo.Videodata)}}/>}
                <p>Dislike</p>
              </div>
              <div
                className="message control"
                onClick={() => {
                  currentState.setshortvideoShowMessages(true);
                  document.body.style.overflowY = "hidden";
                }}
                style={
                  currentState.shortvideoShowMessages || currentState.Description? { visibility:"hidden" }: {visibility:"visible"}
                }
              >
                <MdOutlineMessage />
                <p>{shortvideo.Videodata.NumberOfComments}</p>
              </div>
              {currentState.shortvideoShowMessages === true && (
                ActiveIndex == index &&(
                <div className="shortVivdeoComment">
                  {" "}
                  <Comment
                    video={shortvideo.Videodata}
                    user={shortvideo.UserData}
                    videoId={params.id}
                  />
                </div>
                )
              )}
              <div className="menu control" onClick={()=>{setshortvideoLayout(!shortvideoLayout);document.body.style.overflow="hidden"}} style={
                currentState.shortvideoShowMessages || currentState.Description? { visibility:"hidden" }: {visibility:"visible"}
              } >
                <BsThreeDots />
              </div>
              <div className="channel control" style={
                currentState.shortvideoShowMessages || currentState.Description? { visibility:"hidden" }: {visibility:"visible"}
              }>
                <img
                  src={shortvideo.UserData.channelPic || shortvideo.UserData.channelURL}
                  alt=""
                  style={{ width: "45px", borderRadius: "10px" }}
                />
              </div>
            </div>
            {shortvideoLayout && (
              ActiveIndex === index && (
            <div className="shortvideolayout" ref={shortvideolayout}>
              <div className="line" onTouchMove={drageSection} onTouchStart={sectionTouch} onTouchEnd={HideLayout}><span></span></div>
              <div className="menuitems">
              <div onClick={()=>{currentState.setDescription(true);setActiveIndex(index);setshortvideoLayout(false)}}><RiMenu2Fill/><p>Description</p></div>
              <div onClick={()=>{currentState.WatchLater(user,params.id)}}>{currentState.isSaved ?<><FaRegBookmark/><p>Save To Watch later</p> </>: <><FaBookmark/><p>Remove From watchlater</p></>}</div>
              <div onClick={HandleMute}>{isMuted ? <VscMute/> : <VscUnmute/>}<p>Mute</p></div>
              </div>
            </div>
              )
           )}
            {currentState.Description === true && (
                ActiveIndex == index &&(
                  <DescriptionPage isshortVideo/>
                )
             )}
          </div>
        );
      })}
    </div>
  );
}
export default ShortVideos;
