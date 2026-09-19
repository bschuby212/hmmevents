import { useEffect, useRef } from "react";
import StatusBarsComponent from "@/imports/StatusBars";
import topography from "@/assets/map/figma/topography.svg";
import water from "@/assets/map/figma/water.svg";
import mapVan from "@/assets/map/figma/van.png";
import silverStar from "@/assets/map/figma/silver-star.svg";
import goldStar from "@/assets/map/figma/gold-star.svg";
import stickerStand from "@/assets/map/figma/sticker-stand.svg";
import treeDark from "@/assets/map/figma/tree-dark.svg";
import treeLight from "@/assets/map/figma/tree-light.svg";

type MindMapProps = {
  completed?: boolean;
  traveling?: boolean;
  onArrived?: () => void;
};

function MysteryStop() {
  return (
    <div className="mystery-stop" aria-label="Mystery stop ahead">
      <span className="mystery-stop__post mystery-stop__post--top" />
      <div className="mystery-stop__sign">
        <div className="mystery-stop__inset">?</div>
      </div>
      <span className="mystery-stop__post mystery-stop__post--bottom" />
    </div>
  );
}

export default function MindMap({
  completed = false,
  traveling = false,
  onArrived,
}: MindMapProps) {
  const arrived = useRef(completed);
  const onArrivedRef = useRef(onArrived);
  onArrivedRef.current = onArrived;

  useEffect(() => {
    if (!traveling || completed || arrived.current) return;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    arrived.current = true;
    const timer = window.setTimeout(() => onArrivedRef.current?.(), 120);
    return () => window.clearTimeout(timer);
  }, [completed, traveling]);

  const handleTravelEnd = (event: React.AnimationEvent<HTMLImageElement>) => {
    if (event.animationName !== "van-travel" || arrived.current) return;
    arrived.current = true;
    onArrivedRef.current?.();
  };

  return (
    <section
      className={[
        "mind-map",
        traveling ? "mind-map--traveling" : "",
        completed ? "mind-map--completed" : "",
      ].join(" ")}
      aria-label={completed ? "Completed Healthy Mind Map destination" : "Healthy Mind Map journey"}
    >
      <div className="map-world">
        <div className="map-world__base" />
        <img className="map-world__topography" src={topography} alt="" draggable={false} />
        <div className="map-hill map-hill--one" />
        <div className="map-hill map-hill--two" />
        <svg className="map-road" viewBox="0 0 393 930" aria-hidden="true">
          <path className="map-road__shoulder" d="M333 -50C270 93 350 205 285 330C205 455 102 475 145 620C177 729 104 786 111 940" />
          <path className="map-road__surface" d="M333 -50C270 93 350 205 285 330C205 455 102 475 145 620C177 729 104 786 111 940" />
          <path className="map-road__center" d="M333 -50C270 93 350 205 285 330C205 455 102 475 145 620C177 729 104 786 111 940" />
        </svg>
        <img className="map-water" src={water} alt="" draggable={false} />
        <img className="map-tree map-tree--one" src={treeDark} alt="" draggable={false} />
        <img className="map-tree map-tree--two" src={treeLight} alt="" draggable={false} />
        <img className="map-tree map-tree--three" src={treeDark} alt="" draggable={false} />
        <img className="map-tree map-tree--four" src={treeLight} alt="" draggable={false} />
        <img className="map-tree map-tree--five" src={treeDark} alt="" draggable={false} />
        <img className="map-landmark map-landmark--stand" src={stickerStand} alt="Sticker Stand" draggable={false} />
        <img className="map-landmark map-landmark--gold" src={goldStar} alt="Gold Star" draggable={false} />
        <img className="map-landmark map-landmark--silver" src={silverStar} alt="Silver Star" draggable={false} />
        {!completed && <MysteryStop />}
        <img
          className="map-world__van"
          src={mapVan}
          alt="Your van driving to the Silver Star"
          draggable={false}
          onAnimationEnd={handleTravelEnd}
        />
      </div>

      <header className="map-header">
        <div className="map-header__back" aria-hidden="true">
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path d="M7 1L1 7L7 13" stroke="#063235" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="map-header__copy">
          <h1>Your Mind Map</h1>
          <p>Now in Starter County</p>
        </div>
        <div className="map-header__miles">
          <strong>823</strong><span>MI</span>
        </div>
      </header>
      <div className="map-status">
        <StatusBarsComponent />
      </div>
    </section>
  );
}
