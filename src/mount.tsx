import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import RoundCarousel from "./RoundCarousel";

// Only the Olga screenshot is real for now; empty sources show plain placeholder faces
const images = [
  { src: "assets/previews/olga.jpg" },
  { src: "" },
  { src: "" },
  { src: "" },
  { src: "" },
];

const container = document.getElementById("round-carousel");
if (container) {
  createRoot(container).render(
    <StrictMode>
      <RoundCarousel images={images} />
    </StrictMode>,
  );
}

// Starfield stays a plain module in public/, loaded at runtime (its imports come from the page's importmap)
import(/* @vite-ignore */ new URL("./starfield.js?v=3", document.baseURI).href);
