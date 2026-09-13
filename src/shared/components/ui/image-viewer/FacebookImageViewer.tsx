"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import type { ViewerImage } from "./useImageViewer";

type FacebookImageViewerProps = {
  images: ViewerImage[];
  activeIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

type Point = {
  x: number;
  y: number;
};

type DragState = {
  pointerId: number;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
};

type PinchState = {
  distance: number;
  scale: number;
};

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const ZOOM_STEP = 0.25;

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

const getDistance = (first: Point, second: Point): number => {
  return Math.hypot(second.x - first.x, second.y - first.y);
};

export default function FacebookImageViewer({
  images,
  activeIndex,
  onClose,
  onNavigate,
}: FacebookImageViewerProps) {
  const [scale, setScale] = useState<number>(MIN_SCALE);
  const [position, setPosition] = useState<Point>({
    x: 0,
    y: 0,
  });
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const pointersRef = useRef<Map<number, Point>>(new Map());
  const dragRef = useRef<DragState | null>(null);
  const pinchRef = useRef<PinchState | null>(null);

  const activeImage = images[activeIndex];

  const resetView = useCallback((): void => {
    setScale(MIN_SCALE);
    setPosition({
      x: 0,
      y: 0,
    });
  }, []);

  const updateZoom = useCallback((newScale: number): void => {
    const nextScale = clamp(newScale, MIN_SCALE, MAX_SCALE);

    setScale(nextScale);

    if (nextScale === MIN_SCALE) {
      setPosition({
        x: 0,
        y: 0,
      });
    }
  }, []);

  const zoomIn = useCallback((): void => {
    setScale((currentScale) =>
      clamp(currentScale + ZOOM_STEP, MIN_SCALE, MAX_SCALE),
    );
  }, []);

  const zoomOut = useCallback((): void => {
    setScale((currentScale) => {
      const nextScale = clamp(currentScale - ZOOM_STEP, MIN_SCALE, MAX_SCALE);

      if (nextScale === MIN_SCALE) {
        setPosition({
          x: 0,
          y: 0,
        });
      }

      return nextScale;
    });
  }, []);

  const goPrevious = useCallback((): void => {
    if (images.length <= 1) {
      return;
    }

    const previousIndex =
      activeIndex === 0 ? images.length - 1 : activeIndex - 1;

    onNavigate(previousIndex);
  }, [activeIndex, images.length, onNavigate]);

  const goNext = useCallback((): void => {
    if (images.length <= 1) {
      return;
    }

    const nextIndex = activeIndex === images.length - 1 ? 0 : activeIndex + 1;

    onNavigate(nextIndex);
  }, [activeIndex, images.length, onNavigate]);

  useEffect(() => {
    resetView();
  }, [activeIndex, resetView]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key === "ArrowLeft") {
        goPrevious();
        return;
      }

      if (event.key === "ArrowRight") {
        goNext();
        return;
      }

      if (event.key === "+" || event.key === "=") {
        zoomIn();
        return;
      }

      if (event.key === "-") {
        zoomOut();
        return;
      }

      if (event.key === "0") {
        resetView();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [goNext, goPrevious, onClose, resetView, zoomIn, zoomOut]);

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>): void => {
    event.preventDefault();

    if (event.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  };

  const handlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
  ): void => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);

    pointersRef.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    if (pointersRef.current.size === 2) {
      const points = Array.from(pointersRef.current.values());

      if (points.length === 2) {
        pinchRef.current = {
          distance: getDistance(points[0], points[1]),
          scale,
        };
      }

      dragRef.current = null;
      setIsDragging(false);

      return;
    }

    if (scale > MIN_SCALE) {
      dragRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        originX: position.x,
        originY: position.y,
      };

      setIsDragging(true);
    }
  };

  const handlePointerMove = (
    event: React.PointerEvent<HTMLDivElement>,
  ): void => {
    if (!pointersRef.current.has(event.pointerId)) {
      return;
    }

    pointersRef.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    if (pointersRef.current.size === 2 && pinchRef.current) {
      const points = Array.from(pointersRef.current.values());

      if (points.length === 2) {
        const currentDistance = getDistance(points[0], points[1]);

        if (pinchRef.current.distance > 0) {
          const zoomRatio = currentDistance / pinchRef.current.distance;

          const nextScale = clamp(
            pinchRef.current.scale * zoomRatio,
            MIN_SCALE,
            MAX_SCALE,
          );

          setScale(nextScale);

          if (nextScale === MIN_SCALE) {
            setPosition({
              x: 0,
              y: 0,
            });
          }
        }
      }

      return;
    }

    const drag = dragRef.current;

    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - drag.startX;

    const deltaY = event.clientY - drag.startY;

    setPosition({
      x: drag.originX + deltaX,
      y: drag.originY + deltaY,
    });
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>): void => {
    pointersRef.current.delete(event.pointerId);

    if (pointersRef.current.size < 2) {
      pinchRef.current = null;
    }

    if (pointersRef.current.size === 0) {
      dragRef.current = null;
      setIsDragging(false);
    }
  };

  if (!activeImage) {
    return null;
  }

  const hasNavigation = images.length > 1;

  return (
    <div
      className="facebook-image-viewer"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
    >
      <div className="facebook-image-viewer__topbar">
        {hasNavigation && (
          <div className="facebook-image-viewer__counter">
            {activeIndex + 1} / {images.length}
          </div>
        )}

        <button
          type="button"
          className="facebook-image-viewer__close"
          onClick={onClose}
          aria-label="Close image viewer"
        >
          ×
        </button>
      </div>

      <div className="facebook-image-viewer__backdrop" onClick={onClose}>
        {hasNavigation && (
          <button
            type="button"
            className="facebook-image-viewer__navigation facebook-image-viewer__navigation--previous"
            onClick={(event) => {
              event.stopPropagation();
              goPrevious();
            }}
            aria-label="Previous image"
          >
            ‹
          </button>
        )}

        <div
          className={`facebook-image-viewer__image-frame ${
            isDragging ? "facebook-image-viewer__image-frame--dragging" : ""
          }`}
          onClick={(event) => event.stopPropagation()}
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onDoubleClick={() => {
            if (scale > MIN_SCALE) {
              resetView();
            } else {
              updateZoom(2.5);
            }
          }}
        >
          <Image
            src={activeImage.src}
            alt={activeImage.alt}
            fill
            priority
            unoptimized
            draggable={false}
            sizes="92vw"
            className="facebook-image-viewer__image"
            style={{
              transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})`,
            }}
          />
        </div>

        {hasNavigation && (
          <button
            type="button"
            className="facebook-image-viewer__navigation facebook-image-viewer__navigation--next"
            onClick={(event) => {
              event.stopPropagation();
              goNext();
            }}
            aria-label="Next image"
          >
            ›
          </button>
        )}
      </div>

      <div className="facebook-image-viewer__toolbar">
        <button
          type="button"
          onClick={zoomOut}
          disabled={scale <= MIN_SCALE}
          aria-label="Zoom out"
        >
          −
        </button>

        <button
          type="button"
          onClick={resetView}
          className="facebook-image-viewer__zoom-value"
          aria-label="Reset zoom"
        >
          {Math.round(scale * 100)}%
        </button>

        <button
          type="button"
          onClick={zoomIn}
          disabled={scale >= MAX_SCALE}
          aria-label="Zoom in"
        >
          +
        </button>
      </div>
    </div>
  );
}
