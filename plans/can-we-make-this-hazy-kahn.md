# Plan: Event Filter Chips

## Context
The prototype currently hardcodes one event (Sasquatch Sighting). The request is to add three filter chips outside the iPhone frame so the user can switch between three event variants — Sasquatch (current), Dynstery, and Stranded — without redesigning any of the existing two-screen flow. Switching a chip should instantly reset to Screen 1 and swap in that event's content (images, title, description, sticker, date). No new screens, no new transition logic — just a data swap.

Imagery for events 2 and 3 hasn't been uploaded yet, so those slots will use the existing forest images as placeholders, swapped out once the user provides assets.

## File to modify
`src/app/App.tsx` only.

---

## Data layer

Define a typed `EventConfig` interface and an `EVENTS` array near the top of the file (after imports):

```ts
interface EventConfig {
  id: number;
  chipLabel: string;
  screen1Title: string;
  screen1Body: string;
  screen1Img: string;   // Layer 1 background
  screen2Img: string;   // Layer 2 background
  screen2Title: string;
  screen2Body: string;
  stickerImg: string;
  date: string;
}

const EVENTS: EventConfig[] = [
  {
    id: 1,
    chipLabel: "Sasquatch",
    screen1Title: "Sasquatch Sighting",
    screen1Body: "Something moves between the trees. Slow down and take a closer look…",
    screen1Img: s1ForestImg,
    screen2Img: s2ForestImg,
    screen2Title: "Sasquatch Sighting",
    screen2Body: "You saw it too, right? You earned the Sasquatch sticker.",
    stickerImg: hikeImg,
    date: "Nov 29, 2025",
  },
  {
    id: 2,
    chipLabel: "Dynstery",
    screen1Title: "Dynstery",
    screen1Body: "Something strange is unfolding. Keep your eyes open…",
    screen1Img: s1ForestImg,   // placeholder until upload
    screen2Img: s2ForestImg,   // placeholder until upload
    screen2Title: "Dynstery",
    screen2Body: "You uncovered it. You earned the Dynstery sticker.",
    stickerImg: hikeImg,       // placeholder until upload
    date: "Nov 29, 2025",
  },
  {
    id: 3,
    chipLabel: "Stranded",
    screen1Title: "Stranded",
    screen1Body: "No signal. No map. Just the trail ahead…",
    screen1Img: s1ForestImg,   // placeholder until upload
    screen2Img: s2ForestImg,   // placeholder until upload
    screen2Title: "Stranded",
    screen2Body: "You made it through. You earned the Stranded sticker.",
    stickerImg: hikeImg,       // placeholder until upload
    date: "Nov 29, 2025",
  },
];
```

---

## State

Add one new state variable inside `App`:

```ts
const [activeEventId, setActiveEventId] = useState(1);
```

Derive the current event data once at the top of `App`:

```ts
const event = EVENTS.find(e => e.id === activeEventId)!;
```

---

## Chip switcher handler

```ts
const handleChipSelect = (id: number) => {
  if (id === activeEventId) return;
  handleReset();           // instant snap-back (isResetting double-rAF)
  setActiveEventId(id);
};
```

Note: `handleReset` already sets `isResetting`, `setRevealed(false)`, and `setStickerVisible(false)`. Calling it before `setActiveEventId` guarantees the phone resets with zero-duration transitions before the new content swaps in.

---

## Chip UI

Add a chip row above the iPhone outer shell div, inside the existing outer `flex flex-col items-center` container:

```tsx
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
```

---

## Content wiring

Replace every hardcoded event-specific string/image with `event.*` references:

| Layer | Current hardcode | Replace with |
|---|---|---|
| Layer 1 `<img src>` | `s1ForestImg` | `event.screen1Img` |
| Layer 2 `<img src>` | `s2ForestImg` | `event.screen2Img` |
| Layer 4b `<StickerCard>` | `hikeImg` (inside component) | pass `stickerImg` prop |
| Layer 5a title | `"Sasquatch Sighting"` | `event.screen1Title` |
| Layer 5a body | hardcoded string | `event.screen1Body` |
| Layer 5b title | `"Sasquatch Sighting"` | `event.screen2Title` |
| Layer 5b body | hardcoded string | `event.screen2Body` |
| Layer 5b date | `"Nov 29, 2025"` | `event.date` |

`StickerCard` needs a `src` prop:
```tsx
function StickerCard({ src }: { src: string }) { ... }
// call: <StickerCard src={event.stickerImg} />
```

---

## Verification
1. Three chips render above the iPhone frame; Sasquatch starts active (filled dark)
2. Clicking Dynstery or Stranded: phone instantly snaps back to Screen 1 with the new event's text and placeholder backgrounds
3. Tapping Continue on any event plays the full two-screen transition with that event's sticker
4. Reset button still works for all three events
5. No layout or spacing changes inside the iPhone mockup

---

# (Archived) Plan: Fix Dark Overlay Weight + Button Icon Distortion

## Context
Two visual issues remain in `src/app/App.tsx`:

1. **Dark overlay "goes too far"** — The current gradient (`rgba(0,0,0,0.45) 55%, transparent 100%` at `height: 700`) fades too gradually. The transparent tail reaches y=700, diffusing the overlay's visual weight and letting it feel washed-out. The reference image shows a dense, heavy dark zone covering the upper forest with authority, stopping cleanly before the sticker card.

2. **Button icon distortion** — The Continue button has two SVG paths (a manual horizontal line + a Figma chevron). The Figma source for Button-2 (`svg-d1ggwl5qce.ts`) only exports the chevron — the line was added manually and isn't in the original design. The Collect Sticker icon includes smiley dot-eye sub-paths (`M8.25 12.125V12.25`, etc.) that are 0.125px tall before stroke expansion, creating noisy micro-artifacts at button size.

## File to modify
`src/app/App.tsx` only.

---

## Fix 1 — Dark overlay

**Current (Layer 3, ~line 215):**
```
height: 700,
background: "linear-gradient(to bottom, rgba(0,0,0,0.45) 55%, transparent 100%)",
```

**Change to:**
```
height: 620,
background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.0) 100%)",
```

Rationale: height 620 ends exactly at the white panel boundary. Flat solid opacity 0→60% gives the visual weight the reference shows. The fade compresses to the final 40% (≈248px), producing a tight vignette tail rather than a long diffuse fade.

---

## Fix 2 — Continue button icon

Remove the horizontal line path — keep only the chevron:

**Remove:**
```jsx
<path d="M18.5 12H4.99997" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
```

The lone `>` chevron matches the Figma source.

---

## Fix 3 — Collect Sticker button icon

Replace the 3-path smiley SVG with a clean 2-path document+fold icon (drop the smiley sub-paths which create noise at 24px):

```jsx
<svg className="shrink-0" width="22" height="22" viewBox="0 0 24 24" fill="none">
  <path d="M3 13V11C3 7.22876 3 5.34315 4.17157 4.17157C5.34315 3 7.22876 3 11 3H12.6863C14.3213 3 15.1388 3 15.8739 3.30449C16.609 3.60897 17.1871 4.18704 18.3432 5.34318L18.6569 5.65686C19.813 6.81298 20.391 7.39104 20.6955 8.12612C21 8.8612 21 9.67869 21 11.3137V13C21 16.7712 21 18.6569 19.8284 19.8284C18.6569 21 16.7712 21 13 21H11C7.22876 21 5.34315 21 4.17157 19.8284C3 18.6569 3 16.7712 3 13Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  <path d="M15 3.5C15 5.84558 15 7.01836 15.6199 7.82628C15.7795 8.03428 15.9657 8.22046 16.1737 8.38006C16.9816 9 18.1544 9 20.5001 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
</svg>
```

---

## Verification
1. After Continue tap: dense dark band through top ~60% of forest, fades cleanly to transparent by y=620 with zero bleed into white panel
2. Continue button shows a single `>` chevron only
3. Collect Sticker button shows a clean folded-document icon without smiley noise
4. Reset snaps back instantly with no animation

---

# (Archived) Previous Plan: Fix Dark Overlay Height

## Context
The dark overlay (Layer 3) is set to `height: 620` but the white bottom panel visually begins ~40px earlier. The gray band bleeds into the white section above "Sasquatch Sighting".

## Change
`src/app/App.tsx` Layer 3 dark overlay: `height: 620` → `height: 580`

---

# Plan: Soften Sticker Animation + Swap to White Status Bar

## Context
Two changes requested:
1. The sticker springs in too fast/violently — spring stiffness (320) is still too high, making the entrance feel abrupt rather than satisfying.
2. The current status bar uses black icons/text, which doesn't read against the dark forest. The Figma import at `src/imports/StatusBars/index.tsx` provides the correct white-icon version.

## File to Modify
`src/app/App.tsx` only.

---

## Fix 1 — Premium sticker entrance choreography

Premium iOS animations (Duolingo streaks, Apple Fitness rings, Things 3) share a recipe: a single clean overshoot (~8–12%), tight choreography between layers, and near-instant opacity so the element never feels like it's fading in — it materialises.

### Spring values
**Sticker card (Layer 4b):**
- `initial: { scale: 0.05, rotate: -12, opacity: 0 }` — start tiny so it feels like it erupts from nothing
- `scale + rotate: { type: "spring", stiffness: 240, damping: 16, mass: 1, delay: 0.45 }` — stiffness 240 + damping 16 gives ~8% controlled overshoot then a single clean settle; `mass: 1` keeps it feeling physical
- `opacity: { duration: 0.08, delay: 0.45 }` — near-instant appearance so the spring motion is fully visible from frame 1

**Bloom div (Layer 4a):**
- Same spring values but `delay: 0.42` — arrives 30ms before the sticker so the dark stage is already "lit" when the sticker erupts
- `initial: { scale: 0.05, opacity: 0 }` to match

### Dark overlay timing
- `duration: 1.25, times: [0, 0.33, 1]` — peaks at 33% (≈0.41s), which is exactly when the bloom appears; then gracefully lifts as the sticker settles

### Forest cross-fade
Keep current values (0.75s fade-out, 0.8s fade-in with 0.18s delay) — they're already well-paced.

---

## Fix 2 — White status bar

**Current:** App.tsx defines its own `StatusBar` component using black SVG paths and `text-black` for the time. This is the first component defined in the file (lines 11–83).

**Change:**
1. Add import: `import StatusBarsComponent from "@/imports/StatusBars/index";`
2. Remove the existing `TrueDepthCamera`, `Camera`, `FaceTimeCamera`, and `StatusBar` function components from App.tsx entirely.
3. Replace `<StatusBar />` at the bottom of the screen inset with `<StatusBarsComponent />`, wrapped in the same absolute-positioned container that already positions it at `top-0, left-0, zIndex: 50`.

The Figma component already includes the Dynamic Island, time, signal, wifi, and battery icons — all in white (`var(--fill-0, white)`). The battery "70" text uses `text-black` which is correct (it renders inside the white battery outline).

---

## Verification
1. Status bar shows white time, white signal/wifi/battery icons against the forest background
2. Tapping "Continue" — sticker floats in smoothly over ~0.9–1.1s with no jarring snap
3. Reset button returns to Screen 1 cleanly

---

# Previous Plan: Fix Blur Bloom, Remove Drop Shadow, Swap Buttons

## Context
Three issues to fix in `src/app/App.tsx`:

1. **Blur bloom misaligned** — The `backdrop-filter: blur(14px)` div (Layer 4a, zIndex 14) is positioned/sized slightly differently from the sticker card and has `borderRadius: 28px`, making it look like a random frosted blob floating behind just the badge circle rather than covering the full PNG card footprint. It needs to exactly match the sticker card's position and dimensions with a tighter radius.
2. **Phone drop shadow** — The outer shell div has `boxShadow: "0 20px 60px rgba(0,0,0,0.4)"` which should be removed entirely.
3. **Button designs** — Both buttons need icons added per the Figma imports:
   - **Continue**: right-arrow icon after the label (paths already in `src/imports/Button/svg-93e3nz961l.ts`)
   - **Collect Sticker**: sticker/emoji icon before the label (paths in `src/imports/Button-1/svg-0raygvpscn.ts`)

## File to Modify
`src/app/App.tsx` only. SVG paths will be inlined — no need to import the Button components from `src/imports/` since they're presentational wrappers around the same markup already in App.tsx.

---

## Fix 1 — Align blur bloom to full PNG card footprint

**Current Layer 4a values:**
- `left: (393 - 324) / 2` (34.5px), `top: 130`, `width: 324`, `height: 374`, `borderRadius: 28`

**Change to:**
- `left: (393 - 304) / 2` (44.5px — same as sticker card), `top: 140` (same as sticker card), `width: 304`, `height: 354.35`, `borderRadius: 16`

This makes the bloom sit exactly behind the PNG card, covering the green tab and badge area uniformly. Keep all animation values the same.

---

## Fix 2 — Remove phone drop shadow

**Current outer shell:**
```
boxShadow: "0 20px 60px rgba(0,0,0,0.4)"
```
**Change to:** remove the `boxShadow` property entirely (or set to `"none"`).

---

## Fix 3 — Swap button designs

### Continue button (Screen 1, Layer 5a)
Add a right-arrow SVG icon inside the button after the "Continue" label. Use the two paths from `svg-93e3nz961l.ts`:
- Line: `M18.5 12H4.99997`
- Chevron: `M13 18C13 18 19 13.5811 19 12C19 10.4188 13 6 13 6`

Add `gap-[6px]` to the button flex layout and insert a `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">` with both stroked paths (`stroke="white"`, `strokeWidth="1.5"`, `strokeLinecap="round"`, `strokeLinejoin="round"`).

### Collect Sticker button (Screen 2, Layer 5b)
Add a sticker/smiley icon before the "Collect Sticker" label. Use the three paths from `svg-0raygvpscn.ts`:
- Document shape: `p23e06d00`
- Fold: `p35c0ed00`
- Smiley: `p1d423680`

Same SVG wrapper approach, icon placed before the text span.

---

## Fix 4 — Dark blur bloom

**Current:** `background: "rgba(255,255,255,0.06)"` — too light, bloom is invisible and doesn't help the sticker pop.

**Change to:** `background: "rgba(0,0,0,0.28)"` — dark semi-transparent fill so the sticker badge reads clearly against the forest background. Keep `backdropFilter: blur(14px)`.

---

## Fix 5 — Remove text animation on Screen 2

The UX priority is the sticker entrance; the bottom text fading in distracts from it. Screen 2 bottom content (Layer 5b) currently fades in with `transition={{ duration: 0.35, delay: 0.65 }}`.

**Change:** Remove the `motion.div` wrapper from Layer 5b entirely — replace with a plain `<div>`. The content will simply be present when `revealed` is true (it's already hidden behind Screen 1's content until the transition, and Screen 1's layer fades out to reveal it). This keeps the sticker spring as the sole animated focal point.

---

## Verification
1. Blur bloom covers the full sticker PNG card (green tab + badge area) with no stray frosted halo
2. Bloom is visibly dark, making the sticker badge pop against the forest
3. No drop shadow visible under the phone mockup
4. Continue button shows "Continue →" with arrow icon on right
5. Collect Sticker button shows sticker icon + "Collect Sticker" text
6. Screen 2 text/buttons appear without a fade animation — sticker entrance is the only motion

---

# Previous Plan: Center Sticker Badge Vertically in Forest Area

## Context
The sticker PNG (`hike.png`) contains two visual zones: a green/forest background with the Sasquatch badge, and a white tab strip at the bottom. On screen, the usable forest area runs from y≈49px (below status bar) to y=620px (where the white bottom panel begins) — 571px of green space. The badge is currently anchored with `top: 95`, which places it too high on the screen. The goal is to vertically center the badge within the forest zone above the white strip.

## File to Modify
`src/app/App.tsx` — Layer 4 sticker card div (currently `style={{ top: 95, ... }}`).

## What to Change

**Current values (Layer 4 sticker card):**
- `top: 95`
- `height: 354.35`
- `transformOrigin: "50% 55%"` — badge pivot estimated at 55% down the PNG = ~195px from top

**Target:**
- Forest center = midpoint of status-bar-bottom to white-strip-top = (49 + 620) / 2 ≈ **334px**
- Badge offset from PNG top = `354.35 × 0.55` ≈ **195px**
- Required `top` = 334 − 195 = **~139px** → round to **140**

**Change:** `top: 95` → `top: 140`

No other values need to change — `transformOrigin`, `width`, `left`, and the spring animation parameters stay the same.

## What else to change

### Subtle blur behind the sticker
Add a frosted-glass "bloom" div directly behind the sticker card (same position, slightly larger, zIndex 14) to lift the badge off the forest. Use `backdrop-filter: blur(12px)` with a very light semi-transparent white fill (`rgba(255,255,255,0.08)`) and a matching border-radius so it feels like diffused light rather than a hard card. Animate its opacity in sync with the sticker (hidden at start, fades in with the sticker reveal).

### Smoother, slower transition
Current issues: the dark overlay peaks too fast (0.75s, 38% peak) and the sticker spring is stiff (stiffness 510, damping 21 — snaps rather than floats).

Adjustments:
- **Dark overlay**: extend duration to `1.1s`, shift peak to `0.42` — gives the eye more time to adjust
- **Forest cross-fade** (layer 1→2): slow fade-out from `0.55s → 0.75s`, fade-in delay `0.1s → 0.18s`, duration `0.6s → 0.8s`
- **Sticker spring**: lower stiffness `510 → 320`, raise damping `21 → 28` — longer hang time, less snap; delay `0.28s → 0.38s` to let the overlay peak first
- **Bottom content fade-in** (Screen 2): delay `0.48s → 0.65s` so text doesn't race in behind the sticker

### Reset button outside the mockup
Add a small reset button beneath the iPhone shell that calls `setRevealed(false)` to snap back to Screen 1. Style it as a minimal icon-only button using `RotateCcw` from lucide-react — no label, just the icon on the `#f6f6f6` background so it doesn't compete with the mockup. Wrap the outer content in a flex column, position the button centered below the phone with `mt-6` gap. On click it instantly resets — no reverse animation needed.

## Verification
Visually confirm:
1. Badge sits in the vertical center of the green forest zone
2. A soft glow/blur halo is visible behind the sticker card
3. Tapping "Continue" feels like a ~1.2–1.4s cinematic reveal rather than a quick snap

---

# Previous Plan: Fix Visual Artifacts & Improve Phone Realism

## Context
Two visual bugs exist in the current iPhone mockup + three areas where realism can be improved:

1. **Blurry band at top of screen** — `StatusBar` has `backdrop-blur-[16px]` (line 30). Because the forest image layers are positioned well above `top: 0`, the status bar's backdrop filter blurs those pixels, creating a jarring frosted stripe across the top.
2. **Text/path distortion** — `StickerFrameTab` and its ornament use Figma-exported SVG filters that include `feDisplacementMap` (lines 159, 181, 183, 305). These warp the visible geometry and make the tab look glitchy rather than textured.
3. **Realism** — The phone border is a flat zinc-900 rectangle; real iPhones have physical side buttons, a subtle frame gradient (titanium/aluminum sheen), and a thin inner screen bezel.

## File to Modify
`src/app/App.tsx` — all changes are confined here.

---

## Fix 1 — Remove status bar backdrop-blur

**Where:** `StatusBar` component, line 30.

**Change:** Remove `backdrop-blur-[16px]` from the className. The status bar icons and time are already readable on the forest background; the blur adds nothing here and causes the artifact.

---

## Fix 2 — Simplify / remove SVG displacement filters

The complex `feDisplacementMap` filter chains inside `StickerFrameTab` are baked-in Figma export artefacts. They serve a subtle paper-texture intent but visually read as distortion.

**Change:** Strip the `<filter>` definitions and their `filter="url(...)"` references from the three `<g>` tags in `StickerFrameTab`'s SVG. The plain green shape (`#125829` path `pe928100`) and the two gradient rects (the tab "handle" highlights) render cleanly without them. Do the same for the ornament's `f0_ornament` filter — keep the white path, drop the displacement.

---

## Fix 3 — More realistic iPhone frame

Wrap the existing phone `<div>` in an outer positioning shell and add:

### a) Frame gradient border
Replace the flat `border-zinc-900` with a CSS `border-image` or an outer ring div using a conic/linear gradient that mimics polished titanium:
- Lighter silver highlights at top-left (~`#6b7280`)  
- Darker near bottom-right (~`#1c1c1e`)  
- Base stays dark so the screen pops

Implementation: add a wrapping div with `background` set to the gradient and `padding: 14px` + matching `border-radius: 55px`, remove the `border-*` classes from the inner phone div.

### b) Physical side buttons
Add three small absolutely-positioned sibling divs **outside** the phone content div (but inside the outer shell) to simulate hardware buttons:

- **Volume Up** — left side, ~120px from top, 3px wide × 32px tall, rounded, same gradient as frame  
- **Volume Down** — left side, ~165px from top, 3px wide × 32px tall  
- **Power / Side button** — right side, ~160px from top, 3px wide × 56px tall  

These sit with `position: absolute` relative to the outer wrapper and `z-index: 0` (behind the phone screen content).

### c) Thin inner screen bezel
Add a 1px inset `box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08)` on the phone content div to simulate the gap between glass and frame.

---

## Verification
1. Start the dev server and visually confirm:
   - No blurry band visible at top of phone in either screen state
   - Sticker tab green shape renders cleanly without wavy distortion
   - Phone frame shows a subtle gradient sheen instead of flat black
   - Three physical buttons visible on the left/right sides of the frame
   - Animation still plays correctly on "Continue" tap
2. Zoom level stays at `0.68` — buttons should scale with it automatically since they live inside the same zoom root.
