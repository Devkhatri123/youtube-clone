import React,{useState,useEffect} from 'react'
import { BiLike } from "react-icons/bi";
import { BiDislike } from "react-icons/bi";
import { MdOutlineMessage } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { auth, firestore } from '../firebase/firebase';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
function CommentBody(props) {
    const [user,setUser] = useState(null);
    const [Message,setMessage] = useState('');
    const [showFullComment,setshowFullComment] = useState(false);
    const [Comments,setComments] = useState([]);
    useEffect(()=>{
        auth.onAuthStateChanged((curretnUser)=>{
           setUser(curretnUser);
        })
      },[]);
      useEffect(()=>{
          console.log(user)
      },[user])
      const HandleText = (e) => {
        setMessage(e.target.value)
      }
    useEffect(()=>{
        onSnapshot(doc(firestore,"videos",props.videoId),async(snapShot)=>{
          if(snapShot.exists()){
           setComments(await snapShot.data().Comments);
          }
         })
        },[]);
        const SendMessage  = async(e) => {
            if(e.key === "Enter"){
              if(user){
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
                  Comments: [MessageContent,...props.video.Comments],
                  NumberOfComments:props.video.NumberOfComments + 1,
                 })
                 console.log("Comment Added in Array");
                 console.log(GetDoc.data());
                }else{
                  console.log("Object Hasn't property")
                 await updateDoc(videoDocRef,{
                    Comments : [MessageContent],
                    NumberOfComments:1,
                  })
                  console.log("Comment Added");
                  console.log(GetDoc.data());
                }
              }
          
            }
            setMessage("");
          }
            }
  return (
    <>
      <div className="message-body">
          <div className="send-message-input">
            <img src={user?.photoURL} alt={user?.displayName} />
            <input type="text" id='message'placeholder='Send Your Message Here' value={Message} onChange={HandleText} onKeyDown={SendMessage}/>
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
           
          }):<p style={{display:"flex",justifycontent: "center",alignItems:"center",height:"50vh",justifyContent: "center"}}>No Comments Till Now</p>} 
        </div>
        </div>
    </>
  )
}

export default CommentBody
