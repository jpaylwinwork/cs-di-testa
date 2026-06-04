interface Props {
  size?: number;
}

export default function JerseyToken({ size = 48 }: Props) {
  const h = Math.round(size * 1.1);
  return (
    <svg width={size} height={h} viewBox="0 0 48 54" xmlns="http://www.w3.org/2000/svg">
      {/* Drop shadow filter */}
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Jersey body — white */}
      <path
        d="M16 4 L5 9 L3 21 L12 19 L12 52 L36 52 L36 19 L45 21 L43 9 L32 4 Q28 8 24 8 Q20 8 16 4 Z"
        fill="white"
        filter="url(#shadow)"
      />

      {/* Navy center stripe */}
      <path d="M20.5 8 Q24 7 27.5 8 L27.5 52 L20.5 52 Z" fill="#11296B" />

      {/* Navy V-collar */}
      <path d="M16 4 Q24 1 32 4 Q28 8 24 8 Q20 8 16 4 Z" fill="#11296B" />

      {/* Left sleeve navy accent */}
      <path d="M5 9 L3 21 L6 20 L9 9 Z" fill="#11296B" opacity="0.25" />
      {/* Right sleeve navy accent */}
      <path d="M43 9 L45 21 L42 20 L39 9 Z" fill="#11296B" opacity="0.25" />

      {/* Subtle body shading for depth */}
      <path d="M12 19 L12 52 L15 52 L15 18 Z" fill="#11296B" opacity="0.06" />
      <path d="M36 19 L36 52 L33 52 L33 18 Z" fill="#11296B" opacity="0.06" />
    </svg>
  );
}
