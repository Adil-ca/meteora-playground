export function BinArt({ variant = 'hero' }: { variant?: 'hero' | 'mini' }) {
  const heights = [28, 42, 62, 96, 133, 168, 187, 158, 130, 100, 73, 47, 31];
  return (
    <svg
      className={`bin-art art-${variant}`}
      viewBox="0 0 620 350"
      role="img"
      aria-label="Original illustration of liquidity distributed across discrete price bins"
    >
      <defs>
        <pattern id={`grid-${variant}`} width="36" height="36" patternUnits="userSpaceOnUse">
          <path d="M36 0H0V36" fill="none" stroke="#ffffff" strokeOpacity=".055" />
        </pattern>
      </defs>
      <rect width="620" height="350" fill={`url(#grid-${variant})`} />
      <g transform="translate(42 10)">
        <path d="M0 272H535" stroke="#676268" strokeDasharray="3 5" />
        {heights.map((h, i) => (
          <g key={i}>
            <rect
              x={i * 40}
              y={270 - h}
              width="28"
              height={h}
              rx="3"
              fill={i === 7 ? '#ff785f' : i < 4 || i > 9 ? '#55505b' : '#9f8dc1'}
              fillOpacity={i === 7 ? 1 : 0.65}
            />
            {Array.from({ length: Math.floor(h / 15) }, (_, j) => (
              <path
                key={j}
                d={`M${i * 40 + 1} ${267 - j * 15}h26`}
                stroke="#151517"
                strokeWidth="3"
              />
            ))}
          </g>
        ))}
        <path
          d="M-8 218L35 208L75 225L112 184L149 195L187 150L223 164L261 127L294 152L329 91L365 111L405 55L446 71L493 32L528 46"
          fill="none"
          stroke="#f5f1e9"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path d="M294 36V285" stroke="#ff785f" strokeDasharray="4 5" />
        <circle cx="294" cy="152" r="6" fill="#ff785f" stroke="#161619" strokeWidth="3" />
        <rect x="251" y="10" width="88" height="26" rx="5" fill="#ff785f" />
        <text
          x="295"
          y="27"
          textAnchor="middle"
          fill="#201b19"
          fontSize="11"
          fontFamily="monospace"
        >
          ACTIVE BIN
        </text>
        <text x="0" y="307" fill="#99969b" fontSize="10" fontFamily="monospace">
          LOWER PRICE
        </text>
        <text x="445" y="307" fill="#99969b" fontSize="10" fontFamily="monospace">
          HIGHER PRICE
        </text>
      </g>
    </svg>
  );
}
