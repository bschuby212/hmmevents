import { useEffect, useState } from "react";
import { motion } from "motion/react";
import StatusBarsComponent from "@/imports/StatusBars";
import svgPaths from "@/imports/CloseTheDay/svg-wca2msfidm";
import type { JourneyEvent } from "@/app/data/events";

type EventExperienceProps = {
  event: JourneyEvent;
  mode: "event" | "reward";
  onContinue: () => void;
  stickerDeparting?: boolean;
};

export default function EventExperience({
  event,
  mode,
  onContinue,
  stickerDeparting = false,
}: EventExperienceProps) {
  const reward = mode === "reward";
  const [stickerVisible, setStickerVisible] = useState(false);

  useEffect(() => {
    if (!reward) {
      setStickerVisible(false);
      return;
    }
    const timer = window.setTimeout(() => setStickerVisible(true), 420);
    return () => window.clearTimeout(timer);
  }, [reward]);

  return (
    <section className="absolute inset-0 overflow-hidden bg-[#faf8f7]" aria-label={reward ? "Bigfoot sticker reward" : "Bigfoot event"}>
      <motion.div
        className="absolute left-0 w-[393px] h-[861px] overflow-hidden"
        style={{ top: -273, zIndex: reward ? 2 : 1 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reward ? 0.7 : 0.45 }}
      >
        <div
          className="absolute"
          style={reward
            ? { left: -260, top: -122, width: 908, height: 1135 }
            : { left: -29, top: 125, width: 461, height: 819 }}
        >
          <img
            className="absolute inset-0 size-full max-w-none object-cover pointer-events-none"
            src={reward ? event.rewardArtwork : event.eventArtwork}
            alt=""
            draggable={false}
          />
        </div>
        {reward && (
          <div
            className="absolute left-[-8px] top-[252px] w-[408px] h-[609px] blur-[20px]"
            style={{ background: "linear-gradient(to bottom, rgba(40,40,47,0.21) 0%, rgba(27,27,31,0.51) 46.635%, rgba(40,41,47,0.34) 100%)" }}
          />
        )}
      </motion.div>

      {reward && <div className="absolute left-0 right-0 top-0 h-[520px] z-[5] pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0) 100%)" }} />}

      {reward && stickerVisible && (
        <>
          <div className="absolute left-[44.5px] top-[140px] w-[304px] h-[354.35px] rounded-[16px] z-[14]" style={{ backdropFilter: "blur(14px)", background: "rgba(0,0,0,0.28)" }} />
          <div
            className="absolute left-[44.5px] top-[140px] w-[304px] h-[354.35px] z-[15] transition-opacity duration-200"
            style={{ opacity: stickerDeparting ? 0 : 1 }}
          >
            <img className="size-full object-contain pointer-events-none" src={event.rewardSticker} alt="Sasquatch sticker reward" draggable={false} />
          </div>
        </>
      )}

      <div className="absolute inset-0 z-[20]">
        <p className="-translate-x-1/2 absolute left-[196.5px] top-[620px] text-[#063235] text-[22px] text-center font-semibold leading-[1.2] tracking-[-0.5px] whitespace-nowrap">
          {event.title}
        </p>
        <p className="-translate-x-1/2 absolute left-[196.5px] top-[654px] w-[303px] h-[50px] text-[#063235] text-[16px] text-center font-normal leading-[1.4] tracking-[-0.5px]">
          {reward ? event.rewardCopy : event.discoveryCopy}
        </p>
        {reward && (
          <>
            <p className="absolute left-[159px] top-[723px] text-[rgba(6,50,53,0.66)] text-[16px] font-medium whitespace-nowrap">{event.date}</p>
            <div className="absolute left-[130px] top-[720px] w-[23px] h-[24px]">
              <svg className="absolute inset-0 size-full" viewBox="0 0 23 24" fill="none">
                <path d={svgPaths.p3274a400} fill="#6C9F7B" />
                <path d={svgPaths.p1e4cd080} fill="#6C9F7B" fillOpacity=".02" />
                <path d={svgPaths.p15383680} fill="#6CA07A" fillOpacity=".02" />
              </svg>
            </div>
          </>
        )}
        <button type="button" className="absolute left-[36px] top-[780px] w-[321px] h-[48px] rounded-[12px] border-0 bg-[#765cd8] text-white flex items-center justify-center gap-[6px] cursor-pointer" onClick={onContinue}>
          {reward && (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 13V11C3 7.23 3 5.34 4.17 4.17C5.34 3 7.23 3 11 3H12.69C14.32 3 15.14 3 15.87 3.3C16.61 3.61 17.19 4.19 18.34 5.34L18.66 5.66C19.81 6.81 20.39 7.39 20.7 8.13C21 8.86 21 9.68 21 11.31V13C21 16.77 21 18.66 19.83 19.83C18.66 21 16.77 21 13 21H11C7.23 21 5.34 21 4.17 19.83C3 18.66 3 16.77 3 13Z" stroke="white" strokeWidth="1.5" />
              <path d="M15 3.5C15 5.85 15 7.02 15.62 7.83C16.43 9 17.6 9 20.5 9" stroke="white" strokeWidth="1.5" />
            </svg>
          )}
          <span className="text-[14px] leading-[20px] font-bold">{reward ? "Collect Sticker" : "Continue"}</span>
          {!reward && (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12H18.5M13 6S19 10.42 19 12S13 18 13 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>

      <div className={reward ? "absolute inset-x-0 top-0 z-[50] pointer-events-none" : "absolute inset-x-0 top-0 z-[50] pointer-events-none [&_p]:!text-[#1C1C1E] [&_.text-white]:!text-[#1C1C1E]"} style={reward ? undefined : { "--fill-0": "#1C1C1E" } as React.CSSProperties}>
        <StatusBarsComponent />
      </div>
    </section>
  );
}
