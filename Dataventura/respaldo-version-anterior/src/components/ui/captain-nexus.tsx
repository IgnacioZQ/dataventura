export function CaptainNexus({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 220"
      role="img"
      aria-label="Capitán Nexus, el audaz capitán pirata del barco DataMind"
      className={className}
    >
      <defs>
        <linearGradient id="nexus-body" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#ffe1ca" />
          <stop offset="1" stopColor="#e8b8a6" />
        </linearGradient>
        <linearGradient id="nexus-coat" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#3b176c" />
        </linearGradient>
        <filter id="nexus-shadow" x="-25%" y="-25%" width="150%" height="160%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#05030b" floodOpacity=".45" />
        </filter>
      </defs>
      <ellipse cx="100" cy="208" rx="58" ry="8" fill="#05030b" opacity=".4" />
      <g className="nexus-character" filter="url(#nexus-shadow)">
        <path d="M54 165c5-26 25-39 46-39s41 13 46 39l-11 29H65l-11-29Z" fill="url(#nexus-coat)" stroke="#e9ddff" strokeWidth="3" />
        <path d="m82 132 18 24 18-24-11-14H92l-10 14Z" fill="#fff" />
        <path d="m94 145 6 11 7-11-7-7-6 7Z" fill="#a78bfa" />
        <path d="M58 168 79 180l-11 15-17-8m80-19-21 12 11 15 17-8" fill="#6d28d9" stroke="#e9ddff" strokeLinejoin="round" strokeWidth="3" />
        <path d="M78 169h44m-44 12h44" stroke="#d8c9ff" strokeWidth="3" />
        <circle cx="100" cy="169" r="3" fill="#fff" /><circle cx="100" cy="181" r="3" fill="#fff" />
        <path d="M84 194v9m32-9v9" stroke="#e9ddff" strokeLinecap="round" strokeWidth="5" />
        <path d="M82 200h-8v6h52v-6h-8" fill="#211432" stroke="#e9ddff" strokeWidth="2" />
        <rect x="94" y="197" width="12" height="8" rx="2" fill="#e9ddff" />
        <circle cx="100" cy="88" r="48" fill="url(#nexus-body)" stroke="#171023" strokeWidth="4" />
        <path d="M62 82c9 3 23 6 38 6 17 0 32-3 43-8v17c-12 10-28 15-43 15-17 0-30-5-39-14l1-16Z" fill="#352747" />
        <path d="M62 80c21 8 55 9 81-1" fill="none" stroke="#f0d5c8" strokeWidth="5" />
        <ellipse cx="78" cy="88" rx="11" ry="13" fill="#fff" />
        <ellipse cx="122" cy="88" rx="11" ry="13" fill="#fff" />
        <ellipse cx="81" cy="90" rx="6" ry="8" fill="#171023" />
        <ellipse cx="121" cy="90" rx="6" ry="8" fill="#171023" />
        <circle cx="83" cy="87" r="2.5" fill="#fff" />
        <path d="M100 113c7 8 18 8 25 0-3-14-8-21-14-21s-10 8-11 21Z" fill="#171023" stroke="#e9ddff" strokeWidth="3" />
        <path d="M102 110h18" stroke="#c4b5fd" strokeWidth="2" />
        <path d="M79 125c10 9 26 10 39 0" fill="none" stroke="#211432" strokeLinecap="round" strokeWidth="4" />
        <circle cx="66" cy="111" r="5" fill="#e88caa" opacity=".7" />
        <path d="M29 72c5-17 11-31 23-37 4-20 25-31 53-31s48 11 54 31c12 6 19 20 23 37-15 10-39 11-57 5l-20-12-19 12c-19 7-42 5-57-5Z" fill="#100b18" stroke="#05030b" strokeWidth="7" />
        <path d="M35 69c16-4 32-8 41-19 6-23 19-34 41-34s37 13 42 35c9 10 23 14 39 18" fill="none" stroke="#c4b5fd" strokeLinecap="round" strokeWidth="4" />
        <path d="M31 80c43-17 95-19 143-1l-6 19c-41-13-91-13-133 2L31 80Z" fill="#7c3aed" stroke="#e9ddff" strokeWidth="3" />
        <path d="M36 79c37-12 95-15 133-1" fill="none" stroke="#c4b5fd" strokeWidth="4" />
        <path d="M95 28c-7 1-13 7-13 14s7 12 18 12 18-5 18-12-6-13-15-14l-4-5-4 5Z" fill="#fff" />
        <ellipse cx="94" cy="41" rx="5" ry="7" fill="#171023" />
        <ellipse cx="106" cy="41" rx="3" ry="5" fill="#171023" />
        <path d="m92 51-2 6m10-6v7m9-7 2 6M69 51l-5 5m-1 3-6 5m6-11-5-4m74 2 5 5m-6 1 6 5m-5-11 5-4" stroke="#fff" strokeLinecap="round" strokeWidth="4" />
        <path d="M122 80c13-7 26 2 29 13-4 14-19 20-33 15l-4-16 8-12Z" fill="#100b18" stroke="#05030b" strokeWidth="4" />
        <path d="M119 84c8-4 18-1 23 5" fill="none" stroke="#c4b5fd" strokeWidth="2" />
        <path d="m164 95 17 10-18 3" fill="#7c3aed" stroke="#e9ddff" strokeLinejoin="round" strokeWidth="3" />
      </g>
    </svg>
  );
}
