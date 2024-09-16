import { createContext, useState } from "react";
import { ref,uploadBytesResumable,getDownloadURL } from "firebase/storage";
import { auth, storage } from "../firebase/firebase";
import { firestore } from "../firebase/firebase";
import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router";
import { v4 } from "uuid";
import { queries } from "@testing-library/react";
export const Uploadvideo = createContext();
 const UploadvideoProvider = ({ children }) => {
    const [Videoprogress,setvideouploadProgress] = useState(0);
    const [ThumbnailProgress,setThumbnailProgress] = useState(0);
    
    const navigate = useNavigate();
   const uploadVideoFunc = async(thumbnailFile,videoFile,videoTitle,description,shortivideo,user) => {
    const videopRef = ref(storage, `Videos/${v4()}`);
    const ThumbNailRef = ref(storage, `Thumbnail/${v4()}`);

    const uploadVideoTask =  uploadBytesResumable(videopRef, videoFile);
    uploadVideoTask.on(
      "state_changed",
      (snapshot) => {
        let Videoprogress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setvideouploadProgress(Videoprogress);
      },
      (error) => {
        console.log(error);
      },
    );
    const ThumbNailuploadTask =  uploadBytesResumable(ThumbNailRef, thumbnailFile);
    ThumbNailuploadTask.on("state_changed",(snapShot)=>{
    const Thumbnailprogress = Math.round((snapShot.bytesTransferred / snapShot.totalBytes) * 100);
    setThumbnailProgress(Thumbnailprogress);
    },(error)=>{
         console.log(error);
    },
    
  )
  await Promise.all([uploadVideoTask,ThumbNailuploadTask]).then(async()=>{
    const videoId = v4();
    const videoURL = await getDownloadURL(uploadVideoTask.snapshot.ref);
    const thumbnailURL = await getDownloadURL(ThumbNailuploadTask.snapshot.ref);
    let docRef = doc(firestore,"videos",videoId);
    const data = {
      Title:videoTitle,
      description:description,
      videoURL:videoURL,
      Thumbnail:thumbnailURL,
      likes:0,
      dislikes:0,
      views:0,
      shortVideo:false,
      createdBy:auth.currentUser.uid,
    }
    await setDoc(docRef,data).then(async()=>{
      const AddVideoToSubscribers = query(collection(firestore,`users/${auth.currentUser.uid}/subscribers`));
      const querySnapshot = await getDocs(AddVideoToSubscribers);
      querySnapshot.forEach(async(Doc)=>{
        const subscriberDocRef = doc(collection(firestore,`users/${Doc.data().userId}/NewVideos`),videoId);
        await setDoc(subscriberDocRef,{
        Videoid:videoId,
      });
      console.log("new video added in subscriber doc");
      const userDocRef = doc(firestore,`users/${Doc.data().userId}`);
      await updateDoc(userDocRef,{
          Numberofvideos:user.Numberofvideos + 1,
         });
      });
    }).catch((error)=>{
      console.log(error)
    })
    await addDoc(collection(firestore,`users/${auth.currentUser.uid}/createdVideos`),{
      videoUrl:videoId,
    }).then(()=>{
      navigate("/");
    })
   })
  }
   return<Uploadvideo.Provider value={{uploadVideoFunc,Videoprogress,ThumbnailProgress}}>{children}</Uploadvideo.Provider>
   
}
export default UploadvideoProvider;