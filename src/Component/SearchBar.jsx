import React, { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import Navbar from "./Navbar";
import "../CSS/Navbar.css";
import { CiSearch } from "react-icons/ci";
function SearchBar() {
  let [HideSearchBar, setHideSearchBar] = useState(true);
  const HideMobileSearchBar = () => {
    setHideSearchBar(false);
  };
  
  return (
    <>
      {HideSearchBar === true ? (
        <div className="search_container">
          <IoIosArrowRoundBack onClick={HideMobileSearchBar} />
          <input type="text" name="search" id="search_input" placeholder="Search Youtube"/>
          <CiSearch className="right_search_icon"/>
        </div>
      ) : <Navbar/>}
    </>
  );
}

export default SearchBar;
