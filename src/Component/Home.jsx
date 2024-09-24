import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { auth, firestore } from '../firebase/firebase';
import { BsThreeDotsVertical } from "react-icons/bs"
import "../CSS/HomePage.css"
import { HomeContext } from '../Context/HomePageContext';
import HomeHeader from './HomeHeader';
function Home() {
    const homeContext = useContext(HomeContext);
    const params = useParams();
    const [AllVideos,setAllvideos] = useState([]);
    const [user,setuser] = useState();
    const [LoggedInUser,SetLoggedInUser] = useState(null)
    const [isSubscribed,setisSubscribed] = useState(false);
    const [Error,setError] = useState('');
    const [btnLoading,setbtnLoading] = useState(true);
    const [PageLoading,setPageLoading] = useState(false);
    const createdVideos = [];
    useEffect(()=>{
     auth.onAuthStateChanged((currentuser)=>{
      SetLoggedInUser(currentuser);
     })
    },[])
    useEffect(()=>{
      const GetData = async() => {
      const result = await homeContext.GetchannelData(params.id);
      setAllvideos(result)
    }
    GetData()
    },[params.id,homeContext]);

useEffect(()=>{
  const GetSubscribedDoc = async () => {
    setbtnLoading(true);
    try{
    if(LoggedInUser){
  const subscribedDocRef = doc(collection(firestore,`users/${LoggedInUser.uid}/subscribedChannel`),params.id);
  const subscribedDocData = await getDoc(subscribedDocRef);
  if(subscribedDocData.exists()){
    setisSubscribed(true);
  }
}
  }catch(error){
    console.log(error)
  }finally{
    setbtnLoading(false);
  }
}
  GetSubscribedDoc();
},[LoggedInUser,params.id]);
// useEffect(()=>{
//  setAllvideos(homeContext.AllVideos)
 
// },[homeContext])
useEffect(()=>{
  console.log(AllVideos);
  setuser(homeContext.user)
},[AllVideos])
  return !PageLoading ? (
    !Error ? (
    <div className='userhomepage'>
      <HomeHeader />
         <div id="tabsContainer">
          <div id="videos">
            <Link to={"#"}>Videos</Link>
          </div>
          <div id="Shortvideos">
            <Link to={`/${params.id}/${user?.name.replace(" ","")}}/Shorts`}>Shorts</Link>
           </div>
          <div id="Playlists">
            <Link to={"#"}>Playlists</Link>
         </div>
         </div>
         <div id="homepage-body">
          {AllVideos && AllVideos.filter((video)=>{
            return !video.video.shortVideo
          }).map((video,index)=>{

           return  <div id="video" key={index}>
            <Link to={`/watch/${video?.videoUrl}`}>
            <div id="thumbnail_container">
            <img src={video?.video.Thumbnail} alt="" className="video" />
            </div>
               </Link>
               <div className="video_bottom">
                            <div className="video_bttom_left">
                              <div className="video_title_and_channelName">
                                <h3 id="video_title" className="title">
                                  {video?.video.Title}
                                </h3>
                                <div>
                                  <p>
                                    {user?.name} • 
                                    {" "} {video?.video.views} Views
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div><BsThreeDotsVertical className="videomenu" /></div>
              </div>
              </div>
            })}
         </div>
        </div>
    ):<p style={{color:"white",height:"100vh",display:"flex",justifyContent:"center",alignItems:"center"}}>{Error}</p>
  ):<p>Loading...</p>
}

export default Home
