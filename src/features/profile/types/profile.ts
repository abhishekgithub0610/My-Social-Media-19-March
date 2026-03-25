import type { StaticImageData } from "next/image";

export type ProfilePanelLink = {
  name: string;
  link: string;
  image: string | StaticImageData;
};
