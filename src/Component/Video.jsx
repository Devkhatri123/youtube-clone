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
           </Link>
           <div className="video_bottom">
                        <div className="video_bttom_left">
                          <img
                            src={video.UserData.channelPic}
                            alt={video.UserData.name}
                          />
                          <div className="video_title_and_channelName">
                            <h3 id="video_title" className="title">
                              {video.Videodata.Title}
                            </h3>
                            <div>
                              <p>
                                {video.UserData.name} 
                                {" "} {video.Videodata.views} Views
                              </p>
                            </div>
                          </div>
                        </div>
              <BsThreeDotsVertical className="videomenu" />
          </div>
         
      </div>
    </>
  );
}

export default Video;
