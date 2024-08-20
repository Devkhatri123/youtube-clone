import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import "../CSS/Navbar.css";
import { CiSearch } from "react-icons/ci";
import { onSnapshot,doc, collection } from "firebase/firestore";
import { GoArrowUpLeft } from "react-icons/go";
import { firestore } from "../firebase/firebase";
function SearchBar() {
  let [HideSearchBar, setHideSearchBar] = useState(true);
  const [search,Setsearch] = useState('');
  const [videoAray,setvideoArray] = useState([]);
  const [FilteredVideoArray,setFilteredVideoArray] = useState([])
  const HideMobileSearchBar = () => {
    setHideSearchBar(false);
  };
  const HandleSearch = (e) => {
    Setsearch(e.target.value);
  // eslint-disable-next-line array-callback-return
  setFilteredVideoArray(videoAray.filter((array)=>{
      for(let i = 0; i < array.data.Title.length && i < array.data.description.length; i++){
      return array.data.Title.includes(search[i]) || array.data.description.includes(search[i]);
      }
     })
    )
  }
  useEffect(()=>{
    onSnapshot(collection(firestore,"videos"),(docs)=>{
      setvideoArray(
       docs.docs.map((doc)=>{
        return{
            data:doc.data(),
            id:doc.id,
        }
       })
      )
      })
  },[])
  const ShowSearch = (e) => {
    if(e.code === "Enter"){
      Setsearch(e.target.value);
      setFilteredVideoArray(videoAray.filter((array)=>{
        for(let i = 0; i < array.data.Title.length && i < array.data.description.length; i++){
       return array.data.Title.includes(search[i]) || array.data.description.includes(search[i]);
        }
       })
      )

       //setvideoArray(FilteredDoc);
        console.log(videoAray);
    }
  }
  return (
    <>
      {HideSearchBar === true ? (
        <div className="search_container">
          <IoIosArrowRoundBack onClick={HideMobileSearchBar} />
          <input type="text" name="search" id="search_input" placeholder="Search Youtube" onChange={HandleSearch} onKeyDown={ShowSearch}/>
          <CiSearch className="right_search_icon"/>
          <div className="search_Results">
            {FilteredVideoArray.map((FilteredVideo,index)=>{
              console.log(FilteredVideo)
              return <div className="search_result" key={index}>
                <Link to={`/watch/${FilteredVideo.id}`} onClick={()=>setHideSearchBar(false)}>
                <p>{FilteredVideo.data.Title}</p>
                <GoArrowUpLeft/>
                </Link>
               </div>
            })
            }
          </div>
        </div>
      ) : <Navbar/>}
    </>
  );
}

export default SearchBar;
