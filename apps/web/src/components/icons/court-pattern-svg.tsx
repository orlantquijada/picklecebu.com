export function CourtPatternSVG() {
  return (
    <svg
      className="absolute inset-0 h-full w-full opacity-15"
      viewBox="0 0 300 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect x="30" y="60" width="240" height="280" stroke="white" strokeWidth="2" rx="2" />
      <line x1="30" y1="200" x2="270" y2="200" stroke="white" strokeWidth="2" strokeDasharray="8 5" />
      <rect x="80" y="60" width="140" height="280" stroke="white" strokeWidth="1.5" rx="1" />
      <line x1="150" y1="60" x2="150" y2="340" stroke="white" strokeWidth="0.5" />
      <circle cx="150" cy="200" r="8" stroke="white" strokeWidth="1.5" fill="none" />
    </svg>
  );
}
