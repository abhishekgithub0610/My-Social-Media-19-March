"use client";
import dynamic from "next/dynamic";
const StoryComponent = dynamic(() => import("@/StoryComponent"), {
  ssr: false,
}); // to be confirmed/deleted

import post2 from "@/assets/images/post/1by1/02.jpg";
import albums1 from "@/assets/images/albums/01.jpg";
import albums2 from "@/assets/images/albums/02.jpg";
import albums3 from "@/assets/images/albums/03.jpg";
import albums4 from "@/assets/images/albums/04.jpg";
import albums5 from "@/assets/images/albums/05.jpg";
import albums6 from "@/assets/images/albums/06.jpg";

import post3 from "@/assets/images/post/1by1/03.jpg";
import post4 from "@/assets/images/post/1by1/04.jpg";
import post5 from "@/assets/images/post/1by1/05.jpg";
import post6 from "@/assets/images/post/1by1/06.jpg";
import post7 from "@/assets/images/post/1by1/07.jpg";
import { FaPlus } from "react-icons/fa";
import Link from "next/link";

const timestamp = () => {
  const timeIndex = 1678166046264 / 1000;
  const random = Math.floor(Math.random() * 1000);
  return Math.round(timeIndex - random);
};

type Story = {
  id: string;
  name: string;
  photo: string;
  time: number;
  items: {
    id: string;
    src: string;
    type: string;
    preview?: string;
    length: number;
    text?: string;
    link: string;
    linkText: boolean;
    time: number;
  }[];
};

const stories: Story[] = [
  {
    id: "1",
    name: "Judy Nguyen",
    photo: post2.src,
    time: timestamp(),
    items: [
      {
        id: "story-1",
        type: "photo",
        length: 5,
        src: albums1.src,
        preview: albums1.src,
        link: "",
        linkText: false,
        time: timestamp(),
      },
      {
        id: "story-2",
        type: "video",
        length: 0,
        src: "/videos/video-call.mp4",
        preview: "",
        link: "",
        linkText: false,
        time: timestamp(),
      },
      {
        id: "story-3",
        type: "photo",
        length: 5,
        src: albums2.src,
        preview: albums2.src,
        link: "",
        linkText: false,
        time: timestamp(),
      },
    ],
  },
  {
    id: "3",
    name: "Billy Vasquez",
    photo: post3.src,
    time: timestamp(),
    items: [
      {
        id: "story-5",
        length: 5,
        src: albums3.src,
        type: "photo",
        link: "",
        linkText: false,
        time: timestamp(),
      },
    ],
  },
  {
    id: "4",
    name: "Amanda Reed",
    photo: post4.src,
    time: timestamp(),
    items: [
      {
        id: "story-6",
        length: 5,
        src: albums4.src,
        type: "photo",
        link: "",
        linkText: false,
        time: timestamp(),
      },
    ],
  },
  {
    id: "5",
    name: "Lori Stevens",
    photo: post5.src,
    time: timestamp(),
    items: [
      {
        id: "story-7",
        length: 5,
        src: albums5.src,
        type: "photo",
        link: "",
        linkText: false,
        time: timestamp(),
      },
    ],
  },
  {
    id: "6",
    name: "Samuel Bishop",
    photo: post6.src,
    time: timestamp(),
    items: [
      {
        id: "story-8",
        length: 5,
        src: albums6.src,
        type: "photo",
        link: "",
        linkText: false,
        time: timestamp(),
      },
    ],
  },
  {
    id: "7",
    name: "Joan Wallace",
    photo: post7.src,
    time: timestamp(),
    items: [
      {
        id: "story-9",
        length: 5,
        src: albums6.src,
        type: "photo",
        link: "",
        linkText: false,
        time: timestamp(),
      },
    ],
  },
  {
    id: "8",
    name: "Carolyn Ortiz",
    photo: albums5.src,
    time: timestamp(),
    items: [
      {
        id: "story-10",
        length: 3,
        src: albums5.src,
        type: "photo",
        link: "",
        linkText: false,
        time: timestamp(),
      },
    ],
  },
];

const Stories = () => {
  return (
    <div className="d-flex gap-3 mb-n3">
      <div className="position-relative text-center">
        <div className="mb-1">
          <Link
            className="stretched-link btn btn-dark rounded-circle icon-xxl rounded-circle"
            href="#"
          >
            <FaPlus className="fs-6" />
          </Link>
        </div>
        <Link href="#" className="small fw-normal text-secondary">
          Post a story
        </Link>
      </div>
      <StoryComponent stories={stories} />
    </div>
  );
};
export default Stories;
