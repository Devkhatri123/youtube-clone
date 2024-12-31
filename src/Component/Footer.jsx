import { React, useState, useEffect } from "react";
import { IoMdHome } from "react-icons/io";
import { SiYoutubeshorts } from "react-icons/si";
import { MdOutlineSubscriptions } from "react-icons/md";
import { MdLibraryAdd } from "react-icons/md";
import { auth,firestore } from "../firebase/firebase";
import "../CSS/Footer.css";
import { Link } from "react-router-dom";
import { collection,doc,onSnapshot,getDoc } from "firebase/firestore";
function Footer() {
  let [user, Setuser] = useState(null);
  let [ShortVideos,setShortVideos] = useState([]);
  const [Loading,setLoading] = useState(false);
  const [FilteredShortVideos,setFilteredShortVideos] = useState([]);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      Setuser(user);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    try{
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
    }catch(error){
      console.log(error);
    }finally {
      setLoading(false);
    }
   }, []);
   useEffect(()=>{
   setFilteredShortVideos(ShortVideos.filter((shortVideo)=>{
     return shortVideo.Videodata.shortVideo === true;
}));
  },[ShortVideos]);
 
  return (
    <div className="footer">
      <Link to="/youtube-clone">
        <IoMdHome />
        <p>Home</p>
      </Link>
    {!Loading ?  (<Link to={`/short/${FilteredShortVideos[0]?.id}`}>
        <SiYoutubeshorts />
        <p>Shorts</p>
        </Link>):<Link to={"/"}>
        <SiYoutubeshorts />
        <p>Shorts</p>
        </Link>} 
      <Link to="/Library">
      {!user?(
        <>
        <MdLibraryAdd />
        <p>Library</p>
        </>
      ):
       <>
      <img src={user.photoURL} alt="user-pic" style={{height:"20px",width:"20px",borderRadius:"50%"}}/>
      <p>You</p>
      </>
}
      </Link>
    </div>
  );
}

export default Footer;
