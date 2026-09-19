import { useEffect, useMemo, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import MindMap from "@/app/components/MindMap";
import EventExperience from "@/app/components/EventExperience";
import StickerPlacement from "@/app/components/StickerPlacement";
import {
  INITIAL_PROGRESS,
  JOURNEY_EVENTS,
  type EventProgress,
} from "@/app/data/events";
import vanPage from "@/assets/map/figma/van-page.png";
import journeyVan from "@/assets/map/figma/journey-van.png";
import coast from "@/assets/placement/coast.png";
import placementVan from "@/assets/placement/van.png";

type ExperiencePhase =
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
          const done = () => resolve();
          const timer = window.setTimeout(done, 2500);
          image.onload = () => {
            window.clearTimeout(timer);
            done();
          };
          image.onerror = () => {
            window.clearTimeout(timer);
            done();
          };
          image.src = source;
        }),
    ),
  );
}

export default function App() {
  const [activeEventId, setActiveEventId] = useState(JOURNEY_EVENTS[0].id);
  const event =
    JOURNEY_EVENTS.find((item) => item.id === activeEventId) ?? JOURNEY_EVENTS[0];
  const [phase, setPhase] = useState<ExperiencePhase>("map");
  const [traveling, setTraveling] = useState(false);
  const [progress, setProgress] = useState<EventProgress>(INITIAL_PROGRESS);
  const [stickerTransition, setStickerTransition] =
    useState<StickerTransitionStage>("idle");
  const nextAssets = useRef<Promise<unknown>>(Promise.resolve());
  const transitionTimers = useRef<number[]>([]);
  const travelStartTimer = useRef(0);

  const clearTransitionTimers = () => {
    transitionTimers.current.forEach((timer) => window.clearTimeout(timer));
    transitionTimers.current = [];
  };

  const restartMap = () => {
    clearTransitionTimers();
    window.clearTimeout(travelStartTimer.current);
    setTraveling(false);
    setProgress(INITIAL_PROGRESS);
    setStickerTransition("idle");
    setPhase("map");
    travelStartTimer.current = window.setTimeout(() => setTraveling(true), 850);
  };

  useEffect(() => {
    // Never block the first paint on asset decode — show the map immediately.
    preloadImages([vanPage, journeyVan]);
    travelStartTimer.current = window.setTimeout(() => setTraveling(true), 850);
    return () => {
      window.clearTimeout(travelStartTimer.current);
      clearTransitionTimers();
    };
  }, []);

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
    clearTransitionTimers();
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

  const selectEvent = (id: string) => {
    if (id === activeEventId) return;
    setActiveEventId(id);
    restartMap();
  };

  const screen = useMemo(() => {
    if (phase === "map" || phase === "arrival") {
      return (
        <MindMap
          key={activeEventId}
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
          onSaveForLater={() => {
            setProgress({
              status: "completed",
              completed: true,
              stickerEarned: true,
              stickerPlaced: false,
            });
            setPhase("complete");
          }}
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
  }, [activeEventId, event, phase, stickerTransition, traveling]);

  return (
    <main className="experience-shell" data-progress={progress.status}>
      <div className="experience-stage">
        <div className="experience-controls" aria-label="Event variants">
          <div className="event-chips">
            {JOURNEY_EVENTS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`event-chip${activeEventId === item.id ? " event-chip--active" : ""}`}
                onClick={() => selectEvent(item.id)}
              >
                {item.chipLabel}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="scene-reset"
            aria-label="Reset scene"
            onClick={restartMap}
          >
            <RotateCcw size={18} />
          </button>
        </div>

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
      </div>
    </main>
  );
}
