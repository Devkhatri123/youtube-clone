import React from "react";
import "../CSS/Navbar.css";
import SmallScreenNavbar from "./SmallScreenNavbar";
import LargeScreenNavbar from "./LargeScreenNavbar";
import StateProvider from '../Context/HidevideoinfoCard';
import NavbarStateProvider from "../Context/NavbarContext";
function Navbar() {
  return (
    <StateProvider>
   <NavbarStateProvider>
      <div className="small-screen-navbar"><SmallScreenNavbar/></div>
      <div className="large-screen-navbar"> <LargeScreenNavbar/></div>
      </NavbarStateProvider>
      </StateProvider>
  );
}

export default Navbar;
