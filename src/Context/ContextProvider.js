import { createContext, useState } from "react";
export const currentUser = createContext(null);

export const AuthProvider = ({ children }) => {
  let [user, setuser] = useState(null);
  
 
  return (
    <currentUser.Provider value={user}>{children}</currentUser.Provider>
  );
};


