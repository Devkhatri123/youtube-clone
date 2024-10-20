import { createContext, useState } from "react";
import { ref,uploadBytesResumable,getDownloadURL } from "firebase/storage";
import { auth, storage } from "../firebase/firebase";
import { firestore } from "../firebase/firebase";
import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router";
import { v4 } from "uuid";
export const Uploadvideo = createContext();
 const UploadvideoProvider = ({ children }) => {
    const [Videoprogress,setvideouploadProgress] = useState(0);
    const [ThumbnailProgress,setThumbnailProgress] = useState(0);
    var newFile;
    const navigate = useNavigate();
   const uploadVideoFunc = async(thumbnailFile,videoFile,videoTitle,description,shortvideo,user,Comments,video) => {
    const videopRef = ref(storage, `Videos/${v4()}`);
    const ThumbNailRef = ref(storage, `Thumbnail/${v4()}`);
    var canvas = document.createElement('canvas');     
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);  
    newFile = await new Promise((resolve) => {
      canvas.toBlob((blob) => {
          if (blob) {
              const img = new Image();
              img.src = window.URL.createObjectURL(blob);
              Object.assign(blob, {
                  src: img.src,
                  name: videoFile.name.replace(".mp4", ".png"), // Name the extracted thumbnail based on video name
                  lastModified: Date.now(),
              });

              resolve(blob); // Resolve the blob as the new thumbnail file
          } else {
              console.error("Failed to create blob from canvas");
              resolve(null); // Resolve with null if there was an issue
          }
      });
      
  });
  console.log(newFile);


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
    const ThumbNailuploadTask =  uploadBytesResumable(ThumbNailRef,thumbnailFile ? thumbnailFile : newFile);
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
    console.log(thumbnailURL)
    let docRef = doc(firestore,"videos",videoId);
    const data = {
      Title:videoTitle,
      description:description,
      videoURL:videoURL,
      Thumbnail:thumbnailURL,
      likes:0,
      dislikes:0,
      views:0,
      shortVideo:shortvideo,
      comments:Comments,
      createdBy:auth.currentUser.uid,
      videoLength:video.duration,
      Time: Date.now(),
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
      const subscriber = await getDoc(userDocRef);
      if(subscriber.data().Numberofvideos){
      await updateDoc(userDocRef,{
          Numberofvideos:subscriber.data().Numberofvideos + 1,
         });
        }else{
          await updateDoc(userDocRef,{
            Numberofvideos:1,
           });
        }
      });
    }).catch((error)=>{
      console.log(error)
    })
    await addDoc(collection(firestore,`users/${auth.currentUser.uid}/createdVideos`),{
      videoUrl:videoId,
    }).then(()=>{
      navigate("/youtube-clone");
      console.log("video has been uploaded")
    })
   })
  }
   return<Uploadvideo.Provider value={{uploadVideoFunc,Videoprogress,ThumbnailProgress}}>{children}</Uploadvideo.Provider>
   
}
export default UploadvideoProvider;