import React,{useContext, useEffect,useRef,useState} from 'react'
import DescriptionPage from './DescriptionPage';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import { useParams } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { videoContext } from '../Context/VideoContext';

function VideoDetail() {
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get('v');
   const [video,setvideo] = useState({});
    const VideoContext = useContext(videoContext)
    useEffect(()=>{
     
        const GetVideo = async() => {
          try{
            const docRef = doc(firestore,"videos",videoId);
            const videoDoc = await getDoc(docRef);
            if(videoDoc.exists()){
            setvideo(videoDoc.data());
            const docRef = doc(firestore,"users",videoDoc.data().createdBy);
            const userDoc = await getDoc(docRef);
           if(userDoc.exists()){
            return {
              id: videoDoc.id,
              Videodata: videoDoc.data(),
              UserData: userDoc.data(),
            }
            }
            }else{
              console.log("No such document")
            }
          }catch(error){
            console.log(error.message)
          }
        }
      GetVideo().then((res)=>{
        setvideo(res);
      })
       
},[videoId])
return (
    <div style={{padding: "0 0.3em"}}>
   <h3 id="video-title">{video?.Videodata?.Title}</h3>
              <div className="show_views">
                <div>
                  <span id="views">{video?.Videodata?.views} Views</span>
                  <span className="video_upload_time">&nbsp; {VideoContext.getVideoPublishedTime(video)}</span>
                </div>
                <span>...more</span>
              </div>
    </div>
   )
  
}

export default VideoDetail
