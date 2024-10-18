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
import { BsThreeDots } from "react-icons/bs";
import { IoMdPlay } from "react-icons/io";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useParams } from "react-router";
import {
  onSnapshot,
  doc,
  getDoc,
  collection,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import { useNavigate } from "react-router";
import { auth } from "../firebase/firebase";
import Comment from "../Component/Comment";
import { videoContext } from "../Context/VideoContext";
import DescriptionPage from "./DescriptionPage";
function ShortVideos() {
  let [Index, setIndex] = useState(0);
  const [user, SetUser] = useState(null);
  const [LikeShort, setLikeShort] = useState(false);
  const [Loading, setLoading] = useState(true);
  const [Ispause, setIspause] = useState(false);
  const [ShortVideos, setShortVideos] = useState([]);
  const [FilteredShortVideos, setFilteredShortVideos] = useState([]);
  const [videoWidth, setvideoWidth] = useState(window.innerWidth);
  const [videoHeight, setvideoHeight] = useState();
  const [shortvideoLayout,setshortvideoLayout] = useState(false);
  const [ActiveIndex,setActiveIndex] = useState(0);
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
      setvideoWidth(637);
      setvideoHeight(window.innerHeight - 101);
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
        setvideoWidth(637);
        setvideoHeight(window.innerHeight - 101);
      }
    };
    window.addEventListener("resize", updateVideoSize);
    return () => {
      window.removeEventListener("resize", updateVideoSize);
    };
  }, [videoWidth, videoHeight,windowHeight]);

  useEffect(() => {
    console.log(params.id);
    const GetLikeVideo = async () => {
      if (user) {
        const docRef = doc(
          collection(firestore, `users/${auth.currentUser?.uid}/LikedVideos`),
          params.id
        );
        const getLikedDoc = await getDoc(docRef);
        if (getLikedDoc.exists()) {
          setLikeShort(true);
        } else {
          setLikeShort(false);
        }
      }
    };
    GetLikeVideo();
  }, [params.id, user]);
  const HandleLike = async (id) => {
    const LikedVideo = FilteredShortVideos.filter((video) => {
      return video.id === id;
    });
    if (user) {
      const docRef = doc(
        collection(firestore, `users/${auth.currentUser.uid}/LV`),
        params.id
      );
      const videoDocRef = doc(firestore, "videos", params.id);
      const getLikedDoc = await getDoc(docRef);
      if (!getLikedDoc.exists()) {
        const data = {
          videoURL: params.id,
        };
        await setDoc(docRef, data);
        await updateDoc(videoDocRef, {
          likes: LikedVideo[0].Videodata.likes + 1,
        });
        setLikeShort(true);
      } else {
        console.log("video Already exists");
      }
    }
  };

  const HandlePause = (e,currentVideoindex) => {
    setActiveIndex(currentVideoindex);
    setIspause(!Ispause);
    const short_video_container = document.querySelectorAll(
      ".short_video_container"
    );
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
    console.log(swipeDistance);
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

    // Ensure Index stays within valid bounds:
    if (Index >= shortVideoContainers.length) return; // Handle reaching the end

    let currentVideo = shortVideoContainers[Index];
    currentVideo.getElementsByTagName("video")[0].pause(); // Select first video in the container directly

    currentVideo.nextElementSibling?.scrollIntoView({ behavior: "smooth" }); // Optional chaining for safety
    currentVideo.nextElementSibling.style.scrollSnapAlign = "start";

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
  const GotoPreviousVideo = () => {
    const shortVideoContainers = document.querySelectorAll(".short_video_container");
    if (Index <= 0) return; // Handle reaching the end

    let currentVideo = shortVideoContainers[Index];
    currentVideo.getElementsByTagName("video")[0].pause(); // Select first video in the container directly

    currentVideo.previousElementSibling?.scrollIntoView({ behavior: "smooth" }); // Optional chaining for safety
    currentVideo.previousElementSibling.style.scrollSnapAlign = "end";

    setIndex(Index - 1);
    navigate(
      `/short/${
        currentVideo.previousElementSibling?.getElementsByTagName("video")[0]
          .dataset.video
      }`
    );
    setActiveIndex(parseInt(currentVideo.previousElementSibling?.getElementsByTagName("video")[0].dataset.index))
    currentVideo.style.scrollSnapAlign = "unset";
  };
  useEffect(()=>{
  console.log(ActiveIndex)
  },[ActiveIndex])
  useEffect(() => {
    const handleKeyup = (e) => {
      if (e.key === "ArrowDown" || e.keyCode === 40) {
        GotoNextVideo();
      } else if (e.key === "ArrowUp") {
        GotoPreviousVideo();
      }
    };
    window.addEventListener("keyup", handleKeyup);
    return () => {
      window.removeEventListener("keyup", handleKeyup);
    };
  }, [Index, FilteredShortVideos]);
  useEffect(() => {
    let currentVideo = document.querySelectorAll(".short_video_container")[
      Index
    ];
    if (currentVideo) {
      currentVideo.getElementsByTagName("video").shortvideo.play();
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
    // shortvideolayout.current.style.transform= `translateY(${Math.abs(swipeDistance)}px)`;
    if(swipeDistance <= -60){
      shortvideolayout.current.style.display = "none";
      setshortvideoLayout(false);
      document.body.style.overflow = "Scroll";
    }else{
      shortvideolayout.current.style.transform= `translateY(0px)`;
    }
  } 
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
                currentState.shortvideoShowMessages || currentState.Description? { zIndex: "0" }: { zIndex: "10", position: "absolute"}
              }
            >
              <div className="short_channel">
                <img src={shortvideo.UserData.channelPic || shortvideo.UserData.channelURL} alt="" />
                <p>{shortvideo.UserData.name}</p>
                <button>subscribe</button>
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
              <div className="like control">
                {LikeShort ? (
                  <BiSolidLike />
                ) : (
                  <BiLike onClick={() => HandleLike(shortvideo.id)} />
                )}
                <p>{shortvideo.Videodata.likes}</p>
              </div>
              <div className="dislike control">
                <BiDislike />
                <p>2</p>
              </div>
              <div
                className="message control"
                onClick={() => {
                  currentState.setshortvideoShowMessages(true);
                  document.body.style.overflowY = "hidden";
                }}
              >
                <MdOutlineMessage />
                <p>3520</p>
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
              <div className="menu control" onClick={()=>{setshortvideoLayout(true);document.body.style.overflow="hidden"}}>
                <BsThreeDots />
              </div>
              <div className="channel control">
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
              <div><FaRegBookmark/><p>Save To Watch later</p></div>
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
