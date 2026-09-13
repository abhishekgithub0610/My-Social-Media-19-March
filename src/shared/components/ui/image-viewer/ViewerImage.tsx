"use client";

import Image, { type ImageProps } from "next/image";

import { useImageViewer, type ViewerImage } from "./useImageViewer";

type ViewerImageProps = Omit<ImageProps, "src" | "alt"> & {
  src: string;
  alt: string;
  viewerId: string;
};

export default function ViewerImage({
  src,
  alt,
  viewerId,
  ...imageProps
}: ViewerImageProps) {
  const { openImage } = useImageViewer();

  const handleClick = (): void => {
    openImage({
      id: viewerId,
      src,
      alt,
    });
  };

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleClick();
        }
      }}
      style={{ cursor: "pointer" }}
    >
      <Image {...imageProps} src={src} alt={alt} />
    </span>
  );
}
