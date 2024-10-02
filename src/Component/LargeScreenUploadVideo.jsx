import React, { useContext, useEffect, useRef, useState } from 'react'
import { MdUpload } from "react-icons/md";
import { FaFileImage } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from 'react-router';
import VideoPlayer from './VideoPlayer';
import { Uploadvideo } from '../Context/UploadVideoContext';
import { auth } from '../firebase/firebase';
import { firestore } from '../firebase/firebase';
import { getDoc,doc } from 'firebase/firestore';
function LargeScreenUploadVideo() {
  const inputRef = useRef();
  const imgRef = useRef();
  const videoRef = useRef();
  const [user,setuser] = useState(null);
  const [currentUser,setcurrentUser] = useState(null)
  const [VideoURL,setVideoURL] = useState();
  const [videoFile,setVideoFile] = useState();
  const [thumbnailURL,setthumbnailURL] = useState();
  const [thumbnailFile,setthumbnailFile] = useState();
  const [getThumbnail,setgetThumbnail] = useState();
  const UploadVideoContext = useContext(Uploadvideo);
  const [videoTitle,setvideoTitle] = useState('');
  const [description,setdescription] = useState('');
  const [Comments,setComments] = useState('');
  useEffect(()=>{
    auth.onAuthStateChanged((currentuser)=>{
      setcurrentUser(currentuser)
    });
    const GetUser = async() => {
      if(currentUser){
    setuser((await getDoc(doc(firestore,"users",currentUser.uid))).data()); 
    }
  }
    GetUser()
},[currentUser])
  const navigate = useNavigate();
  const HandleChange = (e) => {
 setVideoURL(URL.createObjectURL(e.target.files[0]));
 setVideoFile(e.target.files[0])
  }
  const HandleThumbnailChange = (e) => {
    setthumbnailURL(URL.createObjectURL(e.target.files[0]));
    setthumbnailFile(e.target.files[0])
  }
  useEffect(()=>{
    
   if(window.innerWidth < 990){
   navigate("/")
   }
  },[]);
  const uploadvideo = () => {
    if(!currentUser){
      alert("You are not signedIn")
      return;
    } 
    let videoLength = videoRef.current.firstChild.firstChild.nextElementSibling.childNodes[0].duration;

    let shortivideo = null;
    const seconds = Math.floor(videoLength % 60);
    const minutes = Math.floor(videoLength / 60) % 60;
    if(minutes >= 1 ) shortivideo  = false
    else if(minutes === 1 || seconds <= 60) shortivideo = true;
    UploadVideoContext.uploadVideoFunc(thumbnailFile,videoFile,videoTitle,description,shortivideo,user,Comments);
  }
const HandleCommentMode = (e) => {
  console.log(e.target.value)
  setComments(e.target.value);
}
  return (
    <div className='large-screen-upload-video'>
      <div className="uploadvideo-inner">
        <div className='uploadvideo-inner-top'>
          <h3>Upload Video</h3>
          <IoMdClose/>
        </div>
        {!VideoURL ? (
        <div className='uploadvideo-inner-center'>
          <>
          <input type="file" hidden ref={inputRef} onChange={HandleChange}/>
          <div onClick={()=>{inputRef.current.click()}}><MdUpload/></div>
          <p>Drag and drop video files to upload</p>
          <button onClick={()=>inputRef.current.click()}>Select files</button>
          </>
        </div>
        ):
        <>
        <div className="set-video">
          <div className="inner-set-video">
          <div className="set-video-left">
            <h2>Details</h2>
            <input type="text" name="title" id="title"  placeholder='Enter your Title' onChange={(e)=>{setvideoTitle(e.target.value)}}/>
            <input type="text" name="description" id="description" placeholder='Enter your description' onChange={(e)=>{setdescription(e.target.value)}}/>
            <div onClick={()=>{imgRef.current.click()}} style={getThumbnail !== undefined ? {padding:"2px",width:"123px"}:null}>
             {thumbnailURL !== undefined ? (
                <img src={thumbnailURL} alt='thumbnail'/>
             ):(
            <>
             <FaFileImage/>
             <span>Upload File</span>
             </>
             )
             }
              <input type="file" name="thumbnail" id="thumbnail" hidden ref={imgRef} onChange={HandleThumbnailChange}/>
            </div>
            <div className='large-screen-commnet-type' style={{border:"unset"}}>
        <h3>Comment Mode</h3>
        <div>
      <input type="radio" name='commentType' value="On" id='on' onChange={HandleCommentMode}/><label htmlFor="On" >On</label>
      <input type="radio" name='commentType' id='off' value="Off"  onChange={HandleCommentMode}/><label htmlFor="Off">Off</label>
      </div>
    </div>
          </div>
          <div className="set-video-right">
          <div ref={videoRef}><VideoPlayer src={VideoURL} /></div>
          </div>
          </div>
          <div className="set-video-bottom">
            {UploadVideoContext.Videoprogress > 0 ?(
             <p>uploading video... {UploadVideoContext.Videoprogress} %</p>
            ):<p>{UploadVideoContext.ThumbnailProgress ? <p>uploading thumbnail... {UploadVideoContext.ThumbnailProgress}%</p>:null}</p>}
           
            <button onClick={uploadvideo}>upload video</button>
          </div>
        </div>
        </>}
      </div>
    </div>
  )
}

export default LargeScreenUploadVideo
 