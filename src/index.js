import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Library from "./Component/Library";
import Footer from "./Component/Footer";
import Navbar from "./Component/Navbar";
import  StateProvider  from "./Context/HidevideoinfoCard";
import VideoPage from "./Component/VideoPage";
import ShortVideos from "./Component/ShortVideos";
import LargeScreenSideBar from "./Component/LargeScreenSideBar";
import UploadvideoProvider from "./Context/UploadVideoContext";
import LargeScreenUploadVideo from "./Component/LargeScreenUploadVideo";
import MainPage from "./Component/MainPage";
import MiniSideBar from "./Component/MiniSideBar";
import SearchResults from "./Component/SearchResults";
import NavbarStateProvider from "./Context/NavbarContext";
const root = ReactDOM.createRoot(document.getElementById("root"));

let router = createBrowserRouter(
  [
  {
    path: "/",
    element: <>
    <StateProvider>
      
    <Navbar/>
    <MainPage />
    <Footer/>
    <MiniSideBar/>
    <LargeScreenSideBar/>
    </StateProvider>
    </>,
  },
  {
    path: "/Library",
    element: (
      <>
      {/* <App/> */}
        <Navbar />
        <Library />
        <Footer />
      </>
    ),
  },
  {
    path: "/watch/:id",
    element: (
      <>
      <StateProvider>
        <Navbar />
        <VideoPage/>
        <LargeScreenSideBar/>
        </StateProvider>
       </>
    ),
  },
  {
    path: "/short/:id",
    element: (
      <>
       <StateProvider>
        <ShortVideos/>
        </StateProvider>
       </>
    ),
  },
  {
    path: "/uploadVideo",
    element: (
      <>
    <UploadvideoProvider>
      <LargeScreenUploadVideo/>
      </UploadvideoProvider>
       </>
    ),
  },
  {
    path: `/results/?`,
    element: (
      <>
      <NavbarStateProvider>
        <Navbar/>
     <SearchResults/>
      </NavbarStateProvider>
   </>
    ),
  },
]);
root.render(
  <RouterProvider router={router}>
    <App />
    </RouterProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
