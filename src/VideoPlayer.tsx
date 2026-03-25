"use client";

import dynamic from "next/dynamic";
import "plyr-react/plyr.css";
import type { PlyrProps } from "plyr-react";

const Plyr = dynamic(() => import("plyr-react").then((mod) => mod.Plyr), {
  ssr: false,
  loading: () => <p>Loading Video Player...</p>,
});

const VideoPlayer = () => {
  return (
    <div className="overflow-hidden fullscreen-video w-100">
      <Plyr
        source={{
          type: "video",
          poster: "/videos/poster.jpg",
          sources: [{ src: "/videos/video-feed.mp4" }],
        }}
      />
    </div>
  );
};

export default VideoPlayer;
// // 'use client'
// // import dynamic from 'next/dynamic'
// // const Plyr = dynamic(() => import('plyr-react'))

// // import 'plyr-react/plyr.css'

// // const VideoPlayer = () => {
// //   return (
// //     <div className="overflow-hidden fullscreen-video w-100">
// //       <Plyr
// //         crossOrigin="anonymous"
// //         controls
// //         source={{
// //           type: 'video',
// //           poster: '/videos/poster.jpg',
// //           sources: [{ src: '/videos/video-feed.mp4' }],
// //         }}
// //       />
// //     </div>
// //   )
// // }
// // export default VideoPlayer
