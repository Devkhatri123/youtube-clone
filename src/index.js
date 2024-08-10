import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Library from "./Component/Library";
import MainPage from "./Component/MainPage";
import Footer from "./Component/Footer";
import Navbar from "./Component/Navbar";
import {AuthProvider} from "./Context/ContextProvider";
import VideoPage from "./Component/VideoPage";
const root = ReactDOM.createRoot(document.getElementById("root"));
let router = createBrowserRouter([
  {
    path: "/",
    element: <><Navbar/><MainPage /><Footer/></>,
  },
  {
    path: "/Library",
    element: (
      <>
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
        <Navbar />
        <VideoPage/>
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
