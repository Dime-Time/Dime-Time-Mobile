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
        {/* Alarm clock body - main circle */}
        <circle
          cx="24"
          cy="24"
          r="18"
          fill="hsl(260, 35%, 80%)"
          stroke="hsl(260, 35%, 80%)"
          strokeWidth="2"
        />
        
        {/* Inner clock face */}
        <circle
          cx="24"
          cy="24"
          r="15"
          fill="white"
          stroke="hsl(260, 35%, 80%)"
          strokeWidth="1"
        />
        
        {/* Left alarm bell */}
        <ellipse
          cx="10"
          cy="16"
          rx="5"
          ry="6"
          fill="hsl(260, 35%, 80%)"
          transform="rotate(-20 10 16)"
        />
        
        {/* Right alarm bell */}
        <ellipse
          cx="38"
          cy="16"
          rx="5"
          ry="6"
          fill="hsl(260, 35%, 80%)"
          transform="rotate(20 38 16)"
        />
        
        {/* Wind-up key on left bell */}
        <circle cx="6" cy="12" r="2" fill="hsl(260, 35%, 80%)" />
        <rect x="4" y="10" width="4" height="1" fill="hsl(260, 35%, 80%)" />
        
        {/* Wind-up key on right bell */}
        <circle cx="42" cy="12" r="2" fill="hsl(260, 35%, 80%)" />
        <rect x="40" y="10" width="4" height="1" fill="hsl(260, 35%, 80%)" />
        
        {/* Dollar sign in center */}
        <text
          x="24"
          y="28"
          fontSize="16"
          fontWeight="bold"
          fill="hsl(260, 35%, 80%)"
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
        >
          $
        </text>
        
        {/* Clock legs */}
        <rect x="16" y="38" width="3" height="8" fill="hsl(260, 35%, 80%)" transform="rotate(-15 17.5 42)" />
        <rect x="29" y="38" width="3" height="8" fill="hsl(260, 35%, 80%)" transform="rotate(15 30.5 42)" />
        
        {/* Leg feet */}
        <ellipse cx="14" cy="46" rx="4" ry="2" fill="hsl(260, 35%, 80%)" />
        <ellipse cx="34" cy="46" rx="4" ry="2" fill="hsl(260, 35%, 80%)" />
      </svg>
    </div>
  );
}

// Alternative version with background for standalone use
export function LogoWithBackground({ className = "", size = 120 }: LogoProps) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size * 1.2 }}>
      <svg
        width={size}
        height={size * 1.2}
        viewBox="0 0 120 144"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        {/* Blue gradient background */}
        <rect
          width="120"
          height="120"
          fill="url(#blueGradient)"
          rx="8"
        />
        
        {/* Alarm clock body - main circle */}
        <circle
          cx="60"
          cy="60"
          r="35"
          fill="white"
          stroke="white"
          strokeWidth="2"
        />
        
        {/* Left alarm bell */}
        <ellipse
          cx="30"
          cy="35"
          rx="8"
          ry="10"
          fill="white"
          transform="rotate(-20 30 35)"
        />
        
        {/* Right alarm bell */}
        <ellipse
          cx="90"
          cy="35"
          rx="8"
          ry="10"
          fill="white"
          transform="rotate(20 90 35)"
        />
        
        {/* Wind-up keys */}
        <circle cx="22" cy="28" r="3" fill="white" />
        <circle cx="98" cy="28" r="3" fill="white" />
        
        {/* Dollar sign in center */}
        <text
          x="60"
          y="68"
          fontSize="24"
          fontWeight="bold"
          fill="#6B7AED"
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
        >
          $
        </text>
        
        {/* Clock legs */}
        <rect x="45" y="90" width="5" height="15" fill="white" transform="rotate(-15 47.5 97.5)" />
        <rect x="70" y="90" width="5" height="15" fill="white" transform="rotate(15 72.5 97.5)" />
        
        {/* Leg feet */}
        <ellipse cx="40" cy="105" rx="6" ry="3" fill="white" />
        <ellipse cx="80" cy="105" rx="6" ry="3" fill="white" />
        
        {/* DIME TIME text */}
        <text
          x="60"
          y="135"
          fontSize="12"
          fontWeight="bold"
          fill="white"
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
          letterSpacing="2px"
        >
          DIME TIME
        </text>
        
        <defs>
          <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B9FFF" />
            <stop offset="100%" stopColor="#6B7AED" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}