import React, { useState, useEffect, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";
import BottomLayout from "./BottomLayout";
import { auth } from "../firebase/firebase";
import { videoContext } from "../Context/VideoContext";
import ToastNotification from "./ToastNotification";
const Largescreencomponent = (props) => {
  const videocontext = useContext(videoContext);
  const [PresentUser, setPresentUser] = useState(null);
  const [clickedVideoIndex, setclickedVideoIndex] = useState(0);
  useEffect(() => {
    auth.onAuthStateChanged((currentUser) => {
      setPresentUser(currentUser);
    });
  }, []);
  const showModal = (e, index, L) => {
    videocontext.setbottomlayout(true);
    setclickedVideoIndex(index);
    videocontext.showmodal(e);
  };
  useEffect(() => {
    if (videocontext.bottomlayout) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "scroll";
  }, [videocontext.bottomlayout]);
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
                      <p className='videoLength'>{videocontext.returnvideoTime(FullLengthVideo.Videodata.videoLength)}</p>
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
                      {FullLengthVideo.UserData?.channelURL ? (
                        <img
                          src={FullLengthVideo.UserData?.channelURL}
                          alt={FullLengthVideo.UserData?.name}
                        />
                      ) : (
                        <img
                          src={FullLengthVideo.UserData?.channelURL}
                          alt={FullLengthVideo.UserData?.name}
                        />
                      )}
                    </Link>
                    <Link to={`/watch/${FullLengthVideo.id}`}>
                      <div className="video_title_and_channelName">
                        <h3 id="video_title" className="title">
                          {FullLengthVideo.Videodata?.Title}
                        </h3>
                        <div className="channelnameandviews">
                          <p id="channelName">
                            {FullLengthVideo.UserData?.name} •
                          </p>
                          <p id="video-views">
                            {FullLengthVideo.Videodata?.views} Views   •
                          </p>
                          <p>{videocontext.getVideoPublishedTime(FullLengthVideo)}</p>
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
                  />
                </div>
                {index === clickedVideoIndex && (
                  <>
                    {videocontext.bottomlayout && !videocontext.showToastNotification && (
                      <div id="Layout">
                        <BottomLayout
                          Left={videocontext.Left}
                          Top={videocontext.Top}
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
