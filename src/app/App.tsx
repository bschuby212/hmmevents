import { useEffect, useMemo, useRef, useState } from "react";
import MindMap from "@/app/components/MindMap";
import EventExperience from "@/app/components/EventExperience";
import StickerPlacement from "@/app/components/StickerPlacement";
import {
  BIGFOOT_EVENT,
  INITIAL_PROGRESS,
  type EventProgress,
} from "@/app/data/events";
import mapTopography from "@/assets/map/figma/topography.svg";
import mapVan from "@/assets/map/figma/van.png";
import mapWater from "@/assets/map/figma/water.svg";
import coast from "@/assets/placement/coast.png";
import placementVan from "@/assets/placement/van.png";

type ExperiencePhase =
  | "loading"
  | "map"
  | "arrival"
  | "event"
  | "reward"
  | "placement"
  | "complete";

type StickerTransitionStage =
  | "idle"
  | "lifting"
  | "crossfading"
  | "landing"
  | "complete";

function preloadImages(sources: string[]) {
  return Promise.all(
    sources.map(
      (source) =>
        new Promise<void>((resolve) => {
          const image = new Image();
          image.src = source;
          const done = () => resolve();
          if (image.decode) image.decode().then(done).catch(done);
          else {
            image.onload = done;
            image.onerror = done;
          }
        }),
    ),
  );
}

export default function App() {
  const event = BIGFOOT_EVENT;
  const [phase, setPhase] = useState<ExperiencePhase>("loading");
  const [traveling, setTraveling] = useState(false);
  const [progress, setProgress] = useState<EventProgress>(INITIAL_PROGRESS);
  const [stickerTransition, setStickerTransition] =
    useState<StickerTransitionStage>("idle");
  const nextAssets = useRef<Promise<unknown>>(Promise.resolve());
  const transitionTimers = useRef<number[]>([]);

  useEffect(() => {
    let active = true;
    let startTimer = 0;
    preloadImages([mapTopography, mapWater, mapVan]).then(() => {
      if (!active) return;
      setPhase("map");
      startTimer = window.setTimeout(() => setTraveling(true), 850);
    });
    return () => {
      active = false;
      window.clearTimeout(startTimer);
    };
  }, []);

  useEffect(
    () => () => transitionTimers.current.forEach((timer) => window.clearTimeout(timer)),
    [],
  );

  useEffect(() => {
    if (!traveling) return;
    setProgress((current) => ({ ...current, status: "traveling" }));
    nextAssets.current = preloadImages([event.eventArtwork, event.rewardArtwork]);
  }, [event.eventArtwork, event.rewardArtwork, traveling]);

  useEffect(() => {
    if (phase === "event") {
      nextAssets.current = preloadImages([
        event.rewardSticker,
        event.stickerArtwork,
      ]);
    }
    if (phase === "reward") {
      nextAssets.current = preloadImages([
        coast,
        placementVan,
        event.rewardSticker,
        event.stickerArtwork,
      ]);
    }
  }, [event.rewardSticker, event.stickerArtwork, phase]);

  const beginStickerDrop = async () => {
    await nextAssets.current;
    transitionTimers.current.forEach((timer) => window.clearTimeout(timer));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setStickerTransition("lifting");
    transitionTimers.current = [
      window.setTimeout(() => {
        setPhase("placement");
        setStickerTransition("crossfading");
      }, reduced ? 20 : 400),
      window.setTimeout(
        () => setStickerTransition("landing"),
        reduced ? 40 : 540,
      ),
      window.setTimeout(() => {
        setStickerTransition("complete");
      }, reduced ? 60 : 920),
    ];
  };

  const screen = useMemo(() => {
    if (phase === "loading") {
      return <div className="experience-loading" aria-label="Preparing Healthy Mind Map" />;
    }
    if (phase === "map" || phase === "arrival") {
      return (
        <MindMap
          traveling={traveling}
          arrived={phase === "arrival"}
          onArrived={() => {
            setTraveling(false);
            setPhase("arrival");
            setProgress((current) => ({ ...current, status: "arrived" }));
            window.setTimeout(() => setPhase("event"), 900);
          }}
        />
      );
    }
    if (phase === "event") {
      return (
        <EventExperience
          event={event}
          mode="event"
          onContinue={() => {
            setProgress((current) => ({ ...current, stickerEarned: true }));
            setPhase("reward");
          }}
        />
      );
    }
    if (phase === "reward") {
      return (
        <EventExperience
          event={event}
          mode="reward"
          stickerDeparting={stickerTransition === "lifting"}
          onContinue={beginStickerDrop}
        />
      );
    }
    if (phase === "placement") {
      return (
        <StickerPlacement
          event={event}
          stickerVisible={stickerTransition === "complete"}
          onConfirm={() => {
            setProgress({
              status: "completed",
              completed: true,
              stickerEarned: true,
              stickerPlaced: true,
            });
            setPhase("complete");
          }}
        />
      );
    }
    return <MindMap completed />;
  }, [event, phase, stickerTransition, traveling]);

  return (
    <main className="experience-shell" data-progress={progress.status}>
      <div className="device">
        <div className="device__screen">
          {screen}
          {stickerTransition !== "idle" && stickerTransition !== "complete" && (
            <div
              className={`sticker-drop-overlay sticker-drop-overlay--${stickerTransition}`}
              aria-hidden="true"
            >
              <img src={event.stickerArtwork} alt="" draggable={false} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
