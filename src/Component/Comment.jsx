import React, { useContext, useEffect, useState } from 'react'
import { RxCross1 } from 'react-icons/rx';
import { CurrentState } from '../Context/HidevideoinfoCard';
import VideoInfoCard from './VideoInfoCard';
import { BiLike } from "react-icons/bi";
import { BiDislike } from "react-icons/bi";
import { MdOutlineMessage } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { auth, firestore } from '../firebase/firebase';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import CommentBody from './CommentBody';
function Comment(props) {
    const currentState = useContext(CurrentState);
    const [user,setUser] = useState(null)
    const [CloseMessage,setCloseMessage] = useState(false);
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
    
  return (
    <>
    {currentState.shortvideoShowMessages && (
      <div id='message_page'>
        <div className="message-top">
          <h3>Comments  <span style={{fontweight: "500"}}>{props.video?.NumberOfComments}</span></h3>
          <RxCross1 onClick={()=>{currentState.setshortvideoShowMessages(false);document.body.style.overflowY="unset";setCloseMessage(true)}} />
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
