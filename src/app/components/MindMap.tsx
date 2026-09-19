import { useEffect, useRef } from "react";
import mapBackground from "@/assets/map/figma/van-page.png";
import journeyVan from "@/assets/map/figma/journey-van.png";

type MindMapProps = {
  completed?: boolean;
  traveling?: boolean;
  arrived?: boolean;
  onArrived?: () => void;
};

export default function MindMap({
  completed = false,
  traveling = false,
  arrived = false,
  onArrived,
}: MindMapProps) {
  const arrivedRef = useRef(completed);
  const onArrivedRef = useRef(onArrived);
  onArrivedRef.current = onArrived;

  useEffect(() => {
    if (!traveling) return;
    arrivedRef.current = false;

    const fallback = window.setTimeout(() => {
      if (arrivedRef.current || completed) return;
      arrivedRef.current = true;
      onArrivedRef.current?.();
    }, 4800);

    return () => window.clearTimeout(fallback);
  }, [completed, traveling]);

  useEffect(() => {
    if (!traveling || completed || arrivedRef.current) return;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    arrivedRef.current = true;
    const timer = window.setTimeout(() => onArrivedRef.current?.(), 120);
    return () => window.clearTimeout(timer);
  }, [completed, traveling]);

  const handleTravelEnd = (event: React.AnimationEvent<HTMLImageElement>) => {
    if (event.animationName !== "van-travel" || arrivedRef.current) return;
    arrivedRef.current = true;
    onArrivedRef.current?.();
  };

  return (
    <section
      className={[
        "mind-map",
        traveling ? "mind-map--traveling" : "",
        arrived ? "mind-map--arrived" : "",
        completed ? "mind-map--completed" : "",
      ].join(" ")}
      aria-label={
        completed
          ? "Completed Healthy Mind Map destination"
          : "Healthy Mind Map journey"
      }
    >
      <div className="map-world">
        {/* Exact Figma Van Page background (2205:11235) — static */}
        <img
          className="map-exact"
          src={mapBackground}
          alt=""
          width={393}
          height={852}
          draggable={false}
        />
        {/* Figma van 2205:11430 — moves on top of the background */}
        <img
          className="map-world__van"
          src={journeyVan}
          alt="Your van"
          width={118}
          height={146}
          draggable={false}
          onAnimationEnd={handleTravelEnd}
        />
      </div>
    </section>
  );
}
