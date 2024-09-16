import { createContext, useState } from "react";
export const CurrentState = createContext();
 const StateProvider = ({ children }) => {
    const [Description,setDescription] = useState(false);
    const [shortvideoShowMessages,setshortvideoShowMessages] = useState(false);
    const [LargeSideBar,setLargeSideBar] = useState(false);
   return(
   <CurrentState.Provider value={{Description,setDescription,shortvideoShowMessages,setshortvideoShowMessages,LargeSideBar,setLargeSideBar}}>
      {children}
      </CurrentState.Provider>
   )
}
export default StateProvider;