import { React, useEffect, useState } from "react";
import Video from "./Video";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { auth, firestore } from "../firebase/firebase";
function Videos() {
  let [videos, setVideos] = useState([]);
  
  // const randomcolor = () => {
  //   let hexNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F"];
  //   let hexColor = "#";
  //   for (let i = 0; i < 6; i++) {
  //     hexColor += hexNumbers[Math.floor(Math.random() * hexNumbers.length)];
  //     setcolor(hexColor);
  //   }
  //   console.log(color);
  // };
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
    });
  }, []);
  return (
    <div className="Videos">
      {videos.map((video, i) => {
        return <Video video={video} key={i}/>;
      })}
    </div>
  );
}

export default Videos;
