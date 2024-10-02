import {React,useState,useEffect, useContext} from 'react'
import Videos from './Videos'
import Body from './Body'
import { onSnapshot,getDoc,doc,collection } from 'firebase/firestore';
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
  const [Error,setError] = useState(false);
  const [ErrorMessage,SetErrorMessage] = useState('')
  useEffect(() => {
      const GetVideos = async() => {
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
       console.log(FetchedData)
       if(!FetchedData){
        setError(true);
        setLoading(false);
       }  
       setVideos(FetchedData);
       setLoading(false);
       SetErrorMessage('');
   })
  }catch(error){
    console.log(error)
    setLoading(false)
    setError(true);
    SetErrorMessage(error.message);
    return null
  }finally {
  //  setLoading(false);
    // setError(false)
  }
}
GetVideos();

  }, []);
  return (
    <> {Loading ? (
      <MainPageLoadingScreen />
    ) : (
      <>
        <Navbar />
        {Error? (
          <ErrorPage />
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
