import {React,useState,useEffect, useContext} from 'react'
import Videos from './Videos'
import { getDoc,doc,collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import MainPageLoadingScreen from './MainPageLoadingScreen';
import Navbar from './Navbar';
import Footer from './Footer';
import MiniSideBar from './MiniSideBar';
import ErrorPage from './ErrorPage';
import NavbarStateProvider, { Navbarcontext } from '../Context/NavbarContext';
function MainPage() {
  const currentState = useContext(Navbarcontext);
  let [videos, setVideos] = useState([]);
  const [Loading,setLoading] = useState(true);
  const [error,setError] = useState(false);
  const [ErrorMessage,SetErrorMessage] = useState('');
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
  return (
    <> {Loading ? (
      <MainPageLoadingScreen />
    ) : (
      <>
        <Navbar />
        {error ||ErrorMessage  ||currentState.Error || currentState.ErrorMessage? (
          <NavbarStateProvider>
          <ErrorPage ErrorMessage={ErrorMessage}/>
          </NavbarStateProvider>
        ) : (
          <>
            <Videos video={videos} />
            <Footer />
            <MiniSideBar NonFilteredVideos = {videos}/>
          </>
        )}
      </>
    )}
  </>
  )
}

export default MainPage
