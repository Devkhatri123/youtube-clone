import React, { useState, useEffect, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaRegUserCircle } from "react-icons/fa";
import BottomLayout from "./BottomLayout";
import "../CSS/Video.css";
import { auth } from "../firebase/firebase";
import { videoContext } from "../Context/VideoContext";
import ToastNotification from "./ToastNotification";
function Largescreencomponent(props) {
  const videocontext = useContext(videoContext);
  const LinkRef = useRef();
  const layoutRef = useRef();
  const [PresentUser, setPresentUser] = useState(null);
  const [clickedVideoIndex, setclickedVideoIndex] = useState(0);
  const [Left, setLeft] = useState(0);
  const [Top, setTop] = useState(0);
  useEffect(() => {
    auth.onAuthStateChanged((currentUser) => {
      setPresentUser(currentUser);
    });
    console.log(props.FullLengthVideos)
  }, []);
  const showModal = (e, index, L) => {
    // SetshowLayout(!showLayout);
    videocontext.setbottomlayout(true)
    setclickedVideoIndex(index);
    setLeft(e.pageX - 246);
    setTop(e.clientY);
  };
  useEffect(() => {
    if (videocontext.bottomlayout) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "scroll";
  }, [videocontext.bottomlayout]);
  const dots = document.getElementById("dots");
  if (dots) {
    window.addEventListener("resize", () => {
      setLeft(dots.getBoundingClientRect().left - 246);
      setTop(dots.getBoundingClientRect().y + 9);
    });
  }
  return (
    <div className="large-screen-main-videoPage">
      <div className="videos">
        {props.FullLengthVideos &&
          props.FullLengthVideos.map((FullLengthVideo, index) => {
            return (
              <div id="video" key={index}>
                <Link to={`/watch?v=${FullLengthVideo.id}`}>
                  <div id="thumbnail_container">
                    <img
                      src={FullLengthVideo.Videodata.Thumbnail}
                      alt=""
                      className="video"
                    />
                  </div>
                </Link>
                <div className="video_bottom">
                  <div className="video_bttom_left">
                    <Link
                      to={`/${
                        FullLengthVideo.Videodata.createdBy
                      }/${FullLengthVideo.UserData?.name.replace(
                        " ",
                        ""
                      )}/videos`}
                      style={{ maxWidth: "max-content", width: "71px" }}
                    >
                      {FullLengthVideo.UserData?.channelPic ? (
                        <img
                          src={FullLengthVideo.UserData?.channelPic}
                          alt={FullLengthVideo.UserData?.name}
                        />
                      ) : (
                        <FaRegUserCircle />
                      )}
                    </Link>
                    <Link to={`/watch/${FullLengthVideo.id}`}>
                      <div className="video_title_and_channelName">
                        <h3 id="video_title" className="title">
                          {FullLengthVideo.Videodata?.Title}
                        </h3>
                        <div className="channelnameandviews">
                          <p id="channelName">
                            {FullLengthVideo.UserData?.name}
                          </p>
                          <p id="video-views">
                            {FullLengthVideo.Videodata?.views} Views
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <BsThreeDotsVertical
                    className="videomenu"
                    id={clickedVideoIndex === index ? "dots" : null}
                    onClick={(e) => {
                      showModal(e, index);
                    }}
                    ref={clickedVideoIndex === index ? LinkRef : null}
                  />
                </div>
                {index === clickedVideoIndex && (
                  <>
                    {videocontext.bottomlayout && !videocontext.showToastNotification && (
                      <div ref={layoutRef} id="Layout">
                        <BottomLayout
                          Left={Left}
                          Top={Top}
                          videoURL={FullLengthVideo.id}
                          video={FullLengthVideo.Videodata}
                          user={PresentUser}
                        />
                      </div>
                    )}
                    {videocontext.showToastNotification && (
                        <ToastNotification />
                    )}
                  </>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
export default Largescreencomponent;
