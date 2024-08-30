/* eslint-disable array-callback-return */
import React,{useContext, useEffect, useState} from "react";
import VideoDetail from "./VideoDetail";
import VideoInfoCard from "./VideoInfoCard";
import DescriptionPage from "./DescriptionPage";
import { auth, firestore } from "../firebase/firebase";
import { collection,doc,getDoc,setDoc } from "firebase/firestore";
import {CurrentState} from "../Context/HidevideoinfoCard"
import { useParams } from "react-router";
import "../CSS/VideoPage.css";
import VideoPlayer from "./VideoPlayer";
function VideoPage() {
  const currentState = useContext(CurrentState);
  const params = useParams();
  
  return (
    <>
    <VideoPlayer/>
    {!currentState.showDescription ? (
    <VideoInfoCard/>
    ):<DescriptionPage/>}
       </>

   )
}

export default VideoPage;
