import React, { useEffect, useState } from "react";
import "../CSS/Navbar.css";
import SmallScreenNavbar from "./SmallScreenNavbar";
import LargeScreenNavbar from "./LargeScreenNavbar";
import NavbarStateProvider from "../Context/NavbarContext";
function Navbar() {
  const [screenWidth,setscreenWidth] = useState();
  useEffect(()=>{
   setscreenWidth(window.innerWidth);
   window.onresize = () => {
    setscreenWidth(window.innerWidth)
   }
  },[screenWidth])
  return (
    <>
     <NavbarStateProvider>
    {screenWidth < 991 ?(
    <SmallScreenNavbar/>
    ):<LargeScreenNavbar/>}
    </NavbarStateProvider>
    </>
   );
}

export default Navbar;
