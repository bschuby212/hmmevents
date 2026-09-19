import { useEffect, useRef, useState } from "react";
import StatusBarsComponent from "@/imports/StatusBars";
import coast from "@/assets/placement/coast.png";
import van from "@/assets/placement/van.png";
import sideVan from "@/assets/drive-off/side-van.png";
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
  stickerVisible?: boolean;
};

const DEFAULT_PLACEMENT: StickerTransform = {
  x: 487,
  y: 376,
  scale: 1,
  rotation: 0,
};

const VAN_INITIAL_LEFT = -330;
const VAN_WIDTH = 1062;
const VAN_HEIGHT = 603;
const SCENE_WIDTH = 393;
const VAN_VISIBLE_MIN = 140;
const X_BOUNDS = { min: 101, max: 984 };
const Y_BOUNDS = { min: 331, max: 432 };
const DRIVE_OFF_X = { min: 8.7, max: 91.5 };
const DRIVE_OFF_Y = { min: 47.3, max: 61.7 };
const DRIVE_OFF_DURATION = 2600;

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

function clampVanOffset(offset: number) {
  const left = VAN_INITIAL_LEFT + offset;
  const minLeft = VAN_VISIBLE_MIN - VAN_WIDTH;
  const maxLeft = SCENE_WIDTH - VAN_VISIBLE_MIN;
  return clamp(left, minLeft, maxLeft) - VAN_INITIAL_LEFT;
}

export default function StickerPlacement({
  event,
  onConfirm,
  stickerVisible = true,
}: StickerPlacementProps) {
  const [placement, setPlacement] = useState<StickerTransform>(DEFAULT_PLACEMENT);
  const [isDragging, setIsDragging] = useState(false);
  const [drivingOff, setDrivingOff] = useState(false);
  const gesture = useRef<{
    startX: number;
    startY: number;
    startOffset: number;
    dragging: boolean;
  } | null>(null);
  const vanRef = useRef<HTMLDivElement | null>(null);
  const vanImageRef = useRef<HTMLImageElement | null>(null);
  const alphaCanvas = useRef<HTMLCanvasElement | null>(null);
  const beachRef = useRef<HTMLDivElement | null>(null);
  const vanOffsetRef = useRef(0);
  const pendingOffsetRef = useRef(0);
  const frameRef = useRef(0);
  const onConfirmRef = useRef(onConfirm);
  onConfirmRef.current = onConfirm;

  useEffect(() => () => window.cancelAnimationFrame(frameRef.current), []);
  useEffect(() => {
    if (!drivingOff) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(
      () => onConfirmRef.current(placement),
      reduced ? 400 : DRIVE_OFF_DURATION,
    );
    return () => window.clearTimeout(timer);
  }, [drivingOff, placement]);

  const renderVanOffset = (next: number) => {
    pendingOffsetRef.current = next;
    if (frameRef.current) return;
    frameRef.current = window.requestAnimationFrame(() => {
      const offset = pendingOffsetRef.current;
      vanOffsetRef.current = offset;
      if (vanRef.current) {
        vanRef.current.style.transform = `translate3d(${offset}px, 0, 0)`;
      }
      if (beachRef.current) {
        beachRef.current.style.transform = `translate3d(${offset * -0.045}px, 0, 0) scale(1.08)`;
      }
      frameRef.current = 0;
    });
  };

  const hitTestsVan = (clientX: number, clientY: number) => {
    const image = vanImageRef.current;
    const canvas = alphaCanvas.current;
    if (!image || !canvas) return false;
    const box = image.getBoundingClientRect();
    if (clientX < box.left || clientX > box.right || clientY < box.top || clientY > box.bottom) {
      return false;
    }
    const x = Math.floor(((clientX - box.left) / box.width) * image.naturalWidth);
    const y = Math.floor(((clientY - box.top) / box.height) * image.naturalHeight);
    const pixel = canvas.getContext("2d")?.getImageData(x, y, 1, 1).data;
    return Boolean(pixel && pixel[3] >= 20);
  };

  const stickerPositionFor = (clientX: number, clientY: number): StickerTransform | null => {
    const wrapper = vanRef.current;
    if (!wrapper) return null;
    const box = wrapper.getBoundingClientRect();
    return {
      x: clamp(((clientX - box.left) / box.width) * VAN_WIDTH, X_BOUNDS.min, X_BOUNDS.max),
      y: clamp(((clientY - box.top) / box.height) * VAN_HEIGHT, Y_BOUNDS.min, Y_BOUNDS.max),
      scale: 1,
      rotation: 0,
    };
  };

  const startVanGesture = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || !hitTestsVan(event.clientX, event.clientY)) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    gesture.current = {
      startX: event.clientX,
      startY: event.clientY,
      startOffset: vanOffsetRef.current,
      dragging: false,
    };
  };

  const moveVanGesture = (event: React.PointerEvent<HTMLDivElement>) => {
    const current = gesture.current;
    if (!current) return;
    event.preventDefault();
    const dx = event.clientX - current.startX;
    const dy = event.clientY - current.startY;
    if (!current.dragging && Math.hypot(dx, dy) < 8) return;
    current.dragging = true;
    setIsDragging(true);
    renderVanOffset(clampVanOffset(current.startOffset + dx));
  };

  const endVanGesture = (event: React.PointerEvent<HTMLDivElement>) => {
    const current = gesture.current;
    if (!current) return;
    if (!current.dragging) {
      const next = stickerPositionFor(event.clientX, event.clientY);
      if (next) setPlacement(next);
    }
    gesture.current = null;
    setIsDragging(false);
  };

  const cancelVanGesture = () => {
    gesture.current = null;
    setIsDragging(false);
  };

  if (drivingOff) {
    const left = DRIVE_OFF_X.min +
      ((placement.x - X_BOUNDS.min) / (X_BOUNDS.max - X_BOUNDS.min)) *
        (DRIVE_OFF_X.max - DRIVE_OFF_X.min);
    const top = DRIVE_OFF_Y.min +
      ((placement.y - Y_BOUNDS.min) / (Y_BOUNDS.max - Y_BOUNDS.min)) *
        (DRIVE_OFF_Y.max - DRIVE_OFF_Y.min);

    return (
      <section className="drive-off-screen" aria-label="Van driving back to the Healthy Mind Map">
        <img className="drive-off-coast" src={coast} alt="" draggable={false} />
        <div className="drive-off-van-wrap drive-off-van-wrap--driving">
          <img className="drive-off-van" src={sideVan} alt="Blue camper van driving away" draggable={false} />
          <div className="drive-off-sticker" style={{ left: `${left}%`, top: `${top}%` }}>
            <img src={event.stickerArtwork} alt="" draggable={false} />
          </div>
        </div>
        <div className="drive-off-status">
          <StatusBarsComponent />
        </div>
      </section>
    );
  }

  return (
    <section className="placement-screen" aria-label="Place your Bigfoot sticker">
      <div
        ref={beachRef}
        className="placement-beach"
      >
        <img src={coast} alt="" draggable={false} />
      </div>

      <div
        ref={vanRef}
        className={`placement-van${isDragging ? " placement-van--dragging" : ""}`}
        onPointerDown={startVanGesture}
        onPointerMove={moveVanGesture}
        onPointerUp={endVanGesture}
        onPointerCancel={cancelVanGesture}
      >
        <canvas ref={alphaCanvas} className="placement-alpha-canvas" aria-hidden="true" />
        <img
          ref={vanImageRef}
          className="placement-van__art"
          src={van}
          alt="Blue camper van"
          draggable={false}
          onLoad={(loadEvent) => {
            const image = loadEvent.currentTarget;
            const canvas = alphaCanvas.current;
            if (!canvas) return;
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;
            canvas.getContext("2d")?.drawImage(image, 0, 0);
          }}
        />
        <div
          className={`placement-sticker${stickerVisible ? "" : " placement-sticker--hidden"}`}
          style={{
            left: placement.x,
            top: placement.y,
            transform: `translate(-50%, -50%) rotate(${placement.rotation}deg) scale(${placement.scale})`,
          }}
          role="img"
          aria-label="Sasquatch sticker on the van"
        >
          <img src={event.stickerArtwork} alt="" draggable={false} />
        </div>
      </div>

      <div className="placement-panel">
        <h1>Place Your Sticker</h1>
        <p>Drag your van to adjust the view, then place your sticker.</p>
        <button type="button" onClick={() => setDrivingOff(true)}>
          Place Sticker
        </button>
      </div>
      <div className="placement-status">
        <StatusBarsComponent />
      </div>
    </section>
  );
}
