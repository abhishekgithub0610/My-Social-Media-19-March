"use client";

import { useCallback, useState } from "react";

import FacebookImageViewer from "./FacebookImageViewer";
import { ImageViewerContext, type ViewerImage } from "./useImageViewer";

type ImageViewerProviderProps = {
  children: React.ReactNode;
};

type ViewerState = {
  images: ViewerImage[];
  activeIndex: number;
};

export default function ImageViewerProvider({
  children,
}: ImageViewerProviderProps) {
  const [viewer, setViewer] = useState<ViewerState | null>(null);

  const openImage = useCallback((image: ViewerImage): void => {
    // A single image always creates a single-image viewer.
    // Therefore Previous/Next buttons will not appear.
    setViewer({
      images: [image],
      activeIndex: 0,
    });
  }, []);

  const openImages = useCallback(
    (images: ViewerImage[], activeIndex = 0): void => {
      if (images.length === 0) {
        return;
      }

      const safeIndex = Math.min(Math.max(activeIndex, 0), images.length - 1);

      setViewer({
        images,
        activeIndex: safeIndex,
      });
    },
    [],
  );

  const closeImage = useCallback((): void => {
    setViewer(null);
  }, []);

  const handleNavigate = useCallback((index: number): void => {
    setViewer((current) => {
      if (!current) {
        return null;
      }

      if (index < 0 || index >= current.images.length) {
        return current;
      }

      return {
        ...current,
        activeIndex: index,
      };
    });
  }, []);

  return (
    <ImageViewerContext.Provider
      value={{
        openImage,
        openImages,
        closeImage,
      }}
    >
      {children}

      {viewer && (
        <FacebookImageViewer
          images={viewer.images}
          activeIndex={viewer.activeIndex}
          onClose={closeImage}
          onNavigate={handleNavigate}
        />
      )}
    </ImageViewerContext.Provider>
  );
}
