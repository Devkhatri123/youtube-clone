import React from "react";
import vide from "../Pics/6982055-hd_1920_1080_30fps.mp4";
import { Link } from "react-router-dom";
import "../CSS/Video.css";
import { BsThreeDotsVertical } from "react-icons/bs";
function Video({ video }) {
  console.log(video);
  //   const videoRef = useRef();
  //   const [isPlaying, setIsPlaying] = useState(false);
  //   const [isMute, setisMute] = useState(false);

  //   const handlePlay = () => {
  //     videoRef.current.play().catch((error) => {
  //       console.error("Error attempting to play video:", error);
  //     });
  //     setIsPlaying(true);
  //     console.log(videoRef.current.muted);
  //   };

  //   const handlePause = () => {
  //     videoRef.current.pause();
  //     setIsPlaying(false);
  //     console.log(videoRef.current.muted);
  //   };
  //  const HandleMute = (e) => {
  //   setisMute(!isMute);
  //  }

  return (
    <>
      <div id="video">
        <Link to={`/watch/${video.id}`}>
          <video
            src={video.Videodata.videoURL}
            poster={video.Videodata.Thumbnail}
          ></video>
          <div className="video_detail">
            <div id="video_detail">
              <div>
                <div style={{ display: "flex" }}>
                  <img
                    src={video.UserData.channelURL}
                    alt="channel pic"
                    className="channelPic"
                  />
                  <div>
                    <p className="text-white videoTitle">
                      {video.Videodata.Title}
                    </p>
                  </div>
                </div>
                <div className="channerlName">
                  <p className="text-white " id="channerlName">
                    {video.UserData.name}{" "}
                    <span> Views {video.Videodata.views}</span>{" "}
                    <span>{video.Time}</span>
                  </p>
                </div>
              </div>
              <BsThreeDotsVertical className="videomenu" />
            </div>
          </div>
        </Link>
      </div>
    </>
  );
}

export default Video;
