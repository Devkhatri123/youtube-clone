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
function Comment(props) {
    const currentState = useContext(CurrentState);
    const [CloseMessage,setCloseMessage] = useState(false);
    let [Message,setMessage] = useState('');
    const [showFullComment,setshowFullComment] = useState(false);
    const [Comments,setComments] = useState([]);
    useEffect(()=>{
    console.log(props);
    },[]);
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
    const SendMessage  = async(e) => {
    if(e.key === "Enter"){
      const MessageContent = {
        name:auth.currentUser.displayName,
        userPic:auth.currentUser.photoURL,
        CommentText:Message,
        CommnetLikes:0,
        CommnetDislikes:0,
      }
      const videoDocRef = doc(firestore,"videos",props.videoId);
      const GetDoc =  await getDoc(videoDocRef);
      if(GetDoc.exists()){
        const CurrentvideoData = GetDoc.data();
        console.log(CurrentvideoData);
        if(CurrentvideoData.hasOwnProperty('Comments')){
         console.log("Object Has property");
        await updateDoc (videoDocRef,{
          Comments: [...props.video.Comments,MessageContent],
         })
         console.log("Comment Added in Array");
         console.log(GetDoc.data());
        }else{
          console.log("Object Hasn't property")
         await updateDoc(videoDocRef,{
            Comments : [MessageContent]
          })
          console.log("Comment Added");
          console.log(GetDoc.data());
        }
      }
   setMessage('');
    }
    }
  return (
    <>
    {currentState.shortvideoShowMessages && (
      !CloseMessage ? (
      <div id='message_page'>
        <div className="message-top">
          <h3>Comments  <span style={{fontweight: "500"}}>{props.video?.numberOfComments}</span></h3>
          <RxCross1 onClick={()=>{currentState.setshortvideoShowMessages(false);document.body.style.overflowY="unset";setCloseMessage(true)}} />
        </div>
        <div className="message-body">
          <div className="send-message-input">
            <img src={props.user.channelURL} alt={props.user.name} />
            <input type="text" id='message'placeholder='Send Your Message Here' onChange={HandleText} onKeyDown={SendMessage}/>
          </div>
          <div className='Comments'>
          {Comments ? Comments?.map((comment,index)=>{
           return <div id="comment" key={index}>
              <div className="commentChannelPic"><img src={comment.userPic} alt={comment.name} /></div>
              <div className="comment-right-section">
                <div className="comment-header">
                  <span>@{comment.name}</span>
                  <span></span>
                </div>
                <div className="comment-content">
                {comment?.CommentText.length > 120 ? (
                <p onClick={()=>setshowFullComment(!showFullComment)}>{showFullComment?comment.CommentText:comment.CommentText.substring(0,120)+`...`} </p>
               ):(comment.CommentText)}
                </div>
                <div className="comment-bottom">
                  <div className="icons">
                    <BiLike/>
                    <BiDislike/>
                    <MdOutlineMessage/>
                  </div>
                    <BsThreeDotsVertical/>
                </div>
              </div>
            </div>
           
          }):<p style={{display:"flex",justifycontent: "center",alignItems:"center",height:"50vh"}}>No Comments Till Now</p>} 
        </div>
        </div>
      </div>
      ):(<VideoInfoCard/>)
    )}
  </>
  )
}

export default Comment
