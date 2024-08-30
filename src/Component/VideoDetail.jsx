import React,{useEffect,useRef,useState} from 'react'
import DescriptionPage from './DescriptionPage';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import { useParams } from 'react-router';

function VideoDetail() {
    const [showDescription,setshowDescription] = useState(false);
    // const [Loading,setLoading] = useState(false);
    const [video,setvideo] = useState(null);
    const [user,setuser] = useState(null)
    const params = useParams()
    useEffect(()=>{
        const GetVideo = async() => {
            const docRef = doc(firestore,"videos",params.id);
            const videoDoc = await getDoc(docRef);
            if(videoDoc.exists()){
            setvideo(videoDoc.data());
            const docRef = doc(firestore,"users",videoDoc.data().createdBy);
            const userDoc = await getDoc(docRef);
           if(userDoc.exists()){
            setuser(userDoc.data());
            }
            console.log(video)
            }
        }
        GetVideo()
       
},[params.id])
return (
    <div style={{padding: "0 0.3em"}}>
   <h3 id="video-title">{video?.Title}</h3>
              <div className="show_views">
                <div>
                  <span id="views">{video?.views} Views</span>
                  <span className="video_upload_time">&nbsp; 3 Months Ago</span>
                </div>
                <span>...more</span>
              </div>
    </div>
   )
  
}

export default VideoDetail
