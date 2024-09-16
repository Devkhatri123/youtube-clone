import React, { useContext, useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { createSearchParams, Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "../CSS/Navbar.css";
import { CiSearch } from "react-icons/ci";
import { GoArrowUpLeft } from "react-icons/go";
import { Navbarcontext } from "../Context/NavbarContext";
import { doc } from "firebase/firestore";
function SearchBar() {
  const navigate = useNavigate();
  const currentState = useContext(Navbarcontext)
  let [HideSearchBar, setHideSearchBar] = useState(true);
  const [search,Setsearch] = useState('');
  const [videoArray,setvideoArray] = useState([]);
  const HideMobileSearchBar = () => {
    setHideSearchBar(false);
    document.body.style.overflow='visible';
  };
  useEffect(()=>{
    console.log("Navbar is mounted");
    const fetchedData = JSON.parse(sessionStorage.getItem('inputData'))
    if(fetchedData){
      Setsearch(fetchedData?.searchTerm)
    }
    },[])
  const HandleSearch = (e) => {
    Setsearch(e.target.value);
  //  setinputData('')
  const data =  currentState.GetData(search);
  sessionStorage.setItem("inputData",JSON.stringify({searchTerm:e.target.value,searchedVideos:data}));
  setvideoArray(data);
  }

  const ShowSearch = (e) => {
    console.log(e);
    if(e.code === "Enter" || e.keyCode === 13){
      e.preventDefault();
        currentState.setsearchTerm(search)
        const data= currentState.GetData(search)
        sessionStorage.setItem("inputData",JSON.stringify({searchTerm:search,searchedVideos:data}));
        navigate({
          pathname: "/results",
          search: createSearchParams({
              v: search,
          },{replace:true}).toString()
      });
      setHideSearchBar(false)
      setvideoArray([]);
      document.body.style.overflow = "scroll";
 }
  }
  return (
    <>
      {HideSearchBar === true ? (
        <div className="search_container">
          <IoIosArrowRoundBack onClick={HideMobileSearchBar} />
          <input type="text" name="search" id="search_input" value={search} placeholder="Search Youtube" onChange={HandleSearch} onKeyDown={ShowSearch}/>
          <CiSearch className="right_search_icon"/>
          {videoArray && (
          <div className="search_Results">
            {videoArray && videoArray.map((FilteredVideo,index)=>{
              console.log(FilteredVideo)
              return <div className="search_result" key={index}>
                <Link to={`/watch/${FilteredVideo.id}`} onClick={()=>{setHideSearchBar(false);document.body.style.overflowY="scroll"}}>
                <p>{FilteredVideo.data.Title}</p>
                <GoArrowUpLeft/>
                </Link>
               </div>
            })
            }
          </div>
          )}
        </div>
      ) : <Navbar/>}
    </>
  );
}

export default SearchBar;
