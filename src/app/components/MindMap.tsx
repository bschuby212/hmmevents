import { useRef } from "react";
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
  const arrivedRef = useRef(false);
  const onArrivedRef = useRef(onArrived);
  onArrivedRef.current = onArrived;

  if (!traveling && !arrived) {
    arrivedRef.current = false;
  }

  const signalArrived = () => {
    if (arrivedRef.current || completed) return;
    arrivedRef.current = true;
    onArrivedRef.current?.();
  };

  const handleTravelEnd = () => {
    if (!traveling) return;
    signalArrived();
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
        <img
          className="map-exact"
          src={mapBackground}
          alt=""
          width={393}
          height={852}
          draggable={false}
        />
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
