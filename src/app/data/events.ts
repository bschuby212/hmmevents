import sasquatchEvent from "@/imports/CloseTheDay-1/e2bd23e39d33f773566dc5e77b34e6ba32aa8619.png";
import sasquatchReward from "@/imports/CloseTheDay/7d9a740afbefdbbf75c48b853fc1a0d85d8151ab.png";
import sasquatchSticker from "@/imports/saswuatch_sticker.png";

export type JourneyEvent = {
  id: string;
  title: string;
  discoveryCopy: string;
  rewardCopy: string;
  eventArtwork: string;
  rewardArtwork: string;
  rewardSticker: string;
  destination: "silver-star";
  date: string;
};

export type EventProgress = {
  status: "undiscovered" | "traveling" | "arrived" | "completed";
  completed: boolean;
  stickerEarned: boolean;
  stickerPlaced: boolean;
};

export const BIGFOOT_EVENT: JourneyEvent = {
  id: "bigfoot",
  title: "Sasquatch Sighting",
  discoveryCopy:
    "Something moves between the trees. Slow down and take a closer look…",
  rewardCopy: "You saw it too, right? You earned the Sasquatch sticker.",
  eventArtwork: sasquatchEvent,
  rewardArtwork: sasquatchReward,
  rewardSticker: sasquatchSticker,
  destination: "silver-star",
  date: "Nov 29, 2025",
};

export const INITIAL_PROGRESS: EventProgress = {
  status: "undiscovered",
  completed: false,
  stickerEarned: false,
  stickerPlaced: false,
};
