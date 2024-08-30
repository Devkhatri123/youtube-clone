import React,{useState,useEffect, useContext} from 'react'
import VideoPlayer from './VideoPlayer';
import { useParams } from 'react-router';
import { firestore,auth } from '../firebase/firebase';
import { collection,doc,getDoc,onSnapshot,updateDoc,setDoc,deleteDoc } from 'firebase/firestore';
import VideoDetail from './VideoDetail';
import { BsThreeDotsVertical } from "react-icons/bs";
import { BiLike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";
import { BiDislike } from "react-icons/bi";
import { BiSolidDislike } from "react-icons/bi";
import { IoIosShareAlt } from "react-icons/io";
import { RiShareForwardLine } from "react-icons/ri";
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import { IoReloadOutline } from "react-icons/io5";
import { FaRegFlag } from "react-icons/fa6";
import { FaFlag } from "react-icons/fa6";
import "../CSS/VideoPage.css";
import { Link } from "react-router-dom";
import {CurrentState} from "../Context/HidevideoinfoCard"
import DescriptionPage from './DescriptionPage';
import Comment from './Comment';
import Videos from './Videos';
function VideoInfoCard() {
    const params = useParams();
   const currentState= useContext(CurrentState);
    const [showDescription,setshowDescription] = useState(false);
    let [Video, Setvideo] = useState();
    let [NoneFilteredVideos, setNoneFilteredVideos] = useState([]);
    let [NextVideos, setNextVideos] = useState([]);
    const [ThumbnailWidth,setThumbNailWidth] = useState(window.innerWidth)
    const [ThumbnailHeight,setThumbnailHeight] = useState(window.innerWidth * (9/16));
    let [user, setUser] = useState();
    let [Loading, setLoading] = useState(true);
    let [isLiked, setisLiked] = useState(false);
    let [isSubscribed,setisSubscribed] = useState(false);
    const [CurrentUser,setCurrentUser] = useState(null);
    // Fetching current Video on which user clicked on
    useState(()=>{
  auth.onAuthStateChanged((currentUser)=>{
    setCurrentUser(currentUser);
  })
    },[])
    useEffect(()=>{
      console.log(CurrentUser)
    },[CurrentUser])
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
        document.write(error);
      } finally {
        setLoading(false);
      }
    };
    useEffect(()=>{
      setThumbNailWidth(window.innerWidth);
      setThumbnailHeight(ThumbnailWidth * (9/16));
      const updateVideoSize = () => {
        setThumbNailWidth(window.innerWidth);
        setThumbnailHeight(ThumbnailWidth * (9/16));
        console.log("width : " + ThumbnailWidth);
        console.log("height : " + ThumbnailHeight);
      }
      window.addEventListener("resize",updateVideoSize)
      return ()=>{
        window.removeEventListener("resize",updateVideoSize)
      }
  },[ThumbnailHeight,ThumbnailWidth]);
    useEffect(()=>{
       FetchVideo();
     },[params.id])
    useEffect(() => {
      // Fetching next Videos to play
      onSnapshot(collection(firestore, "videos"), (snapShot) => {
        const FetchedVideos = Promise.all(
          snapShot.docs.map(async (Doc) => {
            const userRef = doc(firestore, "users", Doc.data().createdBy);
            const userDoc = await getDoc(userRef);
            return {
              id: Doc.id,
              Videodata: Doc.data(),
              UserData: userDoc.data(),
            };
          })
        );
        FetchedVideos.then((FetchedVideos) => {
          setNextVideos(FetchedVideos);
        });
      });
    }, [params.id]);
    // Adding A documnet in subcollection named Watched Video in collection of users to store  current user  watched Videos
    const makeSubscribe = async() => {
      if(CurrentUser){
      const docRef = doc(collection(firestore,`users/${CurrentUser?.uid}/subscribedChannel`),user.uid);
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
        if(CurrentUser){
        if(user){
        const docRef = doc(collection(firestore,`users/${CurrentUser?.uid}/subscribedChannel`),user.uid);
        const Doc = await getDoc(docRef);
        if(Doc.exists()){
         setisSubscribed(true);
        }
      }
    }
        }
      checkSubscribedOrNot()
    },[params.id,user,CurrentUser]);
    const UnSubscribeChannel = async() => {
      if(user){
     await deleteDoc(doc(collection(firestore,`users/${CurrentUser?.uid}/subscribedChannel`),user.uid));
     const channelDocRef = doc(collection(firestore,`users`),user.uid);
     await updateDoc(channelDocRef,{
      subscribers:user.subscribers -=1,
     })
     setisSubscribed(false);
      }
    }
    const doLike = async() => {
     if(CurrentUser){
      const docRef = doc(collection(firestore,`users/${CurrentUser?.uid}/LikedVideos`),params.id);
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
      console.log("You Liked the video" + params.id);
      }
    }
    }
    useEffect(()=>{
      const checkLikedOrNot = async() => {
        if(CurrentUser){
        const LikedDocRef = doc(collection(firestore,`users/${CurrentUser?.uid}/LikedVideos`),params.id);
        const GetLikedDoc = await getDoc(LikedDocRef);
        if(GetLikedDoc.exists()){
          setisLiked(true);
          console.log("VIDEO IS LIKED");
        }else{
          setisLiked(false);
          console.log("VIDEO IS  NOT LIKED");
        }
      }
    }
      checkLikedOrNot();
    },[params.id,user,CurrentUser])
    const doUnLike = async() => {
        console.log("Loading...");
        try{
      await deleteDoc(doc(collection(firestore,`users/${CurrentUser?.uid}/LikedVideos`),params.id));
      console.log("You Just UnLiked Video" + " " + Video.Title);
      const videoDocRef = doc(firestore,"videos",params.id);
      await updateDoc(videoDocRef,{
        likes: Video.likes - 1,
      });
      console.log("Views decreased by 1 in video document");
      setisLiked(false);
    }catch(error){
      console.log("Error :" + error);
    }finally{
      console.log("Done");
    }
     }
     useEffect(()=>{
      console.log(Video)
      const checkCurrentWatchedVideo = async () => {
    const videoDocRef = doc(collection(firestore,`users/${CurrentUser?.uid}/watchedVideos`),params.id);
    const videoDoc = await getDoc(videoDocRef);
    const videoCollection = doc(firestore,"videos",params.id);
    if(!videoDoc.exists()){
      const data = {
        videoUrl:params.id,
      }
      await setDoc(videoDocRef,data);
      await updateDoc(videoCollection,{
        views:Video?.views + 1
      })
      console.log("Video added to watched collection");
    }
      }
      checkCurrentWatchedVideo();
     },[params.id,Video,CurrentUser])
  return showDescription  === false? (
   !currentState.shortvideoShowMessages ? (
            <div className="video_page">
            <div onClick={()=>setshowDescription(true)} style={{margin:"0 0.9em"}}>
            <VideoDetail/>
            </div>
             <div className="channel_details">
                <div className="channel_details_left_part">
                  <img src={user?.channelURL} alt={user?.name} />
                 <span className="channeName">{user?.name}</span>
                  <span>{user?.subscribers}</span>
                </div>
              {isSubscribed === true ? <button className="subscribe_btn subscribed_btn" onClick={UnSubscribeChannel}>Subscribed</button>:<button className="subscribe_btn" onClick={makeSubscribe}>Subscribe</button>} 
              </div>
              <div className="like_share_save_container">
                <div>
                  {isLiked === false ? (
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
              {/* {currentState.shortvideoShowMessages ? <Comment video={Video} user={user}/>:null} */}
              <div className="comments" onClick={()=>currentState.setshortvideoShowMessages(true)}>
              {Video?.comments === "On"?(
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
            <div className="Next_videos">
              <Videos video={NextVideos}/>
            </div>
            </div>
    ):<Comment video={Video} user={user} videoId={params.id}/>
           ):<DescriptionPage/>
          }
  

export default VideoInfoCard
