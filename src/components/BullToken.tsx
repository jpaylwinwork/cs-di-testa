interface Props {
  size?: number;
  dimmed?: boolean;
}

export default function BullToken({ size = 52, dimmed = false }: Props) {
  const h = Math.round(size * 1.25);
  return (
    <svg
      width={size}
      height={h}
      viewBox="0 0 52 65"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity: dimmed ? 0.45 : 1, filter: dimmed ? 'grayscale(60%)' : 'none' }}
    >
      {/* Left horn */}
      <path d="M17 16 Q9 6 13 0 Q18 10 19 17" fill="#C8942A" />
      {/* Right horn */}
      <path d="M35 16 Q43 6 39 0 Q34 10 33 17" fill="#C8942A" />

      {/* Left ear */}
      <ellipse cx="12" cy="21" rx="4" ry="5.5" fill="#8B5E3C" />
      <ellipse cx="12" cy="21" rx="2.2" ry="3.5" fill="#C4896A" />
      {/* Right ear */}
      <ellipse cx="40" cy="21" rx="4" ry="5.5" fill="#8B5E3C" />
      <ellipse cx="40" cy="21" rx="2.2" ry="3.5" fill="#C4896A" />

      {/* Head */}
      <circle cx="26" cy="23" r="14" fill="#8B5E3C" />

      {/* Eyes */}
      <circle cx="21" cy="21" r="2.5" fill="white" />
      <circle cx="31" cy="21" r="2.5" fill="white" />
      <circle cx="21.8" cy="21.8" r="1.3" fill="#111" />
      <circle cx="31.8" cy="21.8" r="1.3" fill="#111" />
      <circle cx="22.3" cy="21.3" r="0.4" fill="white" />
      <circle cx="32.3" cy="21.3" r="0.4" fill="white" />

      {/* Snout */}
      <ellipse cx="26" cy="30" rx="6" ry="4.5" fill="#C4896A" />
      <circle cx="23.5" cy="30" r="1.5" fill="#7a4020" />
      <circle cx="28.5" cy="30" r="1.5" fill="#7a4020" />

      {/* Jersey body — white base -->*/}
      <path d="M10 40 Q8 55 9 64 L43 64 Q44 55 42 40 Q36 35 26 35 Q16 35 10 40 Z" fill="white" />
      {/* Navy blue center stripe */}
      <path d="M22.5 35.5 Q26 34 29.5 35.5 L30 64 L22 64 Z" fill="#11296B" />
      {/* Collar */}
      <path d="M22 35 Q26 33 30 35 L29 38 Q26 36.5 23 38 Z" fill="#11296B" />
      {/* Left sleeve/shoulder */}
      <path d="M10 40 Q7 36 10 33 Q15 38 16 42 Q13 41 10 40 Z" fill="white" />
      {/* Right sleeve/shoulder */}
      <path d="M42 40 Q45 36 42 33 Q37 38 36 42 Q39 41 42 40 Z" fill="white" />
      {/* Sleeve stripes (navy) */}
      <path d="M10 40 Q7 36 10 33 Q9 37 11 41 Z" fill="#11296B" opacity="0.4" />
      <path d="M42 40 Q45 36 42 33 Q43 37 41 41 Z" fill="#11296B" opacity="0.4" />
    </svg>
  );
}
