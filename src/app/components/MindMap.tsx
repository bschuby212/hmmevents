import { useEffect, useRef } from "react";
import StatusBarsComponent from "@/imports/StatusBars";
import mapArtwork from "@/assets/map/map.png";
import mapVan from "@/assets/map/map-van.png";

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
        <img className="map-world__art" src={mapArtwork} alt="" draggable={false} />
        {!completed && <MysteryStop />}
        {completed && (
          <div className="destination-complete" aria-label="Bigfoot event completed">
            <span>✓</span>
          </div>
        )}
        <img
          className="map-world__van"
          src={mapVan}
          alt="Your van driving to the Silver Star"
          draggable={false}
          onAnimationEnd={handleTravelEnd}
        />
      </div>

      <header className="map-header">
        <div className="map-header__back" aria-hidden="true">‹</div>
        <div className="map-header__copy">
          <h1>Your Mind Map</h1>
          <p>{completed ? "Silver Star reached" : "Now in Starter County"}</p>
        </div>
        <div className="map-header__miles">
          <strong>{completed ? "824" : "823"}</strong><span>MI</span>
        </div>
      </header>
      <div className="map-status">
        <StatusBarsComponent />
      </div>
      <div className="map-progress" aria-hidden="true">
        <span className={completed ? "map-progress__fill map-progress__fill--complete" : "map-progress__fill"} />
      </div>
    </section>
  );
}
