import { createContext, useState} from "react";
import {doc,getDocs,collection,getDoc} from "firebase/firestore";
import { firestore } from "../firebase/firebase";
export const HomeContext = createContext();
 const HomePageStateProvider = ({ children }) => {
    const [user,setuser] = useState(null);
    const [Allvideos,setAllvideos] = useState([]);
    const [Loading,setLoading] = useState(true);
    const [Error,setError] = useState('');
  
    const GetchannelData = async(id) => {
        setLoading(true);
              try{
            const docRef = doc(firestore,`users/${id}`);
            const docData = await getDoc(docRef);
            setuser(docData.data())
            const createdVideosDocRef = collection(firestore,`users/${id}/createdVideos`);
            const videosDocData = await getDocs(createdVideosDocRef);
            const results = videosDocData.docs.map(async(Doc)=>{
            const videosDocRef = doc(firestore,`videos/${Doc.data().videoUrl}`);
            const videosDocData = await getDoc(videosDocRef);
            return {video:videosDocData.data(),videoUrl:Doc.data().videoUrl}
            })
            const resolvedVideos = Promise.all(results);
          resolvedVideos.then((res)=>{
               setAllvideos(res);
            //    return res
             })
             return Allvideos
            }catch(error){
              console.log(error);
              setError(error.message)
            }
    }
    
  return(
   <HomeContext.Provider value={{Loading,Error,Allvideos,user,GetchannelData}}>
      {children}
      </HomeContext.Provider>
   )
}
export default HomePageStateProvider;