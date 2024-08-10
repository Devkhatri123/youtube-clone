import { createContext, useState } from "react";
export const currentUser = createContext(null);

export const VideoProvider = ({ children }) => {
  let [Videos, setVideos] = useState([]);
   const GetNonFilteredVideos = () => {
   
   } 
  return (
    <currentUser.Provider >{children}</currentUser.Provider>
  );
};


