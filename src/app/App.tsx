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
import mapTopography from "@/assets/map/figma/topography.svg";
import mapVan from "@/assets/map/figma/van.png";
import mapWater from "@/assets/map/figma/water.svg";
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
  const shellRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

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
    preloadImages([mapTopography, mapWater, mapVan]);
    travelStartTimer.current = window.setTimeout(() => setTraveling(true), 850);
    return () => {
      window.clearTimeout(travelStartTimer.current);
      clearTransitionTimers();
    };
  }, []);

  useEffect(() => {
    const shell = shellRef.current;
    const frame = frameRef.current;
    const stage = stageRef.current;
    if (!shell || !frame || !stage) return;

    const clearInlineBox = (el: HTMLElement | null) => {
      if (!el) return;
      el.style.width = "";
      el.style.height = "";
      el.style.minWidth = "";
      el.style.minHeight = "";
    };

    const fitStage = () => {
      const pad = 16;
      const viewportW = Math.max(
        window.visualViewport?.width || 0,
        window.innerWidth || 0,
        1,
      );
      const viewportH = Math.max(
        window.visualViewport?.height || 0,
        window.innerHeight || 0,
        1,
      );

      // Stale inline sizes from a collapsed first paint will block recovery when
      // the embed grows — clear them once the viewport is usable.
      if (viewportW >= 64 && viewportH >= 64) {
        clearInlineBox(document.documentElement);
        clearInlineBox(document.body);
        clearInlineBox(document.getElementById("root"));
        clearInlineBox(shell);
      } else if (shell.clientHeight < 64 || shell.clientWidth < 64) {
        shell.style.minWidth = `${viewportW}px`;
        shell.style.width = `${viewportW}px`;
        shell.style.minHeight = `${viewportH}px`;
        shell.style.height = `${viewportH}px`;
      }

      const availableWidth = Math.max(
        (shell.clientWidth || viewportW) - pad,
        1,
      );
      const availableHeight = Math.max(
        (shell.clientHeight || viewportH) - pad,
        1,
      );
      const naturalWidth = stage.offsetWidth || 421;
      const naturalHeight = stage.offsetHeight || 938;
      const rawScale = Math.min(
        availableWidth / naturalWidth,
        availableHeight / naturalHeight,
      );
      // Never replace a tiny fit with scale=1 — that overflows overflow:hidden
      // and paints a blank shell (white screen).
      const scale =
        Number.isFinite(rawScale) && rawScale > 0 ? rawScale : 1;
      stage.style.setProperty("--stage-scale", String(scale));
      frame.style.width = `${naturalWidth * scale}px`;
      frame.style.height = `${naturalHeight * scale}px`;
    };

    fitStage();
    const observer = new ResizeObserver(fitStage);
    observer.observe(shell);
    window.addEventListener("resize", fitStage);
    window.visualViewport?.addEventListener("resize", fitStage);
    window.addEventListener("orientationchange", fitStage);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", fitStage);
      window.visualViewport?.removeEventListener("resize", fitStage);
      window.removeEventListener("orientationchange", fitStage);
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
  }, [event, phase, stickerTransition, traveling]);

  return (
    <main ref={shellRef} className="experience-shell" data-progress={progress.status}>
      <div ref={frameRef} className="experience-stage-frame">
        <div ref={stageRef} className="experience-stage">
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
      </div>
    </main>
  );
}
