interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className = "", size = 32 }: LogoProps) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
      >
        {/* Outer clock circle */}
        <circle
          cx="16"
          cy="16"
          r="14"
          fill="url(#clockGradient)"
          stroke="hsl(271, 81%, 50%)"
          strokeWidth="1.5"
        />
        
        {/* Clock face */}
        <circle
          cx="16"
          cy="16"
          r="11"
          fill="white"
          stroke="hsl(281, 83%, 79%)"
          strokeWidth="0.5"
        />
        
        {/* Hour markers */}
        <g stroke="hsl(271, 81%, 66%)" strokeWidth="1" fill="hsl(271, 81%, 66%)">
          {/* 12 o'clock */}
          <rect x="15.5" y="6" width="1" height="2" />
          {/* 3 o'clock */}
          <rect x="24" y="15.5" width="2" height="1" />
          {/* 6 o'clock */}
          <rect x="15.5" y="24" width="1" height="2" />
          {/* 9 o'clock */}
          <rect x="6" y="15.5" width="2" height="1" />
        </g>
        
        {/* Dollar sign on clock face */}
        <g fill="hsl(262, 90%, 50%)" fontSize="10" fontWeight="bold" textAnchor="middle">
          <text x="16" y="20" className="font-bold text-xs">$</text>
        </g>
        
        {/* Clock hands */}
        <g stroke="hsl(271, 81%, 50%)" strokeWidth="1.5" strokeLinecap="round">
          {/* Hour hand pointing to 10 */}
          <line x1="16" y1="16" x2="13" y2="11" />
          {/* Minute hand pointing to 2 */}
          <line x1="16" y1="16" x2="20" y2="9" />
        </g>
        
        {/* Center dot */}
        <circle cx="16" cy="16" r="1.5" fill="hsl(271, 81%, 50%)" />
        
        {/* Alarm bells */}
        <g fill="hsl(281, 83%, 79%)" stroke="hsl(271, 81%, 66%)" strokeWidth="0.5">
          {/* Left bell */}
          <ellipse cx="8" cy="10" rx="2" ry="2.5" transform="rotate(-20 8 10)" />
          {/* Right bell */}
          <ellipse cx="24" cy="10" rx="2" ry="2.5" transform="rotate(20 24 10)" />
        </g>
        
        {/* Wind-up key */}
        <g stroke="hsl(271, 81%, 66%)" strokeWidth="1" fill="none">
          <circle cx="16" cy="4" r="1" />
          <line x1="16" y1="3" x2="16" y2="1" />
        </g>
        
        <defs>
          <linearGradient id="clockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(271, 81%, 66%)" />
            <stop offset="100%" stopColor="hsl(281, 83%, 79%)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}