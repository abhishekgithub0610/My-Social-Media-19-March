"use client";

import { createContext, useContext } from "react";

export type ViewerImage = {
  id: string;
  src: string;
  alt: string;
};

export type ImageViewerContextType = {
  openImage: (image: ViewerImage) => void;
  openImages: (images: ViewerImage[], activeIndex?: number) => void;
  closeImage: () => void;
};

export const ImageViewerContext = createContext<ImageViewerContextType | null>(
  null,
);

export const useImageViewer = (): ImageViewerContextType => {
  const context = useContext(ImageViewerContext);

  if (!context) {
    throw new Error("useImageViewer must be used inside ImageViewerProvider");
  }

  return context;
};
