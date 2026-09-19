import svgPaths from "./svg-fsptm0lfzu";

function Frame() {
  return (
    <div className="flex items-center justify-center relative shrink-0">
      <div className="-scale-y-100 flex-none rotate-180">
        <div className="relative size-[24px]" data-name="Frame">
          <svg className="absolute block inset-0 size-full" fill="none" height="24" preserveAspectRatio="none" viewBox="0 0 24 24" width="24">
            <g id="Frame">
              <path d="M5.5 12.002H19" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              <path d={svgPaths.p7a91280} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function Button() {
  return (
    <div className="bg-[#765cd8] content-stretch flex gap-[6px] items-center justify-center overflow-clip px-[16px] py-[12px] relative rounded-[12px] size-full" data-name="Button">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#fafafa] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Continue</p>
      </div>
      <Frame />
    </div>
  );
}