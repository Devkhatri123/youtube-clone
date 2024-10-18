import React, { useContext, useEffect, useRef, useState } from 'react'
import { RxCross1 } from 'react-icons/rx';
import VideoInfoCard from './VideoInfoCard';
import { BiLike } from "react-icons/bi";
import { BiDislike } from "react-icons/bi";
import { MdOutlineMessage } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { auth, firestore } from '../firebase/firebase';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import CommentBody from './CommentBody';
import { videoContext } from '../Context/VideoContext';
function Comment(props) {
    const currentState = useContext(videoContext);
    const [user,setUser] = useState(null)
    const [CloseMessage,setCloseMessage] = useState(false);
    const touchStartRef = useRef(0); // To store the initial touch position
    const touchEndRef = useRef(0);
    const CommentRef = useRef();
    let [Message,setMessage] = useState('');
   const [Comments,setComments] = useState([]);
    useEffect(()=>{
      auth.onAuthStateChanged((curretnUser)=>{
         setUser(curretnUser);
      })
    },[])
    const HandleText = (e) => {
      setMessage(e.target.value)
    }
    useEffect(()=>{
    onSnapshot(doc(firestore,"videos",props.videoId),async(snapShot)=>{
      if(snapShot.exists()){
       setComments(await snapShot.data().Comments);
      }
     })
    
    },[props.videoId]);
    const sectionTouch = (e) => {
      touchStartRef.current = e.touches[0].clientY;
    }
    const drageSection = (e) => {
      touchEndRef.current = e.changedTouches[0].clientY;
      const swipeDistance = touchStartRef.current - touchEndRef.current;
      
      CommentRef.current.style.transform= `translateY(${Math.abs(swipeDistance)}px)`;
    }
    const HideLayout = () => {
      const swipeDistance = touchStartRef.current - touchEndRef.current;
      if(swipeDistance <= -100){
        CommentRef.current.style.display = "none";
        currentState.setshortvideoShowMessages(false)
        document.body.style.overflow = "scroll";
      }else{
        CommentRef.current.style.transform= `translateY(-9.5px)`;
      }
    } 
  return (
    <>
    {currentState.shortvideoShowMessages && (
      <div id='message_page' ref={CommentRef} style={{transform:"translateY(-9.5px)"}}>
        <div className="message-top"  onTouchMove={drageSection} onTouchStart={sectionTouch} onTouchEnd={HideLayout}>
        <div className="line"><span></span></div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <h3>Comments  <span style={{fontweight: "500"}}>{props.video?.NumberOfComments}</span></h3>
          <RxCross1 onClick={()=>{currentState.setshortvideoShowMessages(false);document.body.style.overflow="scroll";setCloseMessage(true)}} />
        </div>
        </div>
        <div className="message-body">
         <CommentBody videoId = {props.videoId} video = {props.video}/>
        </div>
      </div>
    )}
  </>
  )
}

export default Comment
