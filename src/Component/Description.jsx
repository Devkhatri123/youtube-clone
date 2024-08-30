import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import "../CSS/uploadVideo.css";
import UploadVideo from "./uploadVideo";
function Description() {
  let [videoDescription, setvideoDescription] = useState("");
  let [OpenuploadPage, setOpenuploadPage] = useState(false);
  const setDescription = (e) => {
    setvideoDescription(e.target.value);
    sessionStorage.setItem("Description", videoDescription);
  };
  useEffect(()=>{
    sessionStorage.setItem("Description", videoDescription);
    console.log(videoDescription);
  },[videoDescription]);
  return OpenuploadPage ? (
    <UploadVideo />
  ) : (
    <div className="description_page">
      <IoIosArrowRoundBack onClick={() => setOpenuploadPage(true)} />
      <textarea
        name="description"
        id="description"
        placeholder="Write Video description"
        onChange={setDescription}
      ></textarea>
      {/* {OpenuploadPage ? <UploadVideo /> : null} */}
    </div>
  );
}

export default Description;
