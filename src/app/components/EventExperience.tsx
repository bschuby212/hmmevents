import { motion } from "motion/react";
import StatusBarsComponent from "@/imports/StatusBars";
import type { JourneyEvent } from "@/app/data/events";

type EventExperienceProps = {
  event: JourneyEvent;
  mode: "event" | "reward";
  onContinue: () => void;
};

function ContinueButton({
  reward,
  onClick,
}: {
  reward: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button" className="event-continue" onClick={onClick}>
      {reward && (
        <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M3 13V11C3 7.23 3 5.34 4.17 4.17C5.34 3 7.23 3 11 3H12.69C14.32 3 15.14 3 15.87 3.3C16.61 3.61 17.19 4.19 18.34 5.34L18.66 5.66C19.81 6.81 20.39 7.39 20.7 8.13C21 8.86 21 9.68 21 11.31V13C21 16.77 21 18.66 19.83 19.83C18.66 21 16.77 21 13 21H11C7.23 21 5.34 21 4.17 19.83C3 18.66 3 16.77 3 13Z" stroke="currentColor" strokeWidth="1.5" />
          <path d="M15 3.5C15 5.85 15 7.02 15.62 7.83C16.43 9 17.6 9 20.5 9" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )}
      <span>{reward ? "Continue" : "Continue"}</span>
      {!reward && <span className="event-continue__arrow" aria-hidden="true">→</span>}
    </button>
  );
}

export default function EventExperience({
  event,
  mode,
  onContinue,
}: EventExperienceProps) {
  const reward = mode === "reward";

  return (
    <section className={`event-screen event-screen--${mode}`} aria-label={reward ? "Bigfoot sticker reward" : "Bigfoot event"}>
      <motion.div
        className="event-screen__art"
        initial={{ opacity: 0, scale: 1.015 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        <img
          className={reward ? "event-screen__image event-screen__image--reward" : "event-screen__image event-screen__image--discovery"}
          src={reward ? event.rewardArtwork : event.eventArtwork}
          alt=""
          draggable={false}
        />
        {reward && <div className="event-screen__shade" />}
      </motion.div>

      {reward && (
        <motion.div
          className="reward-sticker"
          initial={{ opacity: 0, scale: 0.74, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 18, delay: 0.18 }}
        >
          <div className="reward-sticker__bloom" />
          <img src={event.rewardSticker} alt="Sasquatch sticker reward" draggable={false} />
        </motion.div>
      )}

      <div className="event-screen__panel">
        <h1>{event.title}</h1>
        <p>{reward ? event.rewardCopy : event.discoveryCopy}</p>
        {reward && <div className="event-screen__date">{event.date}</div>}
        <ContinueButton reward={reward} onClick={onContinue} />
      </div>

      <div className={reward ? "event-status event-status--light" : "event-status"}>
        <StatusBarsComponent />
      </div>
    </section>
  );
}
