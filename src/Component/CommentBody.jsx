import React,{useState,useEffect} from 'react'
import { BiLike } from "react-icons/bi";
import { BiDislike } from "react-icons/bi";
import { MdOutlineMessage } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { BiSolidLike } from "react-icons/bi";
import { auth, firestore } from '../firebase/firebase';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useSearchParams } from 'react-router-dom';
function CommentBody(props) {
 const [searchParams] = useSearchParams();
  const videoId = searchParams.get('v');
   const [user,setUser] = useState(null);
    const [Message,setMessage] = useState('');
    const [showFullComment,setshowFullComment] = useState(false);
    const [Comments,setComments] = useState([]);
    const [Reply,setReply] = useState(false);
    const [clickedReplyMessage,setclickedReplyMessage] = useState(null);
    const [CommentsLoading,setCommentLoading] = useState(true);
    const [showReplies,setshowReplies] = useState(false);
    const [ReplyMessage,setReplyMessage] = useState('');
    const [showReplyInput,setshowReplyInput] = useState(false);
    const [clickedReplyMessageIndex,setclickedReplyMessageIndex] = useState(null);
    const [currentReplyVideoIndex,setcurrentReplyVideoIndex] = useState(0);
    useEffect(()=>{
        auth.onAuthStateChanged((curretnUser)=>{
           setUser(curretnUser);
        })
      },[]);
      const HandleText = (e) => {
        setMessage(e.target.value)
      }
    useEffect(()=>{
      setCommentLoading(true);
      const GetComments = () => {
        try{
            onSnapshot(doc(firestore,"videos",videoId || props.videoId),async(snapShot)=>{
              if(snapShot.exists()){
               setComments(await snapShot.data().Comments);
              }
             });
       }catch(error){
          console.log(error);
        }
        finally {
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
                CommnetLikes:{numberOfLikes:0,usersId:[]},
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
          const commentLike = async(e,i) => {
            if(user){
            const DocRef = doc(firestore,"videos",videoId || props.videoId);
            if(!Comments[i].CommnetLikes.usersId.includes(user.uid)){
            Comments[i].CommnetLikes.numberOfLikes += 1;
            Comments[i].CommnetLikes.usersId.push(user.uid)
            await updateDoc(DocRef,{
              Comments:Comments,
            })
            }else{
              if(Comments[i].CommnetLikes.numberOfLikes > 0){
              Comments[i].CommnetLikes.numberOfLikes -= 1;
              }
             const UserIdIndex = Comments[i].CommnetLikes.usersId.findIndex((Id)=>  Id === user.uid);
             Comments[i].CommnetLikes.usersId.splice(UserIdIndex,1);
             await updateDoc(DocRef,{
              Comments:Comments,
            })
            }
          }
          }
          const replyCommentLike = async(e,i) => {
            if(user){
              const DocRef = doc(firestore,"videos",videoId || props.videoId);
              if(!Comments[i.ParentCommentindex].replies[i.childCommentindex].ReplyCommentLikes?.usersId.includes(user.uid)){
                Comments[i.ParentCommentindex].replies[i.childCommentindex].ReplyCommentLikes?.usersId.push(user.uid);
                Comments[i.ParentCommentindex].replies[i.childCommentindex].ReplyCommentLikes.ReplyCommentnumberOfLikes += 1;
                await updateDoc(DocRef,{
                  Comments:Comments
               })
              }else{
                if(Comments[i.ParentCommentindex].replies[i.childCommentindex].ReplyCommentLikes.ReplyCommentnumberOfLikes > 0){
                 Comments[i.ParentCommentindex].replies[i.childCommentindex].ReplyCommentLikes.ReplyCommentnumberOfLikes -= 1;
                }
               const UserIdIndex =  Comments[i.ParentCommentindex].replies[i.childCommentindex].ReplyCommentLikes?.usersId.findIndex((Id)=>  Id === user.uid);
               Comments[i.ParentCommentindex].replies[i.childCommentindex].ReplyCommentLikes?.usersId.splice(UserIdIndex,1);
               await updateDoc(DocRef,{
                Comments:Comments,
              })
              }
              console.log(Comments[i.ParentCommentindex].replies[i.childCommentindex])
          }
        }
          const HandleReplyMessage = (e) => {
            setReplyMessage(e.target.value)
          }
          const sendReplyMessage = async(i) => {
            if(user){
              if(ReplyMessage){
            const DocRef = doc(firestore,"videos",videoId || props.videoId);
            const replyData = {
              Replyname:auth.currentUser.displayName,
              ReplyuserPic:auth.currentUser.photoURL,
              ReplyCommentText:ReplyMessage,
              ReplyCommentLikes:{ ReplyCommentnumberOfLikes:0,usersId:[]},
              ReplyCommentDislikes:0,
            }
            if(!Comments[i].replies){
              Object.assign(Comments[i],{replies:[replyData]});
              await updateDoc(DocRef,{
              Comments:Comments
              })
            }else{
             Comments[i].replies = [...Comments[i].replies,replyData];
             await updateDoc(DocRef,{
              Comments:Comments
             });
            }
          }
            }
            setReply(false);
            setReplyMessage('');
            setshowReplyInput(false);
          }
          const HandleReplies = (i) => {  
            setcurrentReplyVideoIndex(i);
            setshowReplyInput(!showReplyInput);
          }
  return (
    <>
      <div className="message-body" style={{height:"100vh",overflow:"auto"}}>
          <div className="send-message-input">
            <img src={user?.photoURL} alt={user?.displayName} />
            <input type="text" id='message'placeholder='Send Your Message Here' value={Message} onChange={HandleText} onKeyDown={SendMessage}/>
          </div>
          <div className='Comments' style={{height:"100vh",overflow:"auto"}}>
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
                    {user && comment.CommnetLikes?.usersId.includes(user.uid) ? <BiSolidLike onClick={(e)=>{commentLike(e,index)}}/>:<BiLike onClick={(e)=>{commentLike(e,index)}}/>}<span>{comment.CommnetLikes.numberOfLikes}</span>
                    <BiDislike/>
                    <MdOutlineMessage onClick={()=>{setclickedReplyMessage(index);setReply(!Reply)}}/>
                  </div>
                </div>
                {Reply && index == clickedReplyMessage &&(
                <div className="replybox">
                  <input type="text" name="" id="replyinput" value={ReplyMessage} onChange={HandleReplyMessage} placeholder='Send a reply here'/>
                <div>
                  <button onClick={()=>{setReply(false)}}>cancel</button>
                  <button onClick={()=>{sendReplyMessage(index)}}>send</button>
                  </div>
                </div>
                )}
                {comment.replies &&(
                  <>
               <div id='showreplybtn' onClick={()=>{setshowReplies(!showReplies);setclickedReplyMessageIndex(index)}}>{!showReplies?<IoIosArrowDown />:clickedReplyMessageIndex === index?<IoIosArrowUp/>:<IoIosArrowDown />}<button>{comment.replies.length} replies</button></div>
                 {showReplies && index === clickedReplyMessageIndex &&(
                  <div className="Comments" style={{height:"100%",overflowY:"scroll"}}>
                  {comment.replies.map((replycomment,i)=>{
                    return <div id="comment" key={i}>
                    <div className="commentChannelPic"><img src={replycomment.ReplyuserPic} alt={replycomment.Replyname} /></div>
                    <div className="comment-right-section">
                      <div className="comment-header">
                        <span>@{replycomment.Replyname}</span>
                        <span></span>
                      </div>
                      <div className="comment-content">
                      {replycomment?.ReplyCommentText.length > 120 ? (
                      <p>{replycomment.ReplyCommentText.substring(0,120)+`...`} </p>
                     ):(replycomment.ReplyCommentText)}
                      </div>
                      <div className="comment-bottom">
                        <div className="icons">
                          {user && replycomment.ReplyCommentLikes?.usersId.includes(user.uid) ? <BiSolidLike onClick={(e)=>{replyCommentLike(e,{ParentCommentindex:index,childCommentindex:i})}}/>:<BiLike onClick={(e)=>{replyCommentLike(e,{ParentCommentindex:index,childCommentindex:i})}}/>}<span>{replycomment.ReplyCommentLikes.ReplyCommentnumberOfLikes}</span>
                          <BiDislike/>
                          <MdOutlineMessage onClick={()=>{HandleReplies(i)}}/>
                       </div>
                      </div>
                      {showReplyInput && currentReplyVideoIndex == i &&(
                <div className="replybox">
                  <input type="text" name="" id="replyinput" value={ReplyMessage} onChange={HandleReplyMessage} placeholder='Send a reply here'/>
                <div>
                  <button onClick={()=>{setshowReplyInput(false);setcurrentReplyVideoIndex(null)}}>cancel</button>
                  <button onClick={()=>{sendReplyMessage(index)}}>send</button>
                  </div>
                </div>
                )}
                      </div>
                      </div>
                  })}
                  </div>
                 )}
                 </>
                )}
              </div>
            </div>
           
          }):<p style={{display:"flex",justifycontent: "center",alignItems:"center",height:"50vh",justifyContent: "center"}}>No Comments Till Now</p>
        ):<div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"50vh"}}><span class="loader"></span></div>}
        </div>
        </div>
    </>
  )
}

export default CommentBody
