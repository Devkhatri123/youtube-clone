import React,{useState,useEffect, useRef, useContext} from 'react'
import { MdMenu } from "react-icons/md";
import youtubeImage from "../Pics/youtube.png";
import { CiSearch } from "react-icons/ci";
import { PiVideoCameraLight } from "react-icons/pi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { auth, firestore } from '../firebase/firebase';
import {useNavigate } from 'react-router';
import {FaRegUserCircle} from "react-icons/fa";
import { getDoc,doc,setDoc } from 'firebase/firestore';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import "../CSS/Navbar.css";
import { createSearchParams, Link} from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { Navbarcontext } from '../Context/NavbarContext';
 const LargeScreenNavbar = React.memo(() => {
  const currentState = useContext(Navbarcontext);
  const inputRef = useRef(null);
  const [searchTerm,setsearchTerm] = useState('');
  const [Loading,setLoading] = useState(true);
  const [openNotifications,setopenNotifications] = useState(false);
  const [newVideos,setnewVideos] = useState([]);
    const navigate = useNavigate();
    const resultRef = useRef();
    const [user,Setuser] = useState(null);
    const [CurrentUser,setCurrentUser] = useState(null);
    const [searchedVideos,setsearchedVideos] = useState([]);
    useEffect(()=>{
        auth.onAuthStateChanged(async(user)=>{
        Setuser(user);       
        })
     },[auth]);
     useEffect(()=>{
     const fetchedData = JSON.parse(sessionStorage.getItem('inputData'))
     if(fetchedData){
     setsearchTerm(fetchedData?.searchTerm)
     }
     },[searchTerm])
    
   const HandleSearch = (e) => {
     setsearchTerm(e.target.value);
     console.log(searchTerm)
    //  setinputData('')
     const data =  currentState.GetData(searchTerm);
     sessionStorage.setItem("inputData",JSON.stringify({searchTerm:searchTerm,searchedVideos:data}));
     setsearchedVideos(data);
    }
    useEffect(()=>{
      setsearchTerm(searchTerm)
    },[searchTerm])
    const HandleKeyDown = (e) => {
      if(e.key === "Enter"){
        e.preventDefault();
        currentState.setsearchTerm(searchTerm)
        const data= currentState.GetData(searchTerm)
        sessionStorage.setItem("inputData",JSON.stringify({searchTerm:searchTerm,searchedVideos:data}));
        navigate({
          pathname: "/results",
          search: createSearchParams({
              v: searchTerm,
          },{replace:true}).toString()
      });
    setsearchedVideos([])
       }else if (e.key === "Backspace"){
        if(searchTerm === ""){
          setsearchedVideos([]);
        }  
       }
     }
     
    const SignUpWithGoogle = async() => {
      let Provider = new GoogleAuthProvider();
      await signInWithPopup(auth, Provider)
        .then(async(res) => {
         console.log(res);
        let docRef= doc(firestore,"users",res.user.uid);
         const data = { 
          uid: res.user.uid,
          name:res.user.displayName,
          email:res.user.email,
          channelPic:res.user.photoURL,  
          subscribers:0,   
          Time: new Date(),   
         }
         const GetUserDoc = await getDoc(docRef);
         if(!GetUserDoc.exists()){
         await setDoc(docRef,data)
         console.log("Document Created Successfully");
         }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    const HandleToggle = () =>{
      setLoading(true);
      
     try{
    onSnapshot(collection(firestore,`users/${user?.uid}/NewVideos`) ,async (snapShot)=>{
      const newVideos = await Promise.all (
      snapShot.docs.map(async(snapShotDoc)=>{
      const videoDocRef = doc(firestore,"videos",snapShotDoc.data().Videoid);
      const videoDocData = await getDoc(videoDocRef);
      if(videoDocData.data()?.createdBy !== undefined){
      const CreaterDocRef = doc(firestore,"users",videoDocData.data()?.createdBy);
      const createrDocData = await getDoc(CreaterDocRef);
      return {
        videoId:videoDocData.id,
        videoData:videoDocData.data(),
        userData:createrDocData.data(),
      }
    }
      })
    )
    setnewVideos(newVideos)
     });
     setLoading(false)
    }catch(error){
      console.log(error);
    }finally{
    setopenNotifications(!openNotifications)
    }
  }
  useEffect(()=>{
    const GetCurentUser = async() => {
      currentState.setError(true)
      try{
      const userDocRef = doc(firestore,`users/${user?.uid}`);
      const userData = (await getDoc(userDocRef)).data();
      setCurrentUser(userData);
      currentState.setError(false)
      }catch(error){
        currentState.setError(true)
        console.log(error.message)
        console.log(currentState.Error)
      }
    }
    GetCurentUser();
  },[user]);
  
  return (
   <div className='large-screen-Navbar'>
    <div className='large-screennavbar-left'>
        <div onClick={()=>{currentState.setshowSidebar(!currentState.showSidebar);console.log(currentState.showSidebar)}}><MdMenu style={{zIndex:"9999"}}/></div>
        <img src={youtubeImage} alt='logo' onClick={()=>{navigate("/");currentState.setshowSidebar(!currentState.showSidebar)}}/>
    </div>
    <div className="large-screennavbar-center">
        <input type="text" name="" id="search-term" ref={inputRef} placeholder='search here' value={searchTerm} onChange={HandleSearch} onKeyDown={HandleKeyDown}/>
      <button><CiSearch/></button> 
      
      {searchedVideos && searchedVideos.length > 0 && (
      <div className="results" ref={resultRef}>
        {searchedVideos && searchedVideos.map((searchVideo,index)=>{
           return <div id="result" key={index}>
            <CiSearch/>
         <Link style={{color:"white"}} to={searchVideo.data.shortVideo ? `/short/${searchVideo.id}`:`/watch/${searchVideo.id}`}>{searchVideo.data.Title}</Link>
          </div>
        })}
        </div> 
      )}
    </div>
    <div className='large-screennavbar-right'>
   <PiVideoCameraLight onClick={()=>navigate("/uploadVideo")}/>
   <IoMdNotificationsOutline  onClick={HandleToggle}/>
   {CurrentUser?.Numberofvideos && (
    CurrentUser?.Numberofvideos > 0 && CurrentUser?.Numberofvideos < 10 ? (
    <span className='notification-badge'>{CurrentUser?.Numberofvideos}</span>
    ):<span className='notification-badge'>9+</span>
  )}
   {openNotifications && (
   <div className="notifications">
    <div className='notifications-top'>
      <h4>Notifications</h4>
    </div>

    {!Loading ? (
    newVideos && newVideos.filter((newvideo)=>{
      return newvideo !== undefined
    }).map((newvideo,index)=>{
    return <div className="notification" key={index}>
     <img src={newvideo?.userData?.channelPic} alt="channelpic" style={{width:"40px",height:"40px",borderRadius:"50%"}}/>
     <div style={{minWidth:"271px"}}>
      <p className='video-title'>{newvideo?.videoData?.Title}</p>
      <p>4 hours ago</p>
     </div>
     <img src={newvideo?.videoData?.Thumbnail} alt="video-thumbnail" className='video-thumbnail'/>
    </div>
})
):<p>Loading...</p>}
   </div>
   )}
   {user ? (
              <img src={user?.photoURL} alt="profileImg" onClick={()=>auth.signOut()}/>
            ) : (
              <FaRegUserCircle
                className="FaRegUserCircle"
                onClick={SignUpWithGoogle}
              />
            )}
    </div>
   </div>
  )
})
export default LargeScreenNavbar
