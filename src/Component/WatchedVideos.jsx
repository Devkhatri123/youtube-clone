import React from "react";
import WatchedVideo from "./WatchedVideo";
import "../CSS/Library.css"
function WatchedVideos() {
  let WatchedVideos = [
    {
      videoThumbnail:
        "https://tse3.mm.bing.net/th?id=OIP.iumiZjjCClu47Tl1kNYlSQHaEK&pid=Api&P=0",
      videoTitle: "All about Blockchain | Simply Explained",
      ChannelName: "Apna College",
      Views: 1,
      Time: 3,
    },
    {
      videoThumbnail:
        "https://tse4.mm.bing.net/th?id=OIP._kuR2f4W01784yF9cTVsEAHaEK&pid=Api&P=0",
      videoTitle:
        "Web Development Roadmap 2023 🔥 | Step By Step Guide| HTML,CSS, JavaScript | CSE/Non-CSE Branches",
      ChannelName: "College Wallah",
      Views: 101,
      Time: 11,
    },
    {
      videoThumbnail:
        "https://tse3.mm.bing.net/th?id=OIP.iumiZjjCClu47Tl1kNYlSQHaEK&pid=Api&P=0",
      videoTitle: "All about Blockchain | Simply Explained",
      ChannelName: "Apna College",
      Views: 1,
      Time: 3,
    },
    {
      videoThumbnail:
        "https://tse4.mm.bing.net/th?id=OIP._kuR2f4W01784yF9cTVsEAHaEK&pid=Api&P=0",
      videoTitle:
        "Web Development Roadmap 2023 🔥 | Step By Step Guide| HTML,CSS, JavaScript | CSE/Non-CSE Branches",
      ChannelName: "College Wallah",
      Views: 101,
      Time: 11,
    },
    {
      videoThumbnail:
        "https://tse3.mm.bing.net/th?id=OIP.iumiZjjCClu47Tl1kNYlSQHaEK&pid=Api&P=0",
      videoTitle: "All about Blockchain | Simply Explained",
      ChannelName: "Apna College",
      Views: 1,
      Time: 3,
    },
    {
      videoThumbnail:
        "https://tse4.mm.bing.net/th?id=OIP._kuR2f4W01784yF9cTVsEAHaEK&pid=Api&P=0",
      videoTitle:
        "Web Development Roadmap 2023 🔥 | Step By Step Guide| HTML,CSS, JavaScript | CSE/Non-CSE Branches",
      ChannelName: "College Wallah",
      Views: 101,
      Time: 11,
    },
    {
      videoThumbnail:
        "https://tse3.mm.bing.net/th?id=OIP.iumiZjjCClu47Tl1kNYlSQHaEK&pid=Api&P=0",
      videoTitle: "All about Blockchain | Simply Explained",
      ChannelName: "Apna College",
      Views: 1,
      Time: 3,
    },
    {
      videoThumbnail:
        "https://tse4.mm.bing.net/th?id=OIP._kuR2f4W01784yF9cTVsEAHaEK&pid=Api&P=0",
      videoTitle:
        "Web Development Roadmap 2023 🔥 | Step By Step Guide| HTML,CSS, JavaScript | CSE/Non-CSE Branches",
      ChannelName: "College Wallah",
      Views: 101,
      Time: 11,
    },
    {
        videoThumbnail:
          "https://tse3.mm.bing.net/th?id=OIP.iumiZjjCClu47Tl1kNYlSQHaEK&pid=Api&P=0",
        videoTitle: "All about Blockchain | Simply Explained",
        ChannelName: "Apna College",
        Views: 1,
        Time: 3,
      },
      {
        videoThumbnail:
          "https://tse4.mm.bing.net/th?id=OIP._kuR2f4W01784yF9cTVsEAHaEK&pid=Api&P=0",
        videoTitle:
          "Web Development Roadmap 2023 🔥 | Step By Step Guide| HTML,CSS, JavaScript | CSE/Non-CSE Branches",
        ChannelName: "College Wallah",
        Views: 101,
        Time: 11,
      },
      {
        videoThumbnail:
          "https://tse3.mm.bing.net/th?id=OIP.iumiZjjCClu47Tl1kNYlSQHaEK&pid=Api&P=0",
        videoTitle: "All about Blockchain | Simply Explained",
        ChannelName: "Apna College",
        Views: 1,
        Time: 3,
      },
      {
        videoThumbnail:
          "https://tse4.mm.bing.net/th?id=OIP._kuR2f4W01784yF9cTVsEAHaEK&pid=Api&P=0",
        videoTitle:
          "Web Development Roadmap 2023 🔥 | Step By Step Guide| HTML,CSS, JavaScript | CSE/Non-CSE Branches",
        ChannelName: "College Wallah",
        Views: 101,
        Time: 11,
      },
  ];
  return (
    <>
      {WatchedVideos.map((video, i) => {
        return <WatchedVideo video={video} key={i} />;
      })}
    </>
  );
}

export default WatchedVideos;
