import React, { forwardRef, useContext, useEffect, useRef, useState } from "react";
import { MdUpload } from "react-icons/md";
import { RiMenu2Fill } from "react-icons/ri";
import { MdOutlineComment } from "react-icons/md";
import "../CSS/uploadVideo.css";
import Description from "./Description";
import CommentType from "./CommentType";
import { IoMdClose } from "react-icons/io";
import { FaFileImage } from "react-icons/fa";
import { Uploadvideo } from '../Context/UploadVideoContext';
import Library from "./Library";
import VideoPlayer from "./VideoPlayer";
import { useNavigate } from "react-router";
import { doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase/firebase";
function UploadVideo() {
  const navigate = useNavigate();
  let [Video, setVideo] = useState("");
  const [user,setuser] = useState();
  let imgRef = useRef();
  const videoRef = useRef();
  let [openComponent, setopenComponent] = useState(false);
  let [Thumbnail, setThumbnail] = useState("");
  let [videoTitle, setvideoTitle] = useState("");
  let [commentMode, setcommentMode] = useState(false);
  let [closeUploadPage, setcloseUploadPage] = useState(false);
  let description = sessionStorage.getItem("Description");
  let CommentMode = sessionStorage.getItem("commentMode");
  const UploadVideoContext = useContext(Uploadvideo);
  const inputRef = useRef(null);
  let [videoFile, setvideoFile] = useState();
  let [thumbnailFile, setthumbnailFile] = useState();
  const PicPickerRef = useRef(null);
  const HandleFileChange = (e) => {
    setvideoFile(e.target.files[0]);
    setVideo(URL.createObjectURL(e.target.files[0]));
  };
 
  useEffect(()=>{
    const GetUser = async() => {
    setuser((await getDoc(doc(firestore,"users",auth.currentUser.uid))).data()); 
    }
    GetUser()
},[])
useEffect(()=>{
console.log(user);
},[user])
  const HandleThumbNailChange = (e) => {
    if (Video !== "") {
      setThumbnail(URL.createObjectURL(e.target.files[0]));
      setthumbnailFile(e.target.files[0]);
    } else {
      alert("First Select Video");
    }
  };

  const uploadVideo = async () => {
    try{
    const commentMode = sessionStorage.getItem("commentMode");
    const video = videoRef.current.firstChild.firstChild.nextElementSibling.childNodes[0]
    let videoLength = videoRef.current.firstChild.firstChild.nextElementSibling.childNodes[0].duration;
    let shortivideo = null;
    const seconds = Math.floor(videoLength % 60);
    const minutes = Math.floor(videoLength / 60) % 60;
    if(minutes >= 1 ) shortivideo  = false
    else if(minutes === 1 || seconds <= 60) shortivideo = true;
    UploadVideoContext.uploadVideoFunc(thumbnailFile,videoFile,videoTitle,description,shortivideo,user,commentMode,video);
    }catch(error){
      console.log(error)
    }
  
};

return closeUploadPage ? (
    <Library />
  ) : (
    openComponent === false ? (
    !commentMode ? (
    <div className="uploadVideo">
    
      <IoMdClose className="close_page_icon" />
      <input
            type="file"
            accept="video/*"
            onChange={HandleFileChange}
            ref={inputRef}
            hidden
          />
      {Video !== "" ? (
        <div className="Preview_video">
          {/* <video src={Video} controls poster={Thumbnail ? Thumbnail : null} /> */}
         <div ref={videoRef}><VideoPlayer src={Video} poster={Thumbnail} id="videplayer"/></div> 
        {UploadVideoContext.Videoprogress > 0 ? <button className="select_file" onClick={() => inputRef.current.click()} disabled style={{opacity: "0.3"}}>Select File</button>:<button className="select_file" onClick={() => inputRef.current.click()}>Select File</button>}  
          <div className="uploadVideoProgress"><p className='text-white' style={{width:UploadVideoContext.Videoprogress + '%'}}></p></div>
          <p>{UploadVideoContext.Videoprogress}%</p>
        </div>
      ) : (
        <div className="video_upload_top_section" >
         
          <div className="uploadIcon_wrapper" onClick={() => inputRef.current.click()}>
            <MdUpload/>
          </div>
          <p>Select Video to upload</p>
          <button className="select_file" onClick={() => inputRef.current.click()}>Select File</button>
        </div>
      )}
      <div className="input_title_section">
        <input
          type="text"
          name="video_title"
          id="Title"
          placeholder="Create Title For video"
          onChange={(e) => setvideoTitle(e.target.value)}
        />
      </div>
      <div
        className="description_section"
        onClick={() => setopenComponent(true)}
      >
        <RiMenu2Fill className="menu" />
        <div>
          <h5>Description</h5>
          <p className="description_text">
            {description !== ""
              ? description
              : "Use the vw unit when sizing the text. 10vw will set the size to 10% of the viewport width."}
          </p>
        </div>
        {/* {openComponent ? <Description /> : null} */}
      </div>
      <div className="video_thumbnail">
        <h5>Thumbnail</h5>
        <p>Set a thumbnail that stands out and draws viewers' attention.</p>
        <div className="thumbnail_picker_div">
          {Thumbnail !== "" ? (
            <img
              src={Thumbnail}
              alt={Thumbnail}
              ref={imgRef}
              onClick={() => PicPickerRef.current.click()}
            />
          ) : (
            <FaFileImage onClick={() => PicPickerRef.current.click()} />
          )}
          <input
            type="file"
            hidden
            ref={PicPickerRef}
            onChange={HandleThumbNailChange}
          />
        </div>
      </div>
      <div className="comment_mode">
        <MdOutlineComment />
        <div onClick={() => setcommentMode(true)}>
          <h5>Comments</h5>
          <p>{CommentMode}</p>
        </div>
        {commentMode ? <CommentType /> : null}
      </div>
      <div className="btn_div">
        {UploadVideoContext.Videoprogress > 0? <button className="select_file"  disabled style={{opacity: "0.3"}}>
          Uploding Video...
        </button>:  <button className="select_file" onClick={uploadVideo}>
          Upload Video
        </button>}
       
      </div>
    </div>
    ) : (
      <CommentType/>
    )
    ) : (
      <Description/>
     )
  )
}

export default UploadVideo;
