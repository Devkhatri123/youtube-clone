import { React, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Smallscreencomponent from "./Smallscreencomponent";
import Largescreencomponent from "./Largescreencomponent";
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
  if(screenWidth <= 600){
    return <Smallscreencomponent FullLengthVideos={FullLengthVideos} ShortVideos={ShortVideos}/>
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
