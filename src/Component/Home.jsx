import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { auth, firestore } from "../firebase/firebase";
import { BsThreeDotsVertical } from "react-icons/bs";
import "../CSS/HomePage.css";
import { HomeContext } from "../Context/HomePageContext";
import HomeHeader from "./HomeHeader";
import BottomLayout from "./BottomLayout";
import { videoContext } from "../Context/VideoContext";
function Home() {
  const videocontext = useContext(videoContext)
  const homeContext = useContext(HomeContext);
  const params = useParams();
  const [AllVideos, setAllvideos] = useState([]);
  const [user, setuser] = useState();
  const [LoggedInUser, SetLoggedInUser] = useState(null);
  const [PageLoading, setPageLoading] = useState(false);
  const [clickedVideoIndex, setclickedVideoIndex] = useState(0);
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
  }, [params.id]);
  useEffect(() => {
    console.log(AllVideos);
  }, [AllVideos]);
  useEffect(() => {
    setuser(homeContext.user);
  }, [homeContext.user]);

  const showModal = (e, index) => {
    videocontext.setbottomlayout(!videocontext.bottomlayout); 
    setclickedVideoIndex(index);
    videocontext.showmodal(e);
    document.body.style.overflow = "hidden";
  };
  useEffect(() => {
    if (videocontext.bottomlayout) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "scroll";
  }, [videocontext.bottomlayout]);
  return !PageLoading ? (
    !homeContext.Error ? (
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
        </div>
        <div id="homepage-body">
          {AllVideos &&
            AllVideos.map((video, index) => {
              return (
                <div id="video" key={index}>
                  <Link to={`/watch?v=${video?.videoURL}`}>
                    <div id="thumbnail_container">
                      <img
                        src={video?.Videodata?.Thumbnail}
                        alt=""
                        className="video"
                      />
                    <p className="videoLength">{videocontext.returnvideoTime(video?.Videodata?.videoLength)}</p>
                    </div>
                  </Link>
                  <div className="video_bottom">
                    <div className="video_bttom_left">
                      <div className="video_title_and_channelName">
                        <h3 id="video_title" className="title">
                          {video?.Videodata?.Title}
                        </h3>
                        <div>
                        <p>
                            {user?.name} • {video?.Videodata?.views} Views • {videocontext.getVideoPublishedTime(video)}
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
                        style={{fontSize:"20px"}}
                      />
                    </div>
                    {videocontext.bottomlayout && index === clickedVideoIndex && (
                      <>
                        <BottomLayout
                          Left={videocontext.Left}
                          Top={videocontext.Top}
                          video={video?.Videodata}
                          videoOwner={user}
                          videoURL={video.videoURL}
                          user={LoggedInUser}
                          searchQuery={"CV"}
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
        {homeContext.Error}
      </p>
    )
  ) : (
    <p>Loading...</p>
  );
}

export default Home;
