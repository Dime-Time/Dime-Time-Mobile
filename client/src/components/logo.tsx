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
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
      >
        {/* Blue gradient background */}
        <rect
          width="80"
          height="80"
          fill="url(#blueGradient)"
          rx="8"
        />
        
        {/* Main alarm clock body */}
        <circle
          cx="40"
          cy="40"
          r="20"
          fill="white"
          stroke="white"
          strokeWidth="1"
        />
        
        {/* Left alarm bell */}
        <circle
          cx="25"
          cy="25"
          r="8"
          fill="white"
        />
        <circle
          cx="25"
          cy="25"
          r="6"
          fill="white"
          stroke="none"
        />
        
        {/* Right alarm bell */}
        <circle
          cx="55"
          cy="25"
          r="8"
          fill="white"
        />
        <circle
          cx="55"
          cy="25"
          r="6"
          fill="white"
          stroke="none"
        />
        
        {/* Wind-up keys */}
        <circle cx="18" cy="20" r="2.5" fill="white" />
        <circle cx="62" cy="20" r="2.5" fill="white" />
        
        {/* Dollar sign in center */}
        <text
          x="40"
          y="46"
          fontSize="18"
          fontWeight="bold"
          fill="#6B7AED"
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
        >
          $
        </text>
        
        {/* Clock legs */}
        <rect x="32" y="58" width="3" height="12" fill="white" transform="rotate(-15 33.5 64)" />
        <rect x="45" y="58" width="3" height="12" fill="white" transform="rotate(15 46.5 64)" />
        
        {/* Leg feet */}
        <ellipse cx="28" cy="72" rx="5" ry="2" fill="white" />
        <ellipse cx="52" cy="72" rx="5" ry="2" fill="white" />
        
        <defs>
          <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A5B4FF" />
            <stop offset="100%" stopColor="#6B7AED" />
          </linearGradient>
        </defs>
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