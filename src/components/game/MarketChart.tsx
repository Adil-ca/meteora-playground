export function MarketChart({ history }: { history: number[] }) {
  const points = history.map((p, i) => `${(i * 600) / 29},${90 - p * 5}`).join(' ');
  const lastX = ((history.length - 1) * 600) / 29;
  return (
    <svg
      className="market-chart"
      viewBox="0 0 600 105"
      preserveAspectRatio="none"
      role="img"
      aria-label="Illustrative recent price path"
    >
      <path
        d="M0 25H600M0 55H600M0 85H600"
        stroke="currentColor"
        strokeOpacity=".12"
        strokeDasharray="3 5"
      />
      <polyline
        points={points}
        fill="none"
        stroke="#b8a6ef"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={lastX} cy={90 - history[history.length - 1] * 5} r="4" fill="#ff785f" />
    </svg>
  );
}
