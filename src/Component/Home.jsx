import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { auth, firestore } from "../firebase/firebase";
import { BsThreeDotsVertical } from "react-icons/bs";
import "../CSS/HomePage.css";
import { HomeContext } from "../Context/HomePageContext";
import HomeHeader from "./HomeHeader";
import BottomLayout from "./BottomLayout";
function Home() {
  const homeContext = useContext(HomeContext);
  const params = useParams();
  const [AllVideos, setAllvideos] = useState([]);
  const [user, setuser] = useState();
  const [LoggedInUser, SetLoggedInUser] = useState(null);
  const [isSubscribed, setisSubscribed] = useState(false);
  const [Error, setError] = useState("");
  const [btnLoading, setbtnLoading] = useState(true);
  const [PageLoading, setPageLoading] = useState(false);
  const [clickedVideoIndex, setclickedVideoIndex] = useState(0);
  const [Left, setLeft] = useState(null);
  const [Top, setTop] = useState(null);
  const [showLayout, SetshowLayout] = useState(false);
  const createdVideos = [];
  useEffect(() => {
    auth.onAuthStateChanged((currentuser) => {
      SetLoggedInUser(currentuser);
    });
  }, []);
  useEffect(() => {
    const GetData = async () => {
      const result = await homeContext.GetchannelData(params.id);
      setAllvideos(result);
    };
    GetData();
  }, [params.id, homeContext]);

  useEffect(() => {
    const GetSubscribedDoc = async () => {
      setbtnLoading(true);
      try {
        if (LoggedInUser) {
          const subscribedDocRef = doc(
            collection(
              firestore,
              `users/${LoggedInUser.uid}/subscribedChannel`
            ),
            params.id
          );
          const subscribedDocData = await getDoc(subscribedDocRef);
          if (subscribedDocData.exists()) {
            setisSubscribed(true);
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setbtnLoading(false);
      }
    };
    GetSubscribedDoc();
  }, [LoggedInUser, params.id]);

  useEffect(() => {
    setuser(homeContext.user);
  }, [homeContext.user]);
  const showModal = (e, index) => {
    SetshowLayout(!showLayout);
    setclickedVideoIndex(index);
    if (window.innerWidth <= 600) {
      document.body.style.opacity = "0.7";
      setLeft(null);
      setTop(null);
    } else {
      setLeft(e.pageX - 246);
      setTop(e.clientY);
    }
    document.body.style.overflow = "hidden";
  };
  useEffect(() => {
    if (showLayout) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "scroll";
  }, [showLayout]);
  const dots = document.getElementById("dots");
  if (dots) {
    window.addEventListener("resize", () => {
      if (window.innerWidth > 600) {
        setLeft(dots.getBoundingClientRect().left - 246);
        setTop(dots.getBoundingClientRect().y + 9);
      } else {
        setLeft(null);
        setTop(null);
      }
    });
  }
  return !PageLoading ? (
    !Error ? (
      <div className="userhomepage">
        <HomeHeader />
        <div id="tabsContainer">
          <div id="videos">
            <Link to={"#"}>Videos</Link>
          </div>
          <div id="Shortvideos">
            <Link to={`/${params.id}/${user?.name.replace(" ", "")}}/Shorts`}>
              Shorts
            </Link>
          </div>
          <div id="Playlists">
            <Link to={"#"}>Playlists</Link>
          </div>
        </div>
        <div id="homepage-body">
          {AllVideos &&
            AllVideos.filter((video) => {
              return !video.video.shortVideo;
            }).map((video, index) => {
              return (
                <div id="video" key={index}>
                  <Link to={`/watch/${video?.videoUrl}`}>
                    <div id="thumbnail_container">
                      <img
                        src={video?.video.Thumbnail}
                        alt=""
                        className="video"
                      />
                    </div>
                  </Link>
                  <div className="video_bottom">
                    <div className="video_bttom_left">
                      <div className="video_title_and_channelName">
                        <h3 id="video_title" className="title">
                          {video?.video.Title}
                        </h3>
                        <div>
                          <p>
                            {user?.name} • {video?.video.views} Views
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      onClick={(e) => {
                        showModal(e, index);
                      }}
                    >
                      <BsThreeDotsVertical
                        className="videomenu"
                        id={clickedVideoIndex === index ? "dots" : null}
                      />
                    </div>
                    {showLayout && index === clickedVideoIndex && (
                      <>
                        <BottomLayout
                          Left={Left}
                          Top={Top}
                          video={video.video}
                          user={LoggedInUser}
                        />
                      </>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    ) : (
      <p
        style={{
          color: "white",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {Error}
      </p>
    )
  ) : (
    <p>Loading...</p>
  );
}

export default Home;
