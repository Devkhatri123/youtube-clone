import React, { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import Navbar from "./Navbar";
import "../CSS/Navbar.css";
import { CiSearch } from "react-icons/ci";
import { onSnapshot,doc } from "firebase/firestore";
import { firestore } from "../firebase/firebase";
function SearchBar() {
  let [HideSearchBar, setHideSearchBar] = useState(true);
  const [search,Setsearch] = useState('');
  const HideMobileSearchBar = () => {
    setHideSearchBar(false);
  };
  const HandleSearch = (e) => {
    Setsearch(e.target.value);
    console.log(search);
  }
  return (
    <>
      {HideSearchBar === true ? (
        <div className="search_container">
          <IoIosArrowRoundBack onClick={HideMobileSearchBar} />
          <input type="text" name="search" id="search_input" placeholder="Search Youtube" onChange={HandleSearch}/>
          <CiSearch className="right_search_icon"/>
        </div>
      ) : <Navbar/>}
    </>
  );
}

export default SearchBar;
