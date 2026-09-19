import { useRef, useState } from "react";
import StatusBarsComponent from "@/imports/StatusBars";
import coast from "@/assets/placement/coast.png";
import van from "@/assets/placement/van.png";
import type { JourneyEvent } from "@/app/data/events";

export type StickerTransform = {
  x: number;
  y: number;
  scale: number;
  rotation: number;
};

type StickerPlacementProps = {
  event: JourneyEvent;
  onConfirm: (placement: StickerTransform) => void;
};

const DEFAULT_PLACEMENT: StickerTransform = {
  x: 370,
  y: 274,
  scale: 1,
  rotation: 0,
};

const X_BOUNDS = { min: 166, max: 630 };
const Y_BOUNDS = { min: 248, max: 306 };

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

export default function StickerPlacement({
  event,
  onConfirm,
}: StickerPlacementProps) {
  const [placement, setPlacement] = useState<StickerTransform>(DEFAULT_PLACEMENT);
  const [vanOffset, setVanOffset] = useState(0);
  const [draggingSticker, setDraggingSticker] = useState(false);
  const stickerGesture = useRef<{ x: number; y: number; start: StickerTransform } | null>(null);
  const vanGesture = useRef<{ x: number; start: number } | null>(null);
  const vanRef = useRef<HTMLDivElement | null>(null);

  const startStickerDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    stickerGesture.current = {
      x: event.clientX,
      y: event.clientY,
      start: placement,
    };
    setDraggingSticker(true);
  };

  const moveSticker = (event: React.PointerEvent<HTMLDivElement>) => {
    const gesture = stickerGesture.current;
    const wrapper = vanRef.current;
    if (!gesture || !wrapper) return;
    const displayScale = wrapper.getBoundingClientRect().width / 760;
    setPlacement({
      ...gesture.start,
      x: clamp(gesture.start.x + (event.clientX - gesture.x) / displayScale, X_BOUNDS.min, X_BOUNDS.max),
      y: clamp(gesture.start.y + (event.clientY - gesture.y) / displayScale, Y_BOUNDS.min, Y_BOUNDS.max),
    });
  };

  const endStickerDrag = () => {
    stickerGesture.current = null;
    setDraggingSticker(false);
  };

  const startVanDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest(".placement-sticker")) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    vanGesture.current = { x: event.clientX, start: vanOffset };
  };

  const moveVan = (event: React.PointerEvent<HTMLDivElement>) => {
    const gesture = vanGesture.current;
    if (!gesture) return;
    setVanOffset(clamp(gesture.start + event.clientX - gesture.x, -185, 35));
  };

  const endVanDrag = () => {
    vanGesture.current = null;
  };

  return (
    <section className="placement-screen" aria-label="Place your Bigfoot sticker">
      <div
        className="placement-beach"
        style={{ transform: `translate3d(${vanOffset * -0.045}px, 0, 0) scale(1.08)` }}
      >
        <img src={coast} alt="" draggable={false} />
      </div>

      <div
        ref={vanRef}
        className="placement-van"
        style={{ transform: `translate3d(${vanOffset}px, 0, 0)` }}
        onPointerDown={startVanDrag}
        onPointerMove={moveVan}
        onPointerUp={endVanDrag}
        onPointerCancel={endVanDrag}
      >
        <img className="placement-van__art" src={van} alt="Blue camper van" draggable={false} />
        <div
          className={`placement-sticker${draggingSticker ? " placement-sticker--dragging" : ""}`}
          style={{
            left: placement.x,
            top: placement.y,
            transform: `translate(-50%, -50%) rotate(${placement.rotation}deg) scale(${placement.scale})`,
          }}
          role="img"
          aria-label="Draggable Sasquatch sticker"
          onPointerDown={startStickerDrag}
          onPointerMove={moveSticker}
          onPointerUp={endStickerDrag}
          onPointerCancel={endStickerDrag}
        >
          <img src={event.rewardSticker} alt="" draggable={false} />
        </div>
      </div>

      <div className="placement-panel">
        <h1>Place Your Sticker</h1>
        <p>Drag Bigfoot onto your van. Swipe the van to adjust your view.</p>
        <button type="button" onClick={() => onConfirm(placement)}>
          Confirm Placement
        </button>
      </div>
      <div className="placement-status">
        <StatusBarsComponent />
      </div>
    </section>
  );
}
