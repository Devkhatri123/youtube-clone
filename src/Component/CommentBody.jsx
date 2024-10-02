import React,{useState,useEffect} from 'react'
import { BiLike } from "react-icons/bi";
import { BiDislike } from "react-icons/bi";
import { MdOutlineMessage } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { auth, firestore } from '../firebase/firebase';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useParams, useSearchParams } from 'react-router-dom';
function CommentBody(props) {
  console.log(props.videoId)
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get('v');
   const [user,setUser] = useState(null);
    const [Message,setMessage] = useState('');
    const [showFullComment,setshowFullComment] = useState(false);
    const [Comments,setComments] = useState([]);
    const [CommentsLoading,setCommentLoading] = useState(true);
    useEffect(()=>{
        auth.onAuthStateChanged((curretnUser)=>{
           setUser(curretnUser);
        })
      },[]);
      const HandleText = (e) => {
        setMessage(e.target.value)
      }
    useEffect(()=>{
      const GetComments = () => {
        setCommentLoading(true);
        try{
        onSnapshot(doc(firestore,"videos",videoId || props.videoId),async(snapShot)=>{
          if(snapShot.exists()){
           setComments(await snapShot.data().Comments);
          }
         });
        }catch(error){
          console.log(error);
        }finally {
          setCommentLoading(false);
        }
        }
        GetComments();
        },[videoId,props.videoId]);
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
                if(CurrentvideoData.Comments){
                await updateDoc (videoDocRef,{
                  Comments: [MessageContent,...CurrentvideoData.Comments],
                  NumberOfComments:CurrentvideoData.NumberOfComments + 1,
                 })
                }else{
                 await updateDoc(videoDocRef,{
                    Comments : [MessageContent],
                    NumberOfComments:1,
                  })
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
            {!CommentsLoading ? (
          Comments ? Comments?.map((comment,index)=>{
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
           
          }):<p style={{display:"flex",justifycontent: "center",alignItems:"center",height:"50vh",justifyContent: "center"}}>No Comments Till Now</p>
        ):<p style={{display:"flex",justifycontent: "center",alignItems:"center",height:"50vh",justifyContent: "center"}}>Loading...</p>}
        </div>
        </div>
    </>
  )
}

export default CommentBody
