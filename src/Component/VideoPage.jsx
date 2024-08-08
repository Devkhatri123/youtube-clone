import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { firestore } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
function VideoPage() {
  const params = useParams();
  let [Video, Setvideo] = useState();
  let [user, setUser] = useState();
  let [Loading, setLoading] = useState(true);
  const FetchVideo = async () => {
    try {
      const videoRef = doc(firestore, "videos", params.id);
      const video = await getDoc(videoRef);
      if (video.exists) {
        Setvideo(video.data());
        const userRef = doc(firestore, "users", video.data().createdBy);
        const User = await getDoc(userRef);
        if (User.exists) {
          setUser(User.data());
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    FetchVideo();
    if(Loading === false){
    console.log(Video);
    console.log(user)
    }
  }, [Loading]);

  return (
    <div>
    {!Loading ? 
    <>
    <video src={Video.videoURL} poster={Video.Thumbnail}/>
    <p className="text-white">{Video?.Title}</p> <p className="text-white">{user?.name}</p>
    </>: <p>Loading...</p>}   
      <h1 className="text-white">Video Id : {params.id}</h1>
    </div>
  );
}

export default VideoPage;
