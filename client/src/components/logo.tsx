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
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
      >
        {/* Alarm bells on top */}
        <g fill="hsl(270, 50%, 80%)" stroke="hsl(250, 55%, 58%)" strokeWidth="1.5">
          {/* Left bell */}
          <ellipse cx="16" cy="12" rx="4" ry="5" transform="rotate(-25 16 12)" />
          {/* Right bell */}
          <ellipse cx="32" cy="12" rx="4" ry="5" transform="rotate(25 32 12)" />
        </g>
        
        {/* Bell wind-up keys */}
        <g fill="hsl(250, 55%, 58%)">
          <circle cx="13" cy="8" r="1.5" />
          <circle cx="35" cy="8" r="1.5" />
        </g>
        
        {/* Main clock body */}
        <circle
          cx="24"
          cy="26"
          r="15"
          fill="url(#clockGradient)"
          stroke="hsl(250, 55%, 58%)"
          strokeWidth="2"
        />
        
        {/* Clock face inner */}
        <circle
          cx="24"
          cy="26"
          r="12"
          fill="white"
          stroke="hsl(260, 60%, 65%)"
          strokeWidth="1"
        />
        
        {/* Hour markers */}
        <g fill="hsl(250, 55%, 58%)">
          <circle cx="24" cy="17" r="1" />
          <circle cx="33" cy="26" r="1" />
          <circle cx="24" cy="35" r="1" />
          <circle cx="15" cy="26" r="1" />
        </g>
        
        {/* Dollar sign prominently displayed */}
        <text
          x="24"
          y="30"
          fontSize="14"
          fontWeight="bold"
          fill="hsl(250, 55%, 58%)"
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
        >
          $
        </text>
        
        {/* Clock hands pointing to 10:10 (classic clock time) */}
        <g stroke="hsl(250, 55%, 58%)" strokeWidth="2" strokeLinecap="round">
          {/* Hour hand */}
          <line x1="24" y1="26" x2="20" y2="20" />
          {/* Minute hand */}
          <line x1="24" y1="26" x2="28" y2="20" />
        </g>
        
        {/* Clock center dot */}
        <circle cx="24" cy="26" r="2" fill="hsl(250, 55%, 58%)" />
        
        {/* Bell connectors to clock */}
        <g stroke="hsl(250, 55%, 58%)" strokeWidth="1.5" strokeLinecap="round">
          <line x1="18" y1="16" x2="21" y2="19" />
          <line x1="30" y1="16" x2="27" y2="19" />
        </g>
        
        {/* Legs extending from bottom of clock */}
        <g stroke="hsl(250, 55%, 58%)" strokeWidth="3" strokeLinecap="round">
          <line x1="18" y1="38" x2="12" y2="44" />
          <line x1="30" y1="38" x2="36" y2="44" />
        </g>
        
        {/* Leg feet/stands */}
        <g fill="hsl(250, 55%, 58%)">
          <ellipse cx="12" cy="44" rx="3" ry="1.5" />
          <ellipse cx="36" cy="44" rx="3" ry="1.5" />
        </g>
        
        <defs>
          <linearGradient id="clockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(260, 60%, 65%)" />
            <stop offset="100%" stopColor="hsl(270, 50%, 80%)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}