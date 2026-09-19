import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { RotateCcw } from "lucide-react";

// Screen 1 backgrounds
import s1SasquatchImg from "@/imports/CloseTheDay-1/e2bd23e39d33f773566dc5e77b34e6ba32aa8619.png";
import s1DynsteryImg from "@/imports/CloseTheDay-3/bb30095c4684d0e28a22583fcb2b674724515ddb.png";
import s1StrandedImg from "@/imports/CloseTheDay-4/53d300dbc7272b8264e43e2a91b9daa01b66a922.png";

// Screen 2 backgrounds
import s2ForestImg from "@/imports/CloseTheDay/7d9a740afbefdbbf75c48b853fc1a0d85d8151ab.png";
// Dynstery + Stranded reuse their screen 1 scenes for screen 2

// Sticker PNGs
import sasquatchStickerImg from "@/imports/saswuatch_sticker.png";
import dynsteryStickerImg from "@/imports/dysntery.png";
import strandedStickerImg from "@/imports/stranded.png";

// Shared SVG paths + status bar
import svgPaths2 from "@/imports/CloseTheDay/svg-wca2msfidm";
import StatusBarsComponent from "@/imports/StatusBars/index";

interface Screen1ImgPos {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface EventConfig {
  id: number;
  chipLabel: string;
  screen1Title: string;
  screen1Body: string;
  screen1Img: string;
  screen1ImgPos: Screen1ImgPos;
  screen2Img: string;
  screen2ImgPos: Screen1ImgPos;
  screen2Title: string;
  screen2Body: string;
  stickerSrc: string;
  date: string;
}

const EVENTS: EventConfig[] = [
  {
    id: 1,
    chipLabel: "Sasquatch",
    screen1Title: "Sasquatch Sighting",
    screen1Body: "Something moves between the trees. Slow down and take a closer look…",
    screen1Img: s1SasquatchImg,
    screen1ImgPos: { left: -29, top: 125, width: 461, height: 819 },
    screen2Img: s2ForestImg,
    screen2ImgPos: { left: -260, top: -122, width: 908, height: 1135 },
    screen2Title: "Sasquatch Sighting",
    screen2Body: "You saw it too, right? You earned the Sasquatch sticker.",
    stickerSrc: sasquatchStickerImg,
    date: "Nov 29, 2025",
  },
  {
    id: 2,
    chipLabel: "Dynstery",
    screen1Title: "Unexpected Detour",
    screen1Body: "That last roadside meal seemed like a great idea at the time.",
    screen1Img: s1DynsteryImg,
    screen1ImgPos: { left: -52, top: 80, width: 497, height: 884 },
    screen2Img: s1DynsteryImg,
    screen2ImgPos: { left: -52, top: 80, width: 497, height: 884 },
    screen2Title: "Unexpected Detour",
    screen2Body: "You made it through. Some road trip stories are better left untold.",
    stickerSrc: dynsteryStickerImg,
    date: "Nov 29, 2025",
  },
  {
    id: 3,
    chipLabel: "Stranded",
    screen1Title: "Someone Stranded",
    screen1Body: "This wasn't the break you had planned, but sometimes you just have to roll with it.",
    screen1Img: s1StrandedImg,
    screen1ImgPos: { left: -39, top: 210, width: 433, height: 651 },
    screen2Img: s1StrandedImg,
    screen2ImgPos: { left: -39, top: 210, width: 433, height: 651 },
    screen2Title: "Someone Stranded",
    screen2Body: "Sometimes, everyone needs a little help to navigate through life's challenges.",
    stickerSrc: strandedStickerImg,
    date: "Nov 29, 2025",
  },
];

function StickerCard({ src }: { src: string }) {
  return (
    <div className="size-full">
      <img
        alt="Event sticker"
        className="size-full object-contain pointer-events-none"
        src={src}
      />
    </div>
  );
}

function StickerFrameTab() {
  return (
    <div className="absolute h-[72.2px] left-0 top-0 w-[304px]">
      <svg
        className="absolute block inset-0 size-full"
        fill="none"
        height="72.2002"
        preserveAspectRatio="none"
        viewBox="0 0 304 72.2002"
        width="304"
      >
        <path d={svgPaths2.pe928100} fill="#125829" />
        <rect fill="url(#p0_sticker_tab)" height="1.80501" rx="0.902505" width="34.1775" x="10.7914" y="61.3687" />
        <rect fill="url(#p1_sticker_tab)" height="1.80501" rx="0.902505" width="34.1775" x="259.031" y="61.3687" />
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="p0_sticker_tab" x1="7.53641" x2="49.0377" y1="62.2712" y2="62.2712">
            <stop stopColor="#CACFC2" />
            <stop offset="0.495192" stopColor="#F4F6F2" stopOpacity="0.77" />
            <stop offset="1" stopColor="#CACFC2" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="p1_sticker_tab" x1="255.776" x2="297.277" y1="62.2712" y2="62.2712">
            <stop stopColor="#CACFC2" />
            <stop offset="0.495192" stopColor="#F4F6F2" stopOpacity="0.77" />
            <stop offset="1" stopColor="#CACFC2" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-[20%_85.58%_45%_4.73%]">
        <div className="absolute inset-[-1.43%_-1.23%_-1.43%_-1.22%]">
          <svg className="block size-full" fill="none" height="25.992" preserveAspectRatio="none" viewBox="0 0 30.1738 25.992" width="30.1738">
            <path d={svgPaths2.p3f8fe500} fill="white" opacity="0.85" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function LeafIcon() {
  return (
    <div className="absolute h-[24px] left-[130px] top-[720px] w-[23px]">
      <svg className="absolute block inset-0 size-full" fill="none" height="24" preserveAspectRatio="none" viewBox="0 0 23 24" width="23">
        <path d={svgPaths2.p3274a400} fill="#6C9F7B" />
        <path d={svgPaths2.p1e4cd080} fill="#6C9F7B" fillOpacity="0.0196078" />
        <path d={svgPaths2.p15383680} fill="#6CA07A" fillOpacity="0.0196078" />
      </svg>
    </div>
  );
}

export default function App() {
  const [activeEventId, setActiveEventId] = useState(1);
  const [revealed, setRevealed] = useState(false);
  const [stickerVisible, setStickerVisible] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const event = EVENTS.find(e => e.id === activeEventId)!;

  useEffect(() => {
    if (revealed) {
      timerRef.current = setTimeout(() => setStickerVisible(true), 420);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
      setStickerVisible(false);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [revealed]);

  const handleReset = () => {
    setIsResetting(true);
    setRevealed(false);
    setStickerVisible(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setIsResetting(false)));
  };

  const handleChipSelect = (id: number) => {
    if (id === activeEventId) return;
    handleReset();
    setActiveEventId(id);
  };

  const tween = (duration: number, delay = 0) =>
    isResetting ? { duration: 0 } : { type: "tween" as const, ease: "easeInOut", duration, delay };

  const { left, top, width, height } = event.screen1ImgPos;
  const { left: l2, top: t2, width: w2, height: h2 } = event.screen2ImgPos;

  return (
    <div className="size-full flex flex-col items-center justify-center bg-[#f6f6f6] p-8 gap-6 overflow-hidden" style={{ height: "100dvh" }}>

      {/* Filter chips */}
      <div className="flex gap-2">
        {EVENTS.map(e => (
          <button
            key={e.id}
            onClick={() => handleChipSelect(e.id)}
            className={[
              "px-4 py-1.5 rounded-full text-[13px] font-semibold transition-colors",
              activeEventId === e.id
                ? "bg-[#1a1a1a] text-white"
                : "bg-white/80 text-zinc-500 hover:text-zinc-800 border border-zinc-200",
            ].join(" ")}
          >
            {e.chipLabel}
          </button>
        ))}
      </div>

      {/* Outer shell */}
      <div
        className="relative shrink-0"
        style={{
          zoom: 0.68,
          width: 393 + 28,
          height: 852 + 28,
          borderRadius: 62,
          background: "#1a1a1a",
        }}
      >
        <div className="absolute rounded-l-sm" style={{ left: -5, top: 132, width: 5, height: 34, background: "#1a1a1a" }} />
        <div className="absolute rounded-l-sm" style={{ left: -5, top: 180, width: 5, height: 34, background: "#1a1a1a" }} />
        <div className="absolute rounded-l-sm" style={{ left: -5, top: 88, width: 5, height: 26, background: "#1a1a1a" }} />
        <div className="absolute rounded-r-sm" style={{ right: -5, top: 158, width: 5, height: 62, background: "#1a1a1a" }} />

        {/* Screen inset */}
        <div
          className="relative overflow-clip bg-[#faf8f7]"
          style={{
            margin: 14,
            width: 393,
            height: 852,
            borderRadius: 47,
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
          }}
        >

        {/* ── Layer 1: Screen 1 forest ── */}
        <motion.div
          className="absolute left-0 w-[393px] overflow-clip"
          style={{ height: 861, top: -273, zIndex: 1 }}
          animate={{ opacity: revealed ? 0 : 1 }}
          transition={tween(0.6)}
        >
          <div
            className="absolute"
            style={{ left, top, width, height }}
          >
            <img
              alt=""
              className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
              src={event.screen1Img}
            />
          </div>
        </motion.div>

        {/* ── Layer 2: Screen 2 forest (shared) ── */}
        <motion.div
          className="absolute left-0 w-[393px] overflow-clip"
          style={{ height: 861, top: -273, zIndex: 2 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: revealed ? 1 : 0 }}
          transition={tween(0.7, 0.1)}
        >
          <div className="absolute" style={{ left: l2, top: t2, width: w2, height: h2 }}>
            <img
              alt=""
              className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
              src={event.screen2Img}
            />
          </div>
          <div
            className="absolute left-[-8px] w-[408px] h-[609px] blur-[20px]"
            style={{
              top: 252,
              background: "linear-gradient(to bottom, rgba(40,40,47,0.21) 0%, rgba(27,27,31,0.51) 46.635%, rgba(40,41,47,0.34) 100%)",
            }}
          />
        </motion.div>

        {/* ── Layer 3: Dark overlay ── */}
        <motion.div
          className="absolute left-0 right-0 top-0 pointer-events-none"
          style={{
            zIndex: 5,
            height: 520,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.0) 100%)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: revealed ? 1 : 0 }}
          transition={tween(0.55)}
        />

        {/* ── Layer 4a: Blur bloom ── */}
        {stickerVisible && (
          <div
            className="absolute rounded-[16px]"
            style={{
              left: (393 - 304) / 2,
              top: 140,
              width: 304,
              height: 354.35,
              zIndex: 14,
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              background: "rgba(0,0,0,0.28)",
            }}
          />
        )}

        {/* ── Layer 4b: Sticker ── */}
        {stickerVisible && (
          <div
            className="absolute"
            style={{
              left: (393 - 304) / 2,
              top: 140,
              width: 304,
              height: 354.35,
              zIndex: 15,
            }}
          >
            <StickerCard src={event.stickerSrc} />
          </div>
        )}

        {/* ── Layer 5a: Screen 1 bottom content ── */}
        <motion.div
          className="absolute inset-0"
          style={{ zIndex: 20 }}
          animate={{ opacity: revealed ? 0 : 1 }}
          transition={tween(0.4)}
        >
          <p
            className="-translate-x-1/2 absolute leading-[1.2] left-[196.5px] text-[#063235] text-[22px] text-center top-[620px] tracking-[-0.5px] whitespace-nowrap"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
          >
            {event.screen1Title}
          </p>
          <p
            className="-translate-x-1/2 absolute h-[50px] leading-[1.4] left-[196.5px] text-[#063235] text-[16px] text-center top-[654px] tracking-[-0.5px] w-[303px]"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
          >
            {event.screen1Body}
          </p>
          <button
            className="-translate-x-1/2 absolute left-1/2 top-[780px] w-[321px] h-[48px] rounded-[12px] overflow-clip bg-[#765cd8] flex items-center justify-center gap-[6px] cursor-pointer"
            onClick={() => setRevealed(true)}
          >
            <span className="font-bold text-white text-[14px] leading-[20px] whitespace-nowrap" style={{ fontFamily: "Inter, sans-serif" }}>
              Continue
            </span>
            <div className="shrink-0 flex items-center justify-center">
              <div style={{ transform: "rotate(180deg) scaleY(-1)" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M5.5 12.002H19" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M10.9999 18.002C10.9999 18.002 4.99998 13.583 4.99997 12.0019C4.99996 10.4208 11 6.00195 11 6.00195" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </button>
        </motion.div>

        {/* ── Layer 5b: Screen 2 bottom content ── */}
        {revealed && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 21 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={tween(0.5, 0.1)}
          >
            <p
              className="-translate-x-1/2 absolute leading-[1.2] left-[196.5px] text-[#063235] text-[22px] text-center top-[620px] tracking-[-0.5px] whitespace-nowrap"
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
            >
              {event.screen2Title}
            </p>
            <p
              className="-translate-x-1/2 absolute h-[50px] leading-[1.4] left-[196.5px] text-[#063235] text-[16px] text-center top-[654px] tracking-[-0.5px] w-[303px]"
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
            >
              {event.screen2Body}
            </p>
            <p
              className="absolute leading-[normal] left-[159px] text-[rgba(6,50,53,0.66)] text-[16px] top-[723px] whitespace-nowrap"
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
            >
              {event.date}
            </p>
            <LeafIcon />
            <div className="-translate-x-1/2 absolute left-1/2 top-[780px] w-[321px] h-[48px] rounded-[12px] overflow-clip bg-[#765cd8] flex gap-[6px] items-center justify-center pointer-events-auto cursor-pointer">
              <svg className="shrink-0" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 13V11C3 7.22876 3 5.34315 4.17157 4.17157C5.34315 3 7.22876 3 11 3H12.6863C14.3213 3 15.1388 3 15.8739 3.30449C16.609 3.60897 17.1871 4.18704 18.3432 5.34318L18.6569 5.65686C19.813 6.81298 20.391 7.39104 20.6955 8.12612C21 8.8612 21 9.67869 21 11.3137V13C21 16.7712 21 18.6569 19.8284 19.8284C18.6569 21 16.7712 21 13 21H11C7.22876 21 5.34315 21 4.17157 19.8284C3 18.6569 3 16.7712 3 13Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15 3.5C15 5.84558 15 7.01836 15.6199 7.82628C15.7795 8.03428 15.9657 8.22046 16.1737 8.38006C16.9816 9 18.1544 9 20.5001 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14.5 16C13.8152 16.6257 12.9459 17 12 17C11.0541 17 10.1848 16.6257 9.5 16M8.25 12.125V12.25M15.75 12.1257V12.2507M8.5 12.25C8.5 12.3881 8.38807 12.5 8.25 12.5C8.11193 12.5 8 12.3881 8 12.25C8 12.1119 8.11193 12 8.25 12C8.38807 12 8.5 12.1119 8.5 12.25ZM16 12.2507C16 12.3887 15.8881 12.5007 15.75 12.5007C15.6119 12.5007 15.5 12.3887 15.5 12.2507C15.5 12.1126 15.6119 12.0007 15.75 12.0007C15.8881 12.0007 16 12.1126 16 12.2507Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="font-bold text-white text-[14px] leading-[20px] whitespace-nowrap" style={{ fontFamily: "Inter, sans-serif" }}>
                Collect Sticker
              </span>
            </div>
          </motion.div>
        )}

        {/* ── Status bar: black Screen 1, white Screen 2 ── */}
        <motion.div
          className="absolute inset-x-0 top-0 pointer-events-none [&_p]:!text-[#1C1C1E] [&_.text-white]:!text-[#1C1C1E]"
          style={{ zIndex: 50, '--fill-0': '#1C1C1E' } as React.CSSProperties}
          animate={{ opacity: revealed ? 0 : 1 }}
          transition={tween(0.3)}
        >
          <StatusBarsComponent />
        </motion.div>
        <motion.div
          className="absolute inset-x-0 top-0 pointer-events-none"
          style={{ zIndex: 50 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: revealed ? 1 : 0 }}
          transition={tween(0.3)}
        >
          <StatusBarsComponent />
        </motion.div>
        </div>
      </div>

      {/* Reset button */}
      <button
        onClick={handleReset}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-white/70 hover:bg-white text-zinc-500 hover:text-zinc-800 shadow-sm"
        aria-label="Reset"
      >
        <RotateCcw size={18} />
      </button>
    </div>
  );
}
