// Arte del mapa: paradas, símbolos y el paisaje SVG de cada ruta.
export const stops = [
  { x: 50, y: 11, symbol: "compass" },
  { x: 70, y: 31, symbol: "data" },
  { x: 38, y: 51, symbol: "chart" },
  { x: 63, y: 71, symbol: "eye" },
  { x: 43, y: 91, symbol: "spark" }
] as const;

export function StopSymbol({ name }: { name: (typeof stops)[number]["symbol"] }) {
  if (name === "compass") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true" className="h-8 w-8">
        <circle cx="24" cy="24" r="18" fill="none" stroke="currentColor" strokeWidth="4" />
        <path d="m30 17-4 10-9 4 4-10 9-4Z" fill="currentColor" />
      </svg>
    );
  }
  if (name === "data") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true" className="h-8 w-8">
        <path d="M10 13h28M10 24h28M10 35h28" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="4" />
        <circle cx="16" cy="13" r="4" fill="currentColor" />
        <circle cx="30" cy="24" r="4" fill="currentColor" />
        <circle cx="21" cy="35" r="4" fill="currentColor" />
      </svg>
    );
  }
  if (name === "chart") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true" className="h-8 w-8">
        <path d="M9 38V10M9 38h31" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="4" />
        <path d="m14 31 8-9 7 4 9-13" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
        <circle cx="38" cy="13" r="3" fill="currentColor" />
      </svg>
    );
  }
  if (name === "eye") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true" className="h-8 w-8">
        <path d="M4 24s7-12 20-12 20 12 20 12-7 12-20 12S4 24 4 24Z" fill="none" stroke="currentColor" strokeWidth="4" />
        <circle cx="24" cy="24" r="6" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="h-8 w-8">
      <path d="m24 5 4.8 13.2L42 23l-13.2 4.8L24 41l-4.8-13.2L6 23l13.2-4.8L24 5Z" fill="currentColor" />
    </svg>
  );
}

export function IslandScenery({ uid }: { uid: string }) {
  return (
    <svg
      viewBox="0 0 640 1080"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    >
      <defs>
        <linearGradient id={`${uid}-sea`} x1="0" x2="0.8" y1="0" y2="1">
          <stop offset="0" stopColor="#24143a" />
          <stop offset=".52" stopColor="#160f27" />
          <stop offset="1" stopColor="#0b0912" />
        </linearGradient>
        <linearGradient id={`${uid}-island`} x1="0" x2=".9" y1="0" y2="1">
          <stop offset="0" stopColor="#d8c9ff" />
          <stop offset=".42" stopColor="#9570de" />
          <stop offset="1" stopColor="#513178" />
        </linearGradient>
        <linearGradient id={`${uid}-island-silver`} x1="0" x2=".8" y1="0" y2="1">
          <stop offset="0" stopColor="#f4efff" /><stop offset=".55" stopColor="#b9a5df" /><stop offset="1" stopColor="#655080" />
        </linearGradient>
        <linearGradient id={`${uid}-island-orchid`} x1="0" x2=".8" y1="0" y2="1">
          <stop offset="0" stopColor="#efd8ff" /><stop offset=".45" stopColor="#ac78cf" /><stop offset="1" stopColor="#59366f" />
        </linearGradient>
        <linearGradient id={`${uid}-island-moonstone`} x1="0" x2=".9" y1="0" y2="1">
          <stop offset="0" stopColor="#d7e6ff" /><stop offset=".5" stopColor="#8f84cd" /><stop offset="1" stopColor="#413760" />
        </linearGradient>
        <linearGradient id={`${uid}-island-treasure`} x1="0" x2=".9" y1="0" y2="1">
          <stop offset="0" stopColor="#f1e4ff" /><stop offset=".45" stopColor="#bb8be8" /><stop offset="1" stopColor="#69427c" />
        </linearGradient>
        <filter id={`${uid}-islandShadow`} x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="12" stdDeviation="12" floodColor="#000" floodOpacity=".58" />
        </filter>
        <pattern id={`${uid}-waterLines`} width="96" height="62" patternUnits="userSpaceOnUse">
          <path d="M8 18c10-8 22-8 32 0m30 31c8-6 17-6 25 0" fill="none" stroke="#c4b5fd" strokeLinecap="round" strokeOpacity=".24" strokeWidth="3" />
          <circle cx="58" cy="12" r="2" fill="#fff" fillOpacity=".35" />
        </pattern>
      </defs>
      <rect width="640" height="1080" fill={`url(#${uid}-sea)`} />
      <rect width="640" height="1080" fill={`url(#${uid}-waterLines)`} />
      <g className="ocean-currents" fill="none" stroke="#e9ddff" strokeLinecap="round">
        <path className="ocean-current ocean-current-one" d="M-80 208q22-12 44 0t44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0" strokeWidth="5" />
        <path className="ocean-current ocean-current-two" d="M-80 423q22-10 44 0t44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0" strokeWidth="4" />
        <path className="ocean-current ocean-current-three" d="M-80 644q22-11 44 0t44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0" strokeWidth="5" />
        <path className="ocean-current ocean-current-four" d="M-80 861q22-10 44 0t44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0" strokeWidth="4" />
      </g>
      <path
        d="M322 34C394 105 466 127 442 221s-141 107-110 206 150 91 93 182-125 98-92 190 105 103 5 248"
        fill="none"
        stroke="#e9ddff"
        strokeLinecap="round"
        strokeOpacity=".58"
        strokeWidth="17"
      />
      <path
        d="M322 34C394 105 466 127 442 221s-141 107-110 206 150 91 93 182-125 98-92 190 105 103 5 248"
        fill="none"
        stroke="#9b78e8"
        strokeDasharray="3 15"
        strokeLinecap="round"
        strokeOpacity=".7"
        strokeWidth="5"
      />
      <g filter={`url(#${uid}-islandShadow)`}>
        <path className="island-shore island-shore-one" d="M225 82c19-35 62-50 109-38 37-18 76-2 87 30 26 23 20 67-10 87-37 28-125 28-168 2-30-18-41-49-18-81Z" />
        <path className="island-land" fill={`url(#${uid}-island)`} d="M225 69c19-35 62-50 109-38 37-18 76-2 87 30 26 23 20 67-10 87-37 28-125 28-168 2-30-18-41-49-18-81Z" />
        <path d="M253 84c29-30 73-39 113-27" fill="none" stroke="#fff" strokeOpacity=".4" strokeWidth="5" strokeLinecap="round" />
        <path className="island-shore island-shore-two" d="M383 301c17-31 50-45 79-35 24-19 62-10 76 15 30 12 37 47 17 68-26 29-102 38-147 17-32-14-43-40-25-65Z" />
        <path className="island-land" fill={`url(#${uid}-island-silver)`} d="M383 288c17-31 50-45 79-35 24-19 62-10 76 15 30 12 37 47 17 68-26 29-102 38-147 17-32-14-43-40-25-65Z" />
        <path d="M404 299c24-24 62-33 96-23" fill="none" stroke="#fff" strokeOpacity=".42" strokeWidth="5" strokeLinecap="round" />
        <path className="island-shore island-shore-three" d="M160 515c9-35 41-52 77-44 19-25 62-27 86-5 28 5 41 31 31 56 18 25 4 61-26 72-33 22-105 16-143-7-31-18-43-47-25-72Z" />
        <path className="island-land" fill={`url(#${uid}-island-orchid)`} d="M160 502c9-35 41-52 77-44 19-25 62-27 86-5 28 5 41 31 31 56 18 25 4 61-26 72-33 22-105 16-143-7-31-18-43-47-25-72Z" />
        <path d="M188 516c23-27 61-39 94-31" fill="none" stroke="#fff" strokeOpacity=".38" strokeWidth="5" strokeLinecap="round" />
        <path className="island-shore island-shore-four" d="M319 718c22-29 57-36 88-22 27-19 65-9 76 19 25 19 26 53 4 74-14 31-52 47-83 35-38 16-88-1-103-33-15-26-8-54 18-73Z" />
        <path className="island-land" fill={`url(#${uid}-island-moonstone)`} d="M319 705c22-29 57-36 88-22 27-19 65-9 76 19 25 19 26 53 4 74-14 31-52 47-83 35-38 16-88-1-103-33-15-26-8-54 18-73Z" />
        <path d="M342 715c27-23 63-26 93-12" fill="none" stroke="#fff" strokeOpacity=".4" strokeWidth="5" strokeLinecap="round" />
        <path className="island-shore island-shore-five" d="M191 928c13-34 50-49 84-35 28-23 69-14 82 16 29 11 40 43 25 69 7 31-20 58-52 56-34 21-82 11-101-18-34-3-53-37-38-66Z" />
        <path className="island-land" fill={`url(#${uid}-island-treasure)`} d="M191 915c13-34 50-49 84-35 28-23 69-14 82 16 29 11 40 43 25 69 7 31-20 58-52 56-34 21-82 11-101-18-34-3-53-37-38-66Z" />
        <path d="M217 924c24-24 61-31 93-18" fill="none" stroke="#fff" strokeOpacity=".48" strokeWidth="5" strokeLinecap="round" />
      </g>
      <g className="island-landmarks" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <g className="island-landmark island-landmark-one">
          <path d="m248 93 19-17 19 17v24h-38V93Z" fill="#20152c" stroke="#e9ddff" strokeWidth="3" />
          <path d="M262 117V98h10v19m-25-23h39" stroke="#fff" strokeWidth="3" />
          <circle cx="311" cy="81" r="9" fill="#f8f6ff" stroke="#6d28d9" strokeWidth="3" />
          <path d="M311 76v10m-5-5h10" stroke="#6d28d9" strokeWidth="2" />
          <path d="m364 87 11 7-11 7-11-7 11-7Zm0 0V73m-8 21v11m16-11v11" stroke="#fff" strokeWidth="3" />
        </g>
        <g className="island-landmark island-landmark-two">
          <path d="M405 306v-26m-13 13h26m-13-13-11-9m11 9 11-9m-11 35-10 8m10-8 10 8" stroke="#20152c" strokeWidth="6" />
          <path d="m453 283 19-16 19 16v24h-38v-24Z" fill="#20152c" stroke="#fff" strokeWidth="3" />
          <path d="M467 307v-15h11v15m-29-24h45" stroke="#c4b5fd" strokeWidth="3" />
          <circle cx="510" cy="294" r="13" fill="#29183d" stroke="#e9ddff" strokeWidth="3" />
          <path d="M510 294h8m-8 0v-8" stroke="#fff" strokeWidth="2" />
        </g>
        <g className="island-landmark island-landmark-three">
          <path d="m178 537 13-25 13 25-13 16-13-16Zm19 15 15-37 14 37-15 18-14-18Zm45-48 12-24 12 24-12 14-12-14Z" fill="#e9ddff" stroke="#7c3aed" strokeWidth="3" />
          <path d="m258 547 16-22 16 22-16 12-16-12Zm25 12 13-20 13 20-13 10-13-10Z" fill="#c4b5fd" stroke="#fff" strokeWidth="2" />
        </g>
        <g className="island-landmark island-landmark-four">
          <path d="M350 753h37l-5-44h-27l-5 44Z" fill="#f8f6ff" stroke="#513178" strokeWidth="4" />
          <path d="M352 723h32m-29 11h26m-30 11h33" stroke="#7c3aed" strokeWidth="5" />
          <path d="m354 709 15-16 16 16h-31Z" fill="#3b2459" stroke="#e9ddff" strokeWidth="3" />
          <path d="M367 696v-19m0 0 15 7-15 6m1-4h-3" stroke="#fff" strokeWidth="3" />
          <circle cx="369" cy="734" r="5" fill="#e9ddff" stroke="#7c3aed" strokeWidth="2" />
        </g>
        <g className="island-landmark island-landmark-five">
          <path d="M310 947c0-12 10-22 22-22s22 10 22 22v32h-44v-32Z" fill="#f8f6ff" stroke="#513178" strokeWidth="4" />
          <path d="M307 949h50m-46 11h42m-42 11h42" stroke="#8b5cf6" strokeWidth="5" />
          <path d="m304 926 6-13 6 13m7-2 6-13 6 13m7-2 6-13 6 13" fill="#e9ddff" stroke="#7c3aed" strokeWidth="2" />
          <path d="M267 1004c11-7 25-7 36 0" stroke="#fff" strokeWidth="3" />
        </g>
      </g>
      <g fill="#fff" opacity=".9">
        <circle cx="99" cy="94" r="5" /><circle cx="219" cy="69" r="4" /><circle cx="426" cy="252" r="5" />
        <circle cx="514" cy="318" r="4" /><circle cx="88" cy="482" r="4" /><circle cx="211" cy="538" r="5" />
        <circle cx="414" cy="685" r="5" /><circle cx="522" cy="750" r="4" /><circle cx="187" cy="907" r="5" />
        <circle cx="265" cy="967" r="4" />
      </g>
      <g stroke="#301d4b" strokeLinecap="round" strokeWidth="7">
        <path d="M120 79v-24m0 24-15-17m15 17 15-19m-15 19-19-3m19 3 19-3" />
        <path d="M483 253v-23m0 23-14-17m14 17 14-19m-14 19-17-3m17 3 17-3" />
        <path d="M159 475v-23m0 23-14-17m14 17 14-19m-14 19-17-3m17 3 17-3" />
        <path d="M458 681v-23m0 23-14-17m14 17 14-19m-14 19-17-3m17 3 17-3" />
        <path d="M212 897v-23m0 23-14-17m14 17 14-19m-14 19-17-3m17 3 17-3" />
      </g>
      <g fill="#fff" opacity=".9">
        <path d="M55 205c9-8 21-8 30 0-9 8-21 8-30 0Zm494 201c9-8 21-8 30 0-9 8-21 8-30 0Zm-24 414c9-8 21-8 30 0-9 8-21 8-30 0Z" />
      </g>
    </svg>
  );
}
