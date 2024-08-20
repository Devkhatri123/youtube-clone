import React, { useEffect, useRef, useState } from 'react'
import "../CSS/shortvideo.css";
import { BiLike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";
import { BiDislike } from "react-icons/bi";
import { BiSolidDislike } from "react-icons/bi";
import { MdOutlineMessage } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { IoMdPlay } from "react-icons/io";
import { IoIosArrowRoundBack } from "react-icons/io";
import video from "../Pics/Jethalal ki farmais.mp4";
import video2 from "../Pics/shorts2.mp4";
import video3 from "../Pics/shorts3.mp4";
import { onSnapshot,doc,getDoc,collection } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
function ShortVideos() {
  let [Index,setIndex] = useState(0);
  const [LikeShort,setLikeShort] = useState(false);
  const [Ispause,setIspause] = useState(false);
  let [ShortVideos,setShortVideos] = useState([]);
  const Progressref = useRef();
  const [windowHeight,setwindowHeight] = useState(window.innerHeight);
 
  let shortVideos = [
    {
      index : 0,
      shortCreator:"@TaarakMehtaKaOoltahChashmah",
      shortchannelPic:"https://lh3.googleusercontent.com/a/ACg8ocJgkb86w2gS3ckMXBztBiGJklZcIQVXhWAHn-P9-rbcLKqSkw=s96-c",
      Title:"Jethalal ki farmais!!😂😂",
      shortUrl:"/static/media/shorts2.824b0a761fe0d839cb8f.mp4",
      like: 0,
    },
    {
      index : 1,
      shortCreator:"Dev khatri",
      shortchannelPic:"https://lh3.googleusercontent.com/a/ACg8ocJgkb86w2gS3ckMXBztBiGJklZcIQVXhWAHn-P9-rbcLKqSkw=s96-c",
      Title:"TaarakMehtaKaOoltahChashmah",
       shortUrl:"/static/media/Jethalal ki farmais.d7c6bd3e624065bbc8c4.mp4",
       like: 0,
    },
    {
      index : 2,
      shortCreator:"Dev khatri",
      shortchannelPic:"https://lh3.googleusercontent.com/a/ACg8ocJgkb86w2gS3ckMXBztBiGJklZcIQVXhWAHn-P9-rbcLKqSkw=s96-c",
      Title:"TaarakMehtaKaOoltahChashmah",
       shortUrl:"/static/media/shorts3.fe815b9bd9b6afe13449.mp4",
       like: 0,
    }
  ];
  useEffect(() => {
    onSnapshot(collection(firestore, "videos"), async (snapshot) => {
       const FetchedData = await Promise.all(
       snapshot.docs.map(async (Doc) => {
           const userRef = doc(firestore, "users", Doc.data().createdBy);
           const docSnap = await getDoc(userRef);
           return {
             id: Doc.id,
             Videodata: Doc.data(),
             UserData: docSnap.data(),
           };
         })
        );
        setShortVideos(FetchedData);
     });
    
   }, []);
   useEffect(()=>{
   const FilteredShortVideos = ShortVideos.filter((shortVideo)=>{
     return shortVideo.Videodata.shortVideo === true;
});
 console.log(FilteredShortVideos);
   },[ShortVideos])
  useEffect(()=>{
    console.log(ShortVideos);
     window.onresize = ()=>{
      setwindowHeight( window.innerHeight);
     }
  },[windowHeight])
 useEffect(()=>{
  let videos = document.querySelectorAll("#shortvideo");
  var index = 0
 if(videos[index]){
  videos[index].play();
  }else{
    videos[0].play();
  }

 },[])
 useEffect(() => {
  const short_video_container = document.querySelectorAll(".short_video_container");
  let currentContainer = short_video_container[Index];

  if (currentContainer) {
    let video = currentContainer.querySelector('video');
    video.autoplay = true;
    video.play();
    video.muted = false;
    video.loop = true;

    let touchStart = 0;
    let touchEnd = 0;

    const handleTouchStart = (e) => {
      touchStart = e.targetTouches[0].clientY;
    };

    const handleTouchMove = (e) => {
      touchEnd = e.targetTouches[0].clientY;
    };

    const handleTouchEnd = () => {
      if(touchStart === 0 || touchEnd === 0){return};
      const distance = touchStart - touchEnd;
      console.log(distance)
      if(distance > 100){
        if (short_video_container[Index + 1]) {
        currentContainer = short_video_container[Index];
        video = currentContainer.getElementsByTagName('video')[0];
        video.pause();
          setIndex(Index + 1);
          window.scrollTo(0, short_video_container[Index + 1].offsetTop);
          if(Ispause) setIspause(false);
      }
    }else if (distance < 100 && distance > 0){
      window.scrollTo(0, short_video_container[Index].offsetTop);
    }else if (distance > -70 && distance < 0){
      window.scrollTo(0, short_video_container[Index].offsetTop);
    }
   else if(distance < -70){
      if (short_video_container[Index - 1]) {
        setIndex(Index - 1);
        currentContainer = short_video_container[Index];
        video = currentContainer.getElementsByTagName('video')[0];
        video.pause();
        window.scrollTo(0, short_video_container[Index - 1].offsetTop); 
        if(Ispause) setIspause(!Ispause);
    }
  }
      touchStart = 0;
      touchEnd = 0;
    };

    currentContainer.addEventListener("touchstart", handleTouchStart, false);
    currentContainer.addEventListener("touchmove", handleTouchMove, false);
    currentContainer.addEventListener("touchend", handleTouchEnd, false);

    return () => {
      // Cleanup event listeners
      currentContainer.removeEventListener("touchstart", handleTouchStart);
      currentContainer.removeEventListener("touchmove", handleTouchMove);
      currentContainer.removeEventListener("touchend", handleTouchEnd);
    };
  }
}, [Index]);
  const HandleLike = (index) => {
    setLikeShort(!LikeShort);
    shortVideos[index].like += 1;
    console.log(shortVideos[index]);
    console.log(shortVideos)
  }
  const HandlePause = (e) => {
    setIspause(!Ispause);
    if (Ispause) e.target.play();
    else e.target.pause();
  }
  const HandleProgress = (e) => {
      console.log(e.target.currentTime);
      const short_video_container = document.querySelectorAll(".short_video_container");
      let currentContainer = short_video_container[Index];
      const ProgressWidth = currentContainer.querySelector('span');
      const Progress = Math.round(e.target.currentTime / e.target.duration * 100);
      ProgressWidth.style.width = Progress + '%';
  }
  return (
    <div className='shortVideos_container'>
      <IoIosArrowRoundBack className='back_icon'/>
       {shortVideos.map((shortvideo,index)=>{
      return <div className="short_video_container" key={index} style={{height:windowHeight+"px"}}>
       <video src={shortvideo.shortUrl} muted id="shortvideo" data-video={index} 
      onClick={HandlePause} onTimeUpdate={HandleProgress}
    />
     {Ispause ? <div className="middle_control"><IoMdPlay/></div>:null}
      <div className='short_details'>
        <div className='short_channel'>
            <img src="https://lh3.googleusercontent.com/a/ACg8ocJgkb86w2gS3ckMXBztBiGJklZcIQVXhWAHn-P9-rbcLKqSkw=s96-c" alt="" />
            <p>{shortvideo.shortCreator}</p>
        </div>
        <div className="short_title">
            <p>{shortvideo.Title}</p>
        </div>
        <div  className="shortvideoprogressBar">
                  <span id="short_progressBar_width" ref={Progressref}></span>
                </div>
      </div>
      <div className="short_controls">
        <div className="like control" >
        { LikeShort ? <BiSolidLike /> : <BiLike onClick={()=>HandleLike(index)}/>} 
            <p>{shortvideo.like}</p>
        </div>
        <div className="dislike control">
          <BiDislike/>
          <p>2</p>
        </div>
        <div className="message control">
          <MdOutlineMessage/>
          <p>3520</p>
        </div>
        <div className="menu control">
          <BsThreeDots/>
        </div>
        <div className="channel control">
        <img src="https://lh3.googleusercontent.com/a/ACg8ocJgkb86w2gS3ckMXBztBiGJklZcIQVXhWAHn-P9-rbcLKqSkw=s96-c" alt="" style={{width: "45px",borderRadius:"10px"}}/>
        </div>
      </div>
      </div>
    })}
    </div>
  )
 }
export default ShortVideos
