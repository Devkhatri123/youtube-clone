import {React,useState,useEffect} from 'react'
import Videos from './Videos'
import Body from './Body'
import { onSnapshot,getDoc,doc,collection } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
function MainPage() {
  let [videos, setVideos] = useState([]);
 
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
       setVideos(FetchedData);
   })
  }, []);
  useEffect(()=>{
console.log(videos)
  },[videos])
  return (
    <>{
      videos && <Videos video={videos} />
    }
  </>
  )
}

export default MainPage
