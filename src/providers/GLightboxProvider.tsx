"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import GLightbox from "glightbox";

export default function GLightboxProvider() {
  const pathname = usePathname();

  const lightboxRef = useRef<ReturnType<typeof GLightbox> | null>(null);

  useEffect(() => {
    if (lightboxRef.current) {
      lightboxRef.current.destroy();
      lightboxRef.current = null;
    }

    const timer = window.setTimeout(() => {
      const lightbox = GLightbox({
        selector: ".glightbox",

        touchNavigation: true,
        keyboardNavigation: true,

        loop: true,

        zoomable: true,
        draggable: true,

        openEffect: "fade",
        closeEffect: "fade",

        closeButton: true,
        closeOnOutsideClick: true,

        preload: true,

        width: "auto",
        height: "auto",
      });

      lightboxRef.current = lightbox;

      /*
       * GLightbox creates its DOM only after opening.
       * So add our custom controls after the lightbox opens.
       */
      lightbox.on("open", () => {
        setTimeout(() => {
          addZoomControls();
        }, 50);
      });
    }, 100);

    return () => {
      clearTimeout(timer);

      if (lightboxRef.current) {
        lightboxRef.current.destroy();
        lightboxRef.current = null;
      }
    };
  }, [pathname]);

  return null;
}

/* =========================================================
   CUSTOM ZOOM CONTROLS
   ========================================================= */

function addZoomControls() {
  const container = document.querySelector(".glightbox-container");

  if (!container) return;

  // Don't create twice
  if (container.querySelector(".custom-glightbox-zoom")) {
    return;
  }

  const toolbar = document.createElement("div");

  toolbar.className = "custom-glightbox-zoom";

  toolbar.innerHTML = `
    <button
      type="button"
      class="glb-zoom-out"
      aria-label="Zoom out"
    >
      −
    </button>

    <span class="glb-zoom-value">
      100%
    </span>

    <button
      type="button"
      class="glb-zoom-in"
      aria-label="Zoom in"
    >
      +
    </button>
  `;

  container.appendChild(toolbar);

  const image = container.querySelector(
    ".gslide.current .gslide-image img",
  ) as HTMLImageElement | null;

  if (!image) return;

  let scale = 1;

  const updateImage = () => {
    image.style.transform = `scale(${scale})`;

    const percentage = Math.round(scale * 100);

    const value = toolbar.querySelector(".glb-zoom-value");

    if (value) {
      value.textContent = `${percentage}%`;
    }
  };

  toolbar.querySelector(".glb-zoom-in")?.addEventListener("click", () => {
    scale = Math.min(scale + 0.25, 3);
    updateImage();
  });

  toolbar.querySelector(".glb-zoom-out")?.addEventListener("click", () => {
    scale = Math.max(scale - 0.25, 1);
    updateImage();
  });

  updateImage();
}
