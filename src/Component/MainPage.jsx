import {React,useState,useEffect, useContext} from 'react'
import Videos from './Videos'
import { onSnapshot,getDoc,doc,collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import MainPageLoadingScreen from './MainPageLoadingScreen';
import Navbar from './Navbar';
import Footer from './Footer';
import MiniSideBar from './MiniSideBar';
import LargeScreenSideBar from './LargeScreenSideBar';
import ErrorPage from './ErrorPage';
import { Navbarcontext } from '../Context/NavbarContext';
function MainPage() {
  const currentState = useContext(Navbarcontext);
  let [videos, setVideos] = useState([]);
  const [Loading,setLoading] = useState(true);
  const [error,setError] = useState(false);
  const [ErrorMessage,SetErrorMessage] = useState('');
  let array = [];
  useEffect(()=>{
    const Getvideos = async () => {
      setLoading(true)
   try{
    const getvideosdocs = await getDocs(collection(firestore,"videos"))
    const result = getvideosdocs.docs.map(async(Doc)=>{
      const videoCreatorDocRef = doc(firestore, "users", Doc.data().createdBy);
      const videoCreatorDoc = await getDoc(videoCreatorDocRef)
      return {
        id: Doc.id,
        Videodata: Doc.data(),
        UserData: videoCreatorDoc.data(),
      };
    })
   const a =  Promise.all(result)
   a.then((Res)=>{
     setVideos(Res)
   })
    if(!videos){
      setError(true)
      SetErrorMessage("There is a problem")
    }
    setLoading(false)
   }catch(error){
   setError(true);
    SetErrorMessage(error.message);
   }
  }
  Getvideos()
  },[])
  useEffect(()=>{
    console.log(videos)
  },[videos])
  // useEffect(() => {
  //   const GetVideos = async () => {
  //     setLoading(true);
  //     try {
  //       // Attach an onSnapshot listener with an error handler
  //       onSnapshot(
  //         collection(firestore, "videos"),
  //         async (snapshot) => {
  //           try {
  //             const FetchedData = await Promise.all(
  //               snapshot.docs.map(async (Doc) => {
  //                 const userRef = doc(firestore, "users", Doc.data().createdBy);
  //                 const docSnap = await getDoc(userRef);
  //                 return {
  //                   id: Doc.id,
  //                   Videodata: Doc.data(),
  //                   UserData: docSnap.data(),
  //                 };
  //               })
  //             );
  
  //             if (!FetchedData) {
  //               setError(true);
  //               setLoading(false);
  //             }
  
  //             setVideos(FetchedData);
  //             setLoading(false);
  //             SetErrorMessage('');
  //           } catch (error) {
  //             console.log("Data processing error:", error);
  //             setLoading(false);
  //             setError(true);
  //             SetErrorMessage(error.message);
  //           }
  //         },
  //         (error) => {
  //           // Handle Firestore snapshot errors here
  //           console.error("Firestore snapshot error:", error);
  //           setLoading(false);
  //           setError(true);
  //           SetErrorMessage(error.message);
  //         }
  //       );
  //     } catch (error) {
  //       console.log(error);
  //       setLoading(false);
  //       setError(true);
  //       SetErrorMessage(error.message);
  //     }
  //   };
  
  //   GetVideos();
  // }, []);
  return (
    <> {Loading ? (
      <MainPageLoadingScreen />
    ) : (
      <>
        <Navbar />
        {error ||ErrorMessage ? (
          <ErrorPage ErrorMessage={ErrorMessage}/>
        ) : (
          <>
            <Videos video={videos} />
            <Footer />
            <MiniSideBar NonFilteredVideos = {videos}/>
            <LargeScreenSideBar />
          </>
        )}
      </>
    )}
  </>
  )
}

export default MainPage
