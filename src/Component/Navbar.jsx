import React, { useEffect, useState } from "react";
import "../CSS/Navbar.css";
import SmallScreenNavbar from "./SmallScreenNavbar";
import LargeScreenNavbar from "./LargeScreenNavbar";
import StateProvider from '../Context/HidevideoinfoCard';
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
      <StateProvider>
      <NavbarStateProvider>
    {screenWidth < 990 ?(
    <div className="small-screen-navbar"><SmallScreenNavbar/></div>
    ):<div className="large-screen-navbar"> <LargeScreenNavbar/></div>}
    </NavbarStateProvider>
    </StateProvider>
      </>
   );
}

export default Navbar;
