import { useEffect, useMemo, useRef, useState } from "react";
import MindMap from "@/app/components/MindMap";
import EventExperience from "@/app/components/EventExperience";
import StickerPlacement, {
  type StickerTransform,
} from "@/app/components/StickerPlacement";
import {
  BIGFOOT_EVENT,
  INITIAL_PROGRESS,
  type EventProgress,
} from "@/app/data/events";
import mapArtwork from "@/assets/map/map.png";
import mapVan from "@/assets/map/map-van.png";
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
  const [placement, setPlacement] = useState<StickerTransform | null>(null);
  const nextAssets = useRef<Promise<unknown>>(Promise.resolve());

  useEffect(() => {
    let active = true;
    let startTimer = 0;
    preloadImages([mapArtwork, mapVan]).then(() => {
      if (!active) return;
      setPhase("map");
      startTimer = window.setTimeout(() => setTraveling(true), 850);
    });
    return () => {
      active = false;
      window.clearTimeout(startTimer);
    };
  }, []);

  useEffect(() => {
    if (!traveling) return;
    setProgress((current) => ({ ...current, status: "traveling" }));
    nextAssets.current = preloadImages([event.eventArtwork, event.rewardArtwork]);
  }, [event.eventArtwork, event.rewardArtwork, traveling]);

  useEffect(() => {
    if (phase === "event") {
      nextAssets.current = preloadImages([event.rewardSticker]);
    }
    if (phase === "reward") {
      nextAssets.current = preloadImages([coast, placementVan, event.rewardSticker]);
    }
  }, [event.rewardSticker, phase]);

  const screen = useMemo(() => {
    if (phase === "loading") {
      return <div className="experience-loading" aria-label="Preparing Healthy Mind Map" />;
    }
    if (phase === "map" || phase === "arrival") {
      return (
        <MindMap
          traveling={traveling}
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
          onContinue={async () => {
            await nextAssets.current;
            setPhase("placement");
          }}
        />
      );
    }
    if (phase === "placement") {
      return (
        <StickerPlacement
          event={event}
          onConfirm={(confirmedPlacement) => {
            setPlacement(confirmedPlacement);
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
  }, [event, phase, traveling]);

  return (
    <main className="experience-shell" data-progress={progress.status}>
      <div className="device">
        <div className="device__screen">{screen}</div>
      </div>
      {phase === "complete" && placement && (
        <p className="completion-note" role="status">
          Bigfoot sticker placed · Silver Star reached
        </p>
      )}
    </main>
  );
}
