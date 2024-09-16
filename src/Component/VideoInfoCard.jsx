import React, { useState, useEffect, useContext } from "react";
import VideoPlayer from "./VideoPlayer";
import { useParams } from "react-router";
import { firestore, auth } from "../firebase/firebase";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import "../CSS/VideoPage.css";
import { CurrentState } from "../Context/HidevideoinfoCard";
import SmallScreenVideoInfoCard from "./SmallScreenVideoInfoCard";
import LargeScreenVideoInfoCard from "./LargeScreenVideoInfoCard";
import LargeScreenVideoPlayer from "./LargeScreenVideoPlayer";
import MediumScreenComponent from "./MediumScreenComponent";
import Smallscreencomponent from "./Smallscreencomponent";
function VideoInfoCard() {
  const params = useParams();
  const currentState = useContext(CurrentState);
  let [Video, Setvideo] = useState();
  let [NextVideos, setNextVideos] = useState([]);
  let [user, setUser] = useState();
  const [videos, setvideos] = useState([]);
  let [Loading, setLoading] = useState(true);
  const [Error, SetError] = useState(false);
  const [ErrorMessage, SetErrorMessage] = useState("");
  const [CurrentUser, setCurrentUser] = useState(null);
  const [windowWidth, setwindowWidth] = useState(window.innerWidth);
  const [FullLengthVideos, setFullLengthVideos] = useState([]);
  const [ShortVideos, SetShortVideos] = useState([]);
  const [CalculatedscreenWidth, setCalculatedscreenWidth] = useState();
  const [TotalScreenWidth, setTotalScreenWidth] = useState(0);
  const [nextVideosPortionWidth, setnextVideosPortionWidth] = useState();
  useEffect(() => {
    setwindowWidth(window.innerWidth);
    const updateVideoSize = () => {
      setwindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", updateVideoSize);
    return () => {
      window.removeEventListener("resize", updateVideoSize);
    };
  }, [windowWidth]);
  // Fetching current Video on which user clicked on
  useState(() => {
    auth.onAuthStateChanged((currentUser) => {
      setCurrentUser(currentUser);
    });
  }, []);
  const FetchVideo = async () => {
    setLoading(true);
    try {
      const VideoRef = doc(firestore, "videos", params.id);
      // const video = await getDoc(videoRef);
      onSnapshot(VideoRef, async (videDoc) => {
        if (videDoc.exists()) {
          Setvideo(videDoc.data());
          const userRef = doc(firestore, "users", videDoc.data().createdBy);
          //const User = await getDoc(userRef);
          onSnapshot(userRef, (userDoc) => {
            if (userDoc.exists()) {
              setUser(userDoc.data());
            }
          });
        }
      });
    } catch (error) {
      console.log(error);
      SetError(true);
      SetErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    FetchVideo();
  }, [params.id]);
  useEffect(() => {
    // Fetching next Videos to play
    onSnapshot(collection(firestore, "videos"), (snapShot) => {
      const FetchedVideos = Promise.all(
        snapShot.docs.map(async (Doc) => {
          const userRef = doc(firestore, "users", Doc.data().createdBy);
          const userDoc = await getDoc(userRef);
          return {
            id: Doc.id,
            Videodata: Doc.data(),
            UserData: userDoc.data(),
          };
        })
      );
      FetchedVideos.then((FetchedVideos) => {
        setNextVideos(FetchedVideos);
      });
    });
  }, [params.id]);
  useEffect(() => {
    onSnapshot(collection(firestore, "videos"), async (snapshot) => {
      const FetchedData = await Promise.all(
        snapshot.docs.map(async (Doc) => {
          const userRef = doc(firestore, "users", Doc.data().createdBy);
          const docSnap = await getDoc(userRef);
          return {
            id: Doc.id,
            Videodata: Doc.data(),
            UserData: docSnap.data(),
          };
        })
      );
      setvideos(FetchedData);
    });
  }, [params.id]);
  useEffect(() => {
    setFullLengthVideos(
      videos?.filter((FullLengthVideo) => {
        if (params.id) {
          return (
            !FullLengthVideo.Videodata.shortVideo &&
            params.id !== FullLengthVideo.id
          );
        } else {
          return !FullLengthVideo.Videodata.shortVideo;
        }
      })
    );
    SetShortVideos(
      videos?.filter((shortVideo) => {
        return shortVideo.Videodata.shortVideo === true;
      })
    );
  }, [videos, params.id]);

  useEffect(() => {
    if (window.innerWidth >= 990 && window.innerWidth <= 1115) {
      setCalculatedscreenWidth(640);
      setnextVideosPortionWidth(window.innerWidth - 664);
      setTotalScreenWidth(0);
    } else if (window.innerWidth >= 990 && window.innerWidth < 1745) {
      setCalculatedscreenWidth(window.innerWidth - 474);
      setnextVideosPortionWidth(403);
      setTotalScreenWidth(0);
    } else if (window.innerWidth >= 1745 && window.innerWidth < 2000) {
      setCalculatedscreenWidth(1225);
      setnextVideosPortionWidth(window.innerWidth - 1304);
    } else if (window.innerWidth >= 2000) {
      setCalculatedscreenWidth(1225);
      setnextVideosPortionWidth(window.innerWidth - 1558);
    }
    const updateVideoSize = () => {
      if (window.innerWidth >= 990 && window.innerWidth <= 1115) {
        setCalculatedscreenWidth(640);
        setTotalScreenWidth(0);
        setnextVideosPortionWidth(window.innerWidth - 664);
      } else if (window.innerWidth >= 1115 && window.innerWidth < 1745) {
        setCalculatedscreenWidth(window.innerWidth - 474);
        setnextVideosPortionWidth(403);
        setTotalScreenWidth(0);
      } else if (window.innerWidth >= 1745 && window.innerWidth < 2000) {
        setCalculatedscreenWidth(1225);
        setnextVideosPortionWidth(window.innerWidth - 1304);
      } else if (window.innerWidth >= 2000) {
        setCalculatedscreenWidth(1225);
        setnextVideosPortionWidth(window.innerWidth - 1558);
      }
    };
    window.addEventListener("resize", updateVideoSize);
    return () => {
      window.removeEventListener("resize", updateVideoSize);
    };
  }, [CalculatedscreenWidth, TotalScreenWidth, nextVideosPortionWidth]);

  return !Loading ? (
    !Error ? (
      <div className="fullVideoPage" style={FullLengthVideos.length > 0?{ width: CalculatedscreenWidth }:null}>
          <div className="videoPlayer">
            <VideoPlayer />
          </div>
          {windowWidth < 990 ? (
            <>
              <SmallScreenVideoInfoCard
                Video={Video}
                user={user}
                videoId={params.id}
                CurrentUser={CurrentUser}
                currentState={currentState}
                NextVideos={NextVideos}
              />
            </>
          ) : (
            <>
              <div className="large-screen-fullVideoPage">
                <LargeScreenVideoInfoCard
                  Video={Video}
                  user={user}
                  videoId={params.id}
                  CurrentUser={CurrentUser}
                  currentState={currentState}
                />
                 {!Loading ? (
                    FullLengthVideos.length > 0 && (
                      <div
                        className="Next_videos"
                        style={{ width: nextVideosPortionWidth }}
                      >
                        <MediumScreenComponent
                          FullLengthVideos={FullLengthVideos}
                          shortVideos={ShortVideos}
                        />
                      </div>
                    )
                  ) : (
                    <p>Next Videos Loading...</p>
                  )}
               
              </div>
            </>
          )}
        </div>
    ) : (
      <p
        style={{
          height: "50vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
        }}
      >
        My Loading...
      </p>
    )
  ) : (
    <p>{ErrorMessage}</p>
  );
}

export default VideoInfoCard;
