import { createContext, useState } from "react";
import { onSnapshot,collection } from "firebase/firestore";
import { firestore } from "../firebase/firebase";
export const Navbarcontext = createContext();
 const NavbarStateProvider = ({ children }) => {
   const [showSidebar,setshowSidebar] = useState(false);
    const [searchTerm,setsearchTerm] = useState('');
    const [Error,setError] = useState(false);
    const [ErrorMessage,setErrorMessage] = useState('');
    const [searchedVideos,setsearchedVideos] = useState([]);
    const [savedVideos,setsaveVideos] = useState([])
    const [videos,setVideos] = useState([]);
    const GetData = (searchTerm) => {
      onSnapshot(collection(firestore,"videos"),(docs)=>{
        setVideos(
         docs.docs.map((doc)=>{
          return{
              data:doc.data(),
              id:doc.id,
          }
         })
        )
        });

      let splitedSearchTerm = searchTerm.toLowerCase().split(" ");
      setsearchedVideos(videos.filter((video)=>{
       const splitedTitle =  video.data?.Title?.toLowerCase().split(" ");
       const spiltedDesc = video.data?.description?.toLowerCase().split(" ");
       for(let i = 0; i < splitedTitle.length && i < spiltedDesc.length; i++){
       return splitedTitle[i].includes(splitedSearchTerm[i]) || spiltedDesc.includes(splitedSearchTerm[i]);
       }
      }));
      return searchedVideos
    }
    const FilteredVideos = (UnFilteredVideos,id) => {
     const FullLengthVideo = UnFilteredVideos?.filter((FullLengthVideo) => {
        console.log(FullLengthVideo)
        if (id) {
          return !FullLengthVideo.Videodata.shortVideo && id !== FullLengthVideo.id;
        } else {
          return !FullLengthVideo.Videodata.shortVideo;
        }
      })
    const shortVideo = UnFilteredVideos?.filter((shortVideo) => {
        return shortVideo.Videodata.shortVideo === true;
      })
      return {FullLengthVideo,shortVideo}
    }
   return(
   <Navbarcontext.Provider value={{searchedVideos,searchTerm,savedVideos,Error,showSidebar,ErrorMessage,setErrorMessage,setshowSidebar,setError,setsearchedVideos,GetData,setsaveVideos,setsearchTerm,FilteredVideos}}>
      {children}
      </Navbarcontext.Provider>
   )
}
export default NavbarStateProvider;