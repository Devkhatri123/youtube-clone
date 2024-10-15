import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, Router, RouterProvider } from "react-router-dom";
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
import Home from "./Component/Home";
import HomepageShorts from "./Component/HomepageShorts";
import HomePageStateProvider from "./Context/HomePageContext";
import VideoActionProvider from "./Context/VideoContext";
import History from "./Component/History";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import UserPlayList from "./Component/UserPlayList";
const root = ReactDOM.createRoot(document.getElementById("root"));

let router = createBrowserRouter(
  [
  {
    path: "/youtube-clone",
    element: <>
    <StateProvider>
      <NavbarStateProvider>
      <VideoActionProvider>
    <MainPage />
    </VideoActionProvider>
    </NavbarStateProvider>
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
    path: "/watch?",
    element: (
      <>
      <StateProvider>
        <Navbar />
        <VideoActionProvider>
        <VideoPage/>
        </VideoActionProvider>
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
        <VideoActionProvider>
     <SearchResults/>
     </VideoActionProvider>
      </NavbarStateProvider>
   </>
    ),
  },
  {
    path: `/:id/:name/videos`,
    element: (
      <>
      <Navbar/>
      <HomePageStateProvider>
      <VideoActionProvider>
      <Home/>
      </VideoActionProvider>
      </HomePageStateProvider>
   </>
    ),
  },
  {
    path: `/:id/:name/Shorts`,
    element: (
      <>
      <Navbar/>
      <HomePageStateProvider>
      <HomepageShorts/>
      </HomePageStateProvider>
   </>
    ),
  },
  {
    path: `/playlist?`,
    element: (
      <>
      <Navbar/>
      <VideoActionProvider>
      <UserPlayList/>
      </VideoActionProvider>
    </>
    ),
  },
  {
    path: `/history/?`,
    element: (
      <>
      <VideoActionProvider>
      <History/>
      </VideoActionProvider>
    </>
    ),
  },
]);
root.render(
  <RouterProvider router={router} >
    <Router basename={process.env.PUBLIC_URL}></Router>
    </RouterProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();