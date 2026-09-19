import { useEffect, useRef } from "react";
import vanPage from "@/assets/map/figma/van-page.png";

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
    if (!traveling || completed) return;
    arrivedRef.current = false;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delayMs = reduced ? 120 : 4500;

    const timer = window.setTimeout(() => {
      if (arrivedRef.current) return;
      arrivedRef.current = true;
      onArrivedRef.current?.();
    }, delayMs);

    return () => window.clearTimeout(timer);
  }, [completed, traveling]);

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
        {/* Exact Figma export of Van Page 2205:11235 — unchanged */}
        <img
          className="map-exact"
          src={vanPage}
          alt="Your Mind Map"
          width={393}
          height={852}
          draggable={false}
        />
      </div>
    </section>
  );
}
