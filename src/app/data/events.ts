import sasquatchEvent from "@/imports/CloseTheDay-1/e2bd23e39d33f773566dc5e77b34e6ba32aa8619.png";
import sasquatchReward from "@/imports/CloseTheDay/7d9a740afbefdbbf75c48b853fc1a0d85d8151ab.png";
import sasquatchSticker from "@/imports/saswuatch_sticker.png";
import sasquatchStickerArtwork from "@/assets/stickers/bigfoot.png";
import dynsteryScene from "@/imports/CloseTheDay-3/bb30095c4684d0e28a22583fcb2b674724515ddb.png";
import dynsterySticker from "@/imports/dysntery.png";
import strandedScene from "@/imports/CloseTheDay-4/53d300dbc7272b8264e43e2a91b9daa01b66a922.png";
import strandedSticker from "@/imports/stranded.png";

export type ArtworkFrame = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type JourneyEvent = {
  id: string;
  chipLabel: string;
  title: string;
  discoveryCopy: string;
  rewardCopy: string;
  collectLabel: string;
  placementTitle: string;
  placementCopy: string;
  placeLabel: string;
  eventArtwork: string;
  rewardArtwork: string;
  rewardSticker: string;
  stickerArtwork: string;
  eventFrame: ArtworkFrame;
  rewardFrame: ArtworkFrame;
  destination: "silver-star";
  date: string;
};

export type EventProgress = {
  status: "undiscovered" | "traveling" | "arrived" | "completed";
  completed: boolean;
  stickerEarned: boolean;
  stickerPlaced: boolean;
};

export const JOURNEY_EVENTS: JourneyEvent[] = [
  {
    id: "sasquatch",
    chipLabel: "Sasquatch",
    title: "Sasquatch Sighting",
    discoveryCopy:
      "Something moves between the trees. Slow down and take a closer look…",
    rewardCopy: "You saw it too, right? You earned the Sasquatch sticker.",
    collectLabel: "Collect Sasquatch",
    placementTitle: "Place Your Sasquatch",
    placementCopy:
      "Drag your van to frame the sighting, then tap where Sasquatch belongs.",
    placeLabel: "Place Sasquatch",
    eventArtwork: sasquatchEvent,
    rewardArtwork: sasquatchReward,
    rewardSticker: sasquatchSticker,
    stickerArtwork: sasquatchStickerArtwork,
    eventFrame: { left: -29, top: 125, width: 461, height: 819 },
    rewardFrame: { left: -260, top: -122, width: 908, height: 1135 },
    destination: "silver-star",
    date: "Nov 29, 2025",
  },
  {
    id: "dynstery",
    chipLabel: "Dynstery",
    title: "Unexpected Detour",
    discoveryCopy:
      "That last roadside meal seemed like a great idea at the time.",
    rewardCopy:
      "You made it through. Some road trip stories are better left untold.",
    collectLabel: "Collect Sticker",
    placementTitle: "Place Your Sticker",
    placementCopy:
      "Drag your van to adjust the view, then tap where this detour belongs.",
    placeLabel: "Place Sticker",
    eventArtwork: dynsteryScene,
    rewardArtwork: dynsteryScene,
    rewardSticker: dynsterySticker,
    stickerArtwork: dynsterySticker,
    eventFrame: { left: -52, top: 80, width: 497, height: 884 },
    rewardFrame: { left: -52, top: 80, width: 497, height: 884 },
    destination: "silver-star",
    date: "Nov 29, 2025",
  },
  {
    id: "stranded",
    chipLabel: "Stranded",
    title: "Someone Stranded",
    discoveryCopy:
      "This wasn't the break you had planned, but sometimes you just have to roll with it.",
    rewardCopy:
      "Sometimes, everyone needs a little help to navigate through life's challenges.",
    collectLabel: "Collect Sticker",
    placementTitle: "Place Your Sticker",
    placementCopy:
      "Drag your van to adjust the view, then tap where this helper belongs.",
    placeLabel: "Place Sticker",
    eventArtwork: strandedScene,
    rewardArtwork: strandedScene,
    rewardSticker: strandedSticker,
    stickerArtwork: strandedSticker,
    eventFrame: { left: -39, top: 210, width: 433, height: 651 },
    rewardFrame: { left: -39, top: 210, width: 433, height: 651 },
    destination: "silver-star",
    date: "Nov 29, 2025",
  },
];

export const BIGFOOT_EVENT = JOURNEY_EVENTS[0];

export const INITIAL_PROGRESS: EventProgress = {
  status: "undiscovered",
  completed: false,
  stickerEarned: false,
  stickerPlaced: false,
};
