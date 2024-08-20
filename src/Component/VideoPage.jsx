/* eslint-disable array-callback-return */
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router";
import { auth, firestore } from "../firebase/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { GoGear } from "react-icons/go";
import { MdClosedCaptionOff } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdPause } from "react-icons/md";
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
import { IoReloadOutline } from "react-icons/io5";
import { RxEnterFullScreen } from "react-icons/rx";
import { FaRegFlag } from "react-icons/fa6";
import { FaFlag } from "react-icons/fa6";
import { IoVolumeMuteSharp } from "react-icons/io5";
import { VscUnmute } from "react-icons/vsc";
import { MdSkipPrevious } from "react-icons/md";
import "../CSS/VideoPage.css";
import { Link } from "react-router-dom";
import VideoPlayer from "./VideoPlayer";
function VideoPage() {
  const params = useParams();
  let [Video, Setvideo] = useState();
  let [error,seterror] = useState(false);
  let [errorMessage,seterrorMessage] = useState()
   let [NoneFilteredVideos, setNoneFilteredVideos] = useState([]);
  let [FilteredVideos, setFilteredVideos] = useState([]);
  let [user, setUser] = useState();
  let [Loading, setLoading] = useState(true);
  let [isLiked, setisLiked] = useState(false);
  let [isSubscribed,setisSubscribed] = useState(false);

  // Fetching current Video on which user clicked on
  const FetchVideo = async () => {
    try {
      const VideoRef = doc(firestore, "videos", params.id);
      // const video = await getDoc(videoRef);
      onSnapshot(VideoRef,async(videDoc)=>{
      if (videDoc.exists()) {
        Setvideo(videDoc.data());
        const userRef = doc(firestore, "users", videDoc.data().createdBy);
        //const User = await getDoc(userRef);
       onSnapshot(userRef,(userDoc)=>{
        if (userDoc.exists()) {
          setUser(userDoc.data());
        }
      })
      }
   })
    } catch (error) {
      console.log(error);
      seterror(true);
      seterrorMessage(error);
      document.write(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(()=>{
     FetchVideo();
   },[params.id])
  useEffect(() => {
    // Fetching next Videos to play
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
  }, [params.id,NoneFilteredVideos]);
  // Adding A documnet in subcollection named Watched Video in collection of users to store  current user  watched Videos
  
useEffect(()=>{
  const addwatchedVideo = async () => {
    try {
      if (auth.currentUser) {
       const existsDocRef = doc(
          collection(firestore, `users/${auth.currentUser.uid}/watchedVideos`),
          params.id
        );
        const existsDoc = await getDoc(existsDocRef);
        if (!existsDoc.exists()) {
          const docRef = doc(
            collection(
              firestore,
              `users/${auth.currentUser.uid}/watchedVideos`
            ),
            params.id
          );
          const data = {
            videoUrl: params.id,
            videoData: Video,
            userData: user,
          };
          await setDoc(docRef, data);
          const VideodocRef = doc(firestore,"videos",params.id);
          await updateDoc(VideodocRef,{
            views : Video.views+1,
          })
          console.log("Video Doc added");
       }
      }
    } catch (error) {
      console.log(error);
    }
  };
 addwatchedVideo();
},[Video,params.id,user]);

  const makeSubscribe = async() => {
    if(auth.currentUser){
    const docRef = doc(collection(firestore,`users/${auth.currentUser.uid}/subscribedChannel`),user.uid);
    const channelDocRef = doc(collection(firestore,`users`),user.uid);
    const data = {
      name:user.name,
      email:user.email,
      channePic:user.channelPic,
      userId:user.uid
    }
    await setDoc(docRef,data);
    console.log("Doc added in subscribed Collection");
    await updateDoc(channelDocRef,{
     subscribers:user.subscribers +=1,
    });
    setisSubscribed(true);
    console.log("Subscribe increased");
  }else{
    alert("You are not signedIn");
  }
  }
  // Showing user that has he subscribed or not in every render
  useEffect(()=>{
    const checkSubscribedOrNot = async() => {
      if(auth.currentUser){
      if(user){
      const docRef = doc(collection(firestore,`users/${auth.currentUser.uid}/subscribedChannel`),user.uid);
      const Doc = await getDoc(docRef);
      if(Doc.exists()){
       setisSubscribed(true);
      }
    }
  }
      }
    checkSubscribedOrNot()
  },[params.id,user]);
  const UnSubscribeChannel = async() => {
    if(user){
   await deleteDoc(doc(collection(firestore,`users/${auth.currentUser.uid}/subscribedChannel`),user.uid));
   const channelDocRef = doc(collection(firestore,`users`),user.uid);
   await updateDoc(channelDocRef,{
    subscribers:user.subscribers -=1,
   })
   setisSubscribed(false);
    }
  }
  const doLike = async() => {
   if(auth.currentUser){
    const docRef = doc(collection(firestore,`users/${auth.currentUser.uid}/LikedVideos`),params.id);
    const videoDocRef = doc(firestore,"videos",params.id);
    const getLikedDoc = await getDoc(docRef);
    if(!getLikedDoc.exists()){
    const data = {
      VideoTitle:Video.Title,
      description:Video.description,
      Thumbnail:Video.Thumbnail,
    }
    await setDoc(docRef,data);
    await updateDoc(videoDocRef,{
      likes:Video.likes + 1,
     })
    setisLiked(true);
    }
  }
  }
  useEffect(()=>{
    const checkLikedOrNot = async() => {
      if(auth.currentUser){
      const LikedDocRef = doc(collection(firestore,`users/${auth.currentUser.uid}/LikedVideos`),params.id);
      const GetLikedDoc = await getDoc(LikedDocRef);
      if(GetLikedDoc.exists()){
        setisLiked(true);
      }
    }
  }
    checkLikedOrNot();
  },[params.id,user])
  const doUnLike = async() => {
    await deleteDoc(doc(collection(firestore,`users/${auth.currentUser.uid}/LikedVideos`),params.id));
    console.log("You Just UnLiked Video" + " " + Video.Title);
    const videoDocRef = doc(firestore,"videos",params.id);
    await updateDoc(videoDocRef,{
      likes: Video.likes - 1,
    });
    console.log("Views decreased by 1 in video document");
    setisLiked(false);
   }
 
  return (
    <div>
      {Loading ? (
        <>
        <p>Loading...</p>
        </>
      ) : (
        <>
          <div className="video_page">
            <VideoPlayer/>
            <div className="details">
              <h3 id="video_title">{Video?.Title}</h3>
              <div className="show_views">
                <div>
                  <span id="views">{Video?.views} Views</span>
                  <span className="video_upload_time">&nbsp; 3 Months Ago</span>
                </div>
                <span>...more</span>
              </div>
              <div className="channel_details">
                <div className="channel_details_left_part">
                  <img src={user?.channelPic} alt={user?.name} />
                  <span className="channeName">{user?.name}</span>
                  <span>{user?.subscribers}</span>
                </div>
              {isSubscribed === true ? <button className="subscribe_btn subscribed_btn" onClick={UnSubscribeChannel}>Subscribed</button>:<button className="subscribe_btn" onClick={makeSubscribe}>Subscribe</button>} 
              </div>
              <div className="like_share_save_container">
                <div>
                  {!isLiked ? (
                    <BiLike onClick={doLike} />
                  ) : (
                    <BiSolidLike onClick={doUnLike} />
                  )}
                  <span className="likes">{Video?.likes}</span>
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
              {Video?.Comments == "On"?(
                <>
                <div className="comments_top">
                  <p>
                    Comments <span>1.6K</span>
                  </p>
                </div>
                <div className="comment">
                  <img src={user?.channelPic} alt={user?.name} />
                  <span>Kon reel dek kar aya hai 😂😂</span>
                </div>
                </>
              ) : (
                 <p className="comments_turnedOff_message">Comments are Turned Off for this video</p>
              )}
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
                       </Link>
                      <div className="video_bottom">
                        <div className="video_bttom_left">
                          <img
                            src={nextVideo.userData?.channelPic}
                            alt={nextVideo.userData?.name}
                          />
                          <div className="video_title_and_channelName">
                            <h3 id="video_title">
                              {nextVideo.videoData?.Title}
                            </h3>
                            <div>
                              <p>
                                {nextVideo.userData?.name} .{" "}
                                {nextVideo.videoData?.views} Views
                              </p>
                            </div>
                          </div>
                        </div>

                        <BsThreeDotsVertical className="menu" />
                      </div>
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
