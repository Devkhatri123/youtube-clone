/* eslint-disable array-callback-return */
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { firestore } from "../firebase/firebase";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { GoGear } from "react-icons/go";
import { MdClosedCaptionOff } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdPause } from "react-icons/md";
import { IoIosPlay } from "react-icons/io";
import { IoMdPlay } from "react-icons/io";
import { MdSkipNext } from "react-icons/md";
import { BiLike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";
import { BiDislike } from "react-icons/bi";
import { BiSolidDislike } from "react-icons/bi";
import { IoIosShareAlt } from "react-icons/io";
import { RiShareForwardLine } from "react-icons/ri";
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import { RxEnterFullScreen } from "react-icons/rx";
import { FaRegFlag } from "react-icons/fa6";
import { FaFlag } from "react-icons/fa6";
import { MdSkipPrevious } from "react-icons/md";
import "../CSS/VideoPage.css";
import { Link } from "react-router-dom";
function VideoPage() {
  const params = useParams();
  const videoRef = useRef();
  let [Video, Setvideo] = useState();
  let [NoneFilteredVideos, setNoneFilteredVideos] = useState([]);
  let [FilteredVideos, setFilteredVideos] = useState([]);
  let [seconds,setseconds] = useState(0);
  let [minutes,setminutes] = useState(0);
  let [hours,sethours] = useState(0);
  let [user, setUser] = useState();
  let [Loading, setLoading] = useState(true);
  let [isPaused, setisPaused] = useState(true);
  let [isLiked, setisLiked] = useState(false);
  let [Duration,setDuration] = useState(0);
  const FetchVideo = async () => {
    try {
      const videoRef = doc(firestore, "videos", params.id);
      const video = await getDoc(videoRef);
      if (video.exists) {
        Setvideo(video.data());
        const userRef = doc(firestore, "users", video.data().createdBy);
        const User = await getDoc(userRef);
        if (User.exists) {
          setUser(User.data());
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    FetchVideo();
    onSnapshot(collection(firestore, "videos"), (snapShot) => {
      const FetchedNonFilteredVideos = Promise.all(
        snapShot.docs.map(async (Doc) => {
          const userRef = doc(firestore, "users", Doc.data().createdBy);
          const userDoc = await getDoc(userRef);
          return {
            id: Doc.id,
            videoData: Doc.data(),
            userData: userDoc.data(),
          };
        })
      );
      FetchedNonFilteredVideos.then((FetchedVideos) => {
        setNoneFilteredVideos(FetchedVideos);
      });
    });
    const filteredVideos = NoneFilteredVideos.filter((video) => {
      return params.id !== video.id;
    });
    setFilteredVideos(filteredVideos);
  }, [Loading,params.id]);
  useEffect(() => {
    console.log(FilteredVideos);
  }, [FilteredVideos]);
  const checkProgress = (e) => {
    const duration = e.target.duration;
    // setseconds(Math.floor(duration % 60));
    // setminutes(Math.floor(duration / 60) % 60);
    // sethours(Math.floor(duration / 3600));
    console.log(hours + ":" + minutes + ":" + seconds);
    console.log((e.target.currentTime / e.target.duration) * 100);
  };
  const HandlePlayPause = () => {
    setisPaused(!isPaused);
    if (isPaused) videoRef.current.play();
    else videoRef.current.pause();
  };
  const HandlProgress = (e) => {
    const duration = e.target.currentTime;
    setDuration(Math.floor((e.target.currentTime/e.target.duration)*100));
    setseconds(Math.floor(duration % 60));
    setminutes(Math.floor(duration / 60) % 60);
    sethours(Math.floor(duration / 3600));
    if(Duration === 100) setisPaused(!isPaused);
    console.log(hours + ":" + minutes + ":" + seconds);
  }
  const HandleFullScreen = () => {
    videoRef.current.requestFullscreen()
  }
  return (
    <div>
      {Loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="video_page">
            <div className="video_section">
              <div className="video_top_controls">
                <MdClosedCaptionOff />
                <GoGear />
              </div>
              <video
                src={Video?.videoURL}
                poster={Video?.Thumbnail}
                onLoadedData={checkProgress}
                onTimeUpdate={HandlProgress}
                ref={videoRef}
              />
              <div className="middle_controls">
                <div>
                  <MdSkipPrevious />
                  {isPaused ? (
                    <IoMdPlay onClick={HandlePlayPause} />
                  ) : (
                    <MdPause onClick={HandlePlayPause} />
                  )}
                  <MdSkipNext />
                </div>
              </div>
              <div className="below_controls">
                <div>
                  <p><span>{minutes+":"+seconds}</span> / <span>0:33</span></p>
                   <RxEnterFullScreen onClick={HandleFullScreen}/>
                </div>
                <input type="range" value={Duration} min="0" max="100" step="2"/>
              </div>
            </div>
            <div className="details">
              <h3 id="video_title">{Video?.Title}</h3>
              <div className="show_views">
                <div>
                  <span id="views">{Video.views} Views</span>
                  <span className="video_upload_time">&nbsp; 3 Months Ago</span>
                </div>
                <span>...more</span>
              </div>
              <div className="channel_details">
                <div className="channel_details_left_part">
                  <img src={user.channelURL} alt={user.name} />
                  <span className="channeName">{user.name}</span>
                  <span>{user.subscribers}</span>
                </div>
                <button className="subscribe_btn">Subscribe</button>
              </div>
              <div className="like_share_save_container">
                <div>
                  {!isLiked ? (
                    <BiLike onClick={() => setisLiked(!isLiked)} />
                  ) : (
                    <BiSolidLike onClick={() => setisLiked(!isLiked)} />
                  )}
                  <span className="likes">77K</span>
                  <span>|</span>
                  <BiDislike />
                </div>
                <div>
                  <RiShareForwardLine />
                  <span className="share">Share</span>
                </div>
                <div>
                  <FaRegBookmark />
                  <span className="save">Save</span>
                </div>
                <div>
                  <FaRegFlag />
                  <span className="report">Report</span>
                </div>
              </div>
              <div className="comments">
                <div className="comments_top">
                  <p>
                    Comments <span>1.6K</span>
                  </p>
                </div>
                <div className="comment">
                  <img src={user.channelURL} alt={user.name} />
                  <span>Kon reel dek kar aya hai 😂😂</span>
                </div>
              </div>
            </div>
            <div className="Next_videos">
              {FilteredVideos.map((nextVideo, index) => {
                return (
                  <div className="Next_Video" key={index}>
                    <Link to={`/watch/${nextVideo.id}`}>
                    <img
                        src={nextVideo.videoData?.Thumbnail}
                        alt={nextVideo.videoData?.Title}
                      />
                      <div className="video_bottom">
                        <div className="video_bttom_left">
                        <img
                          src={nextVideo.userData?.channelURL}
                          alt={nextVideo.userData?.name}
                        />
                        <div className="video_title_and_channelName">
                          <h3 id="video_title">{nextVideo.videoData?.Title}</h3>
                          <div>
                            <p>{nextVideo.userData?.name} . {nextVideo.videoData?.views} Views</p>
                            </div>
                          </div>
                        </div>

                        <BsThreeDotsVertical className="menu"/>
                      </div>
                      </Link>
                    </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default VideoPage;
