import { createContext, useState } from "react";
export const CurrentState = createContext();
 const StateProvider = ({ children }) => {
    const [videoShowMessages,setShowvideoMessages] = useState(false);
    const [shortvideoShowMessages,setshortvideoShowMessages] = useState(false)
   return<CurrentState.Provider value={{videoShowMessages,setShowvideoMessages,shortvideoShowMessages,setshortvideoShowMessages}}>{children}</CurrentState.Provider>
   
}
export default StateProvider;