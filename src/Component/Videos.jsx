import { React, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../CSS/Video.css"
import Smallscreencomponent from "./Smallscreencomponent";
import MediumScreenComponent from "./MediumScreenComponent";
import Largescreencomponent from "./Largescreencomponent";
import Navbar from "./Navbar";
function Videos(props) {
  // const [Videos,setVideos] = useState([])
  const [ThumbnailWidth,setThumbNailWidth] = useState(window.innerWidth)
  const [ThumbnailHeight,setThumbnailHeight] = useState(window.innerWidth * (9/16));
  const [screenWidth,setscreenWidth] = useState(window.innerWidth);
  const [FullLengthVideos,setFullLengthVideos] =useState([]);
  const [ShortVideos,SetShortVideos] = useState([]);
const params = useParams()
  useEffect(()=>{
    setFullLengthVideos(props.video?.filter((FullLengthVideo)=>{
      if(params.id){
      return !FullLengthVideo.Videodata.shortVideo && params.id !== FullLengthVideo.id;
      }else{
        return !FullLengthVideo.Videodata.shortVideo
      }
     }))
  SetShortVideos(props.video?.filter((shortVideo)=>{
    return shortVideo.Videodata.shortVideo === true
  }))
  },[props]);
  useEffect(()=>{
    setThumbNailWidth(window.innerWidth);
    setThumbnailHeight(ThumbnailWidth * (9/16));
    const updateVideoSize = () => {
      setThumbNailWidth(window.innerWidth);
      setThumbnailHeight(ThumbnailWidth * (9/16));
      setscreenWidth(window.innerWidth)
    }
    window.addEventListener("resize",updateVideoSize)
    return ()=>{
      window.removeEventListener("resize",updateVideoSize)
    }
},[ThumbnailHeight,ThumbnailWidth]);
const returnComponent = () => {
  if(screenWidth < 587){
    return <Smallscreencomponent FullLengthVideos={FullLengthVideos} ShortVideos={ShortVideos}/>
  }else if (screenWidth > 587 && screenWidth < 874){
    return <MediumScreenComponent FullLengthVideos={FullLengthVideos} ShortVideos={ShortVideos}/>
  }else{
    return <Largescreencomponent FullLengthVideos={FullLengthVideos} ShortVideos={ShortVideos}/>
  }
}
  return (
    <>
    {returnComponent()}
   </>
  );
}
export default Videos;
