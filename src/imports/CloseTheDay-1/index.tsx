import svgPaths from "./svg-uexnog5f8p";
import imgChatGptImageJul252026063526Pm21 from "./e2bd23e39d33f773566dc5e77b34e6ba32aa8619.png";
import imgChatGptImageJul162026102226Pm1 from "./801fd5d2eb86e92860988946735c41ac01175638.png";

function Frame() {
  return (
    <div className="absolute h-[861px] left-0 overflow-clip top-[-273px] w-[393px]">
      <div className="absolute h-[819px] left-[-29px] top-[125px] w-[461px]" data-name="ChatGPT Image Jul 25, 2026, 06_35_26 PM (2) 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgChatGptImageJul252026063526Pm21} />
      </div>
    </div>
  );
}

function CloseTheDay1() {
  return (
    <div className="absolute bg-[#faf8f7] h-[861px] left-[159px] overflow-clip rounded-[30px] top-[897px] w-[393px]" data-name="Close the Day">
      <div className="absolute h-[1875px] left-[-653px] top-[-991px] w-[1250px]" data-name="ChatGPT Image Jul 16, 2026, 10_22_26 PM 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgChatGptImageJul162026102226Pm1} />
      </div>
    </div>
  );
}

function LeftSide() {
  return (
    <div className="-translate-x-1/2 absolute contents left-[calc(50%-142.08px)] top-[14.11px]" data-name="Left Side">
      <div className="-translate-x-1/2 absolute h-[21.162px] left-[calc(50%-142.67px)] rounded-[24px] top-[14.22px] w-[54.415px]" data-name="StatusBars Time">
        <p className="-translate-x-1/2 [word-break:break-word] absolute font-['SF_Pro_Text:Semibold',sans-serif] h-[20.154px] leading-[22.169px] left-[27.21px] not-italic text-[17.13px] text-black text-center top-[1.01px] tracking-[-0.408px] w-[54.415px]" style={{ fontFeatureSettings: '"case"' }}>
          9:41
        </p>
      </div>
    </div>
  );
}

function RightSide() {
  return (
    <div className="absolute h-[13.1px] left-[288.2px] top-[19.15px] w-[79.004px]" data-name="Right Side">
      <div className="absolute h-[12.092px] left-0 top-0 w-[18.138px]" data-name="Icon / Mobile Signal">
        <svg className="absolute block inset-0 size-full" fill="none" height="12.0923" preserveAspectRatio="none" viewBox="0 0 18.1385 12.0923" width="18.1385">
          <g id="Icon / Mobile Signal">
            <path d={svgPaths.p38ba6580} fill="var(--fill-0, black)" />
            <path d={svgPaths.p29c46e40} fill="var(--fill-0, black)" />
            <path d={svgPaths.p22456a00} fill="var(--fill-0, black)" />
            <path d={svgPaths.p2344fb00} fill="var(--fill-0, black)" />
          </g>
        </svg>
      </div>
      <div className="-translate-x-1/2 absolute h-[11.925px] left-[calc(50%-4.07px)] top-0 w-[17.131px]" data-name="Wifi">
        <svg className="absolute block inset-0 size-full" fill="none" height="11.9248" preserveAspectRatio="none" viewBox="0 0 17.1309 11.9248" width="17.1309">
          <path d={svgPaths.pa70db00} fill="var(--fill-0, black)" id="Wifi" />
        </svg>
      </div>
      <div className="absolute h-[13.1px] left-[51.39px] top-0 w-[27.612px]" data-name="_StatusBar-battery">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[13.1px] left-[calc(50%-1.21px)] top-1/2 w-[25.192px]" data-name="Outline">
          <svg className="absolute block inset-0 size-full" fill="none" height="13.1" preserveAspectRatio="none" viewBox="0 0 25.1923 13.1" width="25.1923">
            <path clipRule="evenodd" d={svgPaths.p370ee680} fill="var(--fill-0, #1C1C1E)" fillRule="evenodd" id="Outline" />
          </svg>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[4.253px] left-[calc(50%+13.1px)] top-[calc(50%+0.61px)] w-[1.412px]" data-name="Battery End">
          <svg className="absolute block inset-0 size-full" fill="none" height="4.25281" preserveAspectRatio="none" viewBox="0 0 1.41197 4.25281" width="1.41197">
            <path d={svgPaths.p7aeeeb4} fill="var(--fill-0, #1C1C1E)" id="Battery End" />
          </svg>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['SF_Pro_Text:Bold',sans-serif] justify-center leading-[0] left-[calc(50%-1.21px)] not-italic text-[10.08px] text-center text-white top-1/2 tracking-[0.06px] whitespace-nowrap" style={{ fontFeatureSettings: '"case"' }}>
          <p className="leading-[13.1px]">70</p>
        </div>
      </div>
    </div>
  );
}

function TrueDepthCamera() {
  return <div className="absolute bg-black inset-[0_36%_0_0] rounded-[100px]" data-name="TrueDepth camera" />;
}

function Camera() {
  return <div className="absolute bg-[#111] left-[11.9px] rounded-[100px] size-[12.896px] top-[11.9px]" data-name="Camera" />;
}

function FaceTimeCamera() {
  return (
    <div className="absolute bg-black inset-[0_0_0_70.4%] overflow-clip rounded-[100px]" data-name="FaceTime camera">
      <Camera />
    </div>
  );
}

export default function CloseTheDay() {
  return (
    <div className="bg-[#faf8f7] overflow-clip relative rounded-[30px] size-full" data-name="Close the Day">
      <Frame />
      <CloseTheDay1 />
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] left-[196.5px] not-italic text-[#063235] text-[22px] text-center top-[620px] tracking-[-0.5px] whitespace-nowrap">Sasquatch Sighting</p>
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal h-[50px] leading-[1.4] left-[196.5px] not-italic text-[#063235] text-[16px] text-center top-[654px] tracking-[-0.5px] w-[303px]">{`Something moves between the trees. Slow down and take a closer look… `}</p>
      <div className="-translate-x-1/2 absolute bg-[#765cd8] content-stretch flex flex-col h-[48px] items-center justify-center left-1/2 overflow-clip px-[16px] py-[12px] rounded-[12px] top-[780px] w-[321px]" data-name="Button">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap">
          <p className="leading-[20px]">Continue</p>
        </div>
      </div>
      <div className="-translate-x-1/2 absolute backdrop-blur-[16px] content-stretch flex flex-col gap-[10px] h-[49px] items-start left-1/2 pt-[6px] top-0" data-name="StatusBars">
        <div className="h-[47.362px] relative shrink-0 w-[393px]" data-name="StatusBar_iOS_17">
          <LeftSide />
          <RightSide />
        </div>
        <div className="-translate-x-1/2 absolute h-[36.704px] left-[calc(50%+0.5px)] top-[12px] w-[124px]" data-name="Dynamic Island">
          <div className="absolute bg-black inset-0 rounded-[100px]" />
          <TrueDepthCamera />
          <FaceTimeCamera />
        </div>
      </div>
    </div>
  );
}