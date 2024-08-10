import React, { useRef, useState } from "react";
import { MdUpload } from "react-icons/md";
import { RiMenu2Fill } from "react-icons/ri";
import { MdOutlineComment } from "react-icons/md";
import "../CSS/uploadVideo.css";
import Description from "./Description";
import CommentType from "./CommentType";
import { IoMdClose } from "react-icons/io";
import { FaFileImage } from "react-icons/fa";
import Library from "./Library";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { auth, firestore, storage } from "../firebase/firebase";
import { v4 } from "uuid";
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
function UploadVideo() {
  let [Video, setVideo] = useState("");
  let [openComponent, setopenComponent] = useState(false);
  let [Thumbnail, setThumbnail] = useState("");
  let [videoTitle, setvideoTitle] = useState("");
  let [commentMode, setcommentMode] = useState(false);
  let [closeUploadPage, setcloseUploadPage] = useState(false);
  let description = sessionStorage.getItem("Description");
  let CommentMode = sessionStorage.getItem("commentMode");
  let [videouploadProgress, setvideouploadProgress] = useState(0);
  let [ThumbNailUploadProgress,setThumbNailUploadProgress] = useState(0);
  const inputRef = useRef(null);
  let [videoFile, setvideoFile] = useState("");
  let [thumbnailFile, setthumbnailFile] = useState("");
  let [array, setarray] = useState([]);
  const PicPickerRef = useRef(null);
  const HandleFileChange = (e) => {
    console.log(e.target.files);
    setvideoFile(e.target.files[0]);
    setVideo(URL.createObjectURL(e.target.files[0]));
  };
  const closePage = () => {
    if (Video !== "" || description !== "" || CommentMode !== "") {
      if (
        window.confirm(
          "Are you sure you want to close? Your uploaded video and data will be lost"
        )
      ) {
        sessionStorage.clear();
        setcloseUploadPage(true);
      }
    } else {
      setcloseUploadPage(true);
    }
  };
  const HandleThumbNailChange = (e) => {
    console.log(e.target.files);
    if (Video !== "") {
      setThumbnail(URL.createObjectURL(e.target.files[0]));
      setthumbnailFile(e.target.files[0]);
    } else {
      alert("First Select Video");
    }
  };

  const uploadVideo = async () => {
    const videopRef = ref(storage, `Videos/${v4()}`);
    const ThumbNailRef = ref(storage, `Thumbnail/${v4()}`);

    const uploadVideoTask =  uploadBytesResumable(videopRef, videoFile);
    uploadVideoTask.on(
      "state_changed",
      (snapshot) => {
        let Videoprogress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setvideouploadProgress(Videoprogress);
      },
      (error) => {
        console.log(error);
      },
    );
    const ThumbNailuploadTask = uploadBytesResumable(ThumbNailRef, thumbnailFile);
    ThumbNailuploadTask.on("state_changed",(snapShot)=>{
      let ThumbNailProgress = Math.round((snapShot.bytesTransferred / snapShot.totalBytes) * 100);
      setThumbNailUploadProgress(ThumbNailProgress);
      
    },(error)=>{
         console.log(error);
    },
    
  )
  Promise.all([uploadVideoTask,ThumbNailuploadTask]).then(async()=>{
    const videoId = v4();
    console.log("video and thumbnail uploaded...");
    const videoURL = await getDownloadURL(uploadVideoTask.snapshot.ref);
    const thumbnailURL = await getDownloadURL(ThumbNailuploadTask.snapshot.ref);
    let docRef = doc(firestore,"videos",videoId);
    const data = {
      Title:videoTitle,
      description:description,
      videoURL:videoURL,
      Thumbnail:thumbnailURL,
      views:0,
      createdBy:auth.currentUser.uid,
    }
    await setDoc(docRef,data);
    console.log("Document Created Successfully");
    await addDoc(collection(firestore,`users/${auth.currentUser.uid}/createdVideos`),{
      videoUrl:videoId,
    });
   })
 
};

return (
  closeUploadPage ? (
    <Library />
  ) : (
    <div className="uploadVideo">
      <p className='text-white'>{videouploadProgress}%</p>
      <IoMdClose className="close_page_icon" onClick={closePage} />
      {Video !== "" ? (
        <div className="Preview_video">
          <video src={Video} controls poster={Thumbnail ? Thumbnail : null} />
        </div>
      ) : (
        <div className="video_upload_top_section">
          <input
            type="file"
            accept="video/*"
            onChange={HandleFileChange}
            ref={inputRef}
            hidden
          />
          <div className="uploadIcon_wrapper">
            <MdUpload onClick={() => inputRef.current.click()} />
          </div>
          <p>Select Video to upload</p>
          <button className="select_file">Select File</button>
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
        {openComponent ? <Description /> : ""}
      </div>
      <div className="video_thumbnail">
        <h5>Thumbnail</h5>
        <p>Set a thumbnail that stands out and draws viewers' attention.</p>
        <div className="thumbnail_picker_div">
          {Thumbnail !== "" ? (
            <img
              src={Thumbnail}
              alt={Thumbnail}
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
        <button className="select_file" onClick={uploadVideo}>
          Upload Video
        </button>
      </div>
    </div>
  )
);

}

export default UploadVideo;
