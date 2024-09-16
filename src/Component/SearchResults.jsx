import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import "../CSS/SearchResults.css";
import { useSearchParams } from 'react-router-dom';
import { firestore } from '../firebase/firebase';
import { Navbarcontext } from '../Context/NavbarContext';
import Smallscreencomponent from './Smallscreencomponent';


function SearchResults() {
  const currentState = useContext(Navbarcontext)
  const [Videos,setVideos] = useState([]);
  const [FullVideos,setFullVideos] = useState([]);
  const [FullLengthVideo,setFullLengthVideos] = useState([]);
  const [shortVideos,setshortVideos] = useState([]);
  const [samplevideo,setsamplevideo] = useState([])
  const [queryParameters] = useSearchParams();
  const searchQuery = queryParameters.get("v");
  useEffect(()=>{
   const Data = JSON.parse(sessionStorage.getItem("inputData"));
   setVideos(Data.searchedVideos);
    console.log(Videos);
  },[searchQuery])
  useEffect(()=>{
    const getData = async() => {
      let newVideos = [];
      for (let i in Videos) {
        const docRef = doc(firestore, `users/${Videos[i].data.createdBy}`);
        const docData = await getDoc(docRef);
        newVideos.push({
          id:Videos[i].id,
          UserData: docData.data(),
          Videodata: Videos[i].data,
        });
      }
      setFullVideos(newVideos); 
    }
    getData()
  },[Videos]);
  useEffect(()=>{
  const result = currentState.FilteredVideos(FullVideos,null)
  setFullLengthVideos(result.FullLengthVideo);
  setshortVideos(result.shortVideo);
  },[FullVideos])
  return (
    <>
    <div className='SearchedVideos'>
    <Smallscreencomponent FullLengthVideos={FullLengthVideo} ShortVideos={shortVideos}/>
  </div>
    </>
  )
}

export default SearchResults;
