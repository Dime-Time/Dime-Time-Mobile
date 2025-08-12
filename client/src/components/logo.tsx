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
        viewBox="0 0 40 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
      >
        {/* Main clock body */}
        <circle cx="20" cy="20" r="12" fill="#6B7AED" />
        
        {/* Inner white clock face */}
        <circle cx="20" cy="20" r="9" fill="white" />
        
        {/* Left alarm bell - positioned on upper left side */}
        <circle cx="9" cy="12" r="5" fill="#6B7AED" />
        
        {/* Right alarm bell - positioned on upper right side */}
        <circle cx="31" cy="12" r="5" fill="#6B7AED" />
        
        {/* Bell wind-up keys */}
        <circle cx="6" cy="9" r="1.5" fill="#6B7AED" />
        <circle cx="34" cy="9" r="1.5" fill="#6B7AED" />
        
        {/* Dollar sign in center */}
        <text
          x="20"
          y="24"
          fontSize="10"
          fontWeight="bold"
          fill="#6B7AED"
          textAnchor="middle"
          fontFamily="system-ui, sans-serif"
        >
          $
        </text>
        
        {/* Left leg */}
        <line x1="15" y1="32" x2="12" y2="40" stroke="#6B7AED" strokeWidth="2.5" strokeLinecap="round" />
        
        {/* Right leg */}
        <line x1="25" y1="32" x2="28" y2="40" stroke="#6B7AED" strokeWidth="2.5" strokeLinecap="round" />
        
        {/* Leg feet */}
        <circle cx="12" cy="40" r="2" fill="#6B7AED" />
        <circle cx="28" cy="40" r="2" fill="#6B7AED" />
      </svg>
    </div>
  );
}

// Version with DIME TIME text for standalone use
export function LogoWithText({ className = "", size = 120 }: LogoProps) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size * 1.3 }}>
      <svg
        width={size}
        height={size * 1.3}
        viewBox="0 0 100 130"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        {/* Blue gradient background */}
        <rect
          width="100"
          height="100"
          fill="url(#blueGradientWithText)"
          rx="8"
        />
        
        {/* Left alarm bell */}
        <circle
          cx="30"
          cy="30"
          r="12"
          fill="white"
        />
        
        {/* Right alarm bell */}
        <circle
          cx="70"
          cy="30"
          r="12"
          fill="white"
        />
        
        {/* Main clock body - large circle */}
        <circle
          cx="50"
          cy="50"
          r="22"
          fill="white"
        />
        
        {/* Inner clock ring */}
        <circle
          cx="50"
          cy="50"
          r="18"
          fill="none"
          stroke="url(#blueGradientWithText)"
          strokeWidth="3"
        />
        
        {/* Dollar sign in center */}
        <text
          x="50"
          y="58"
          fontSize="20"
          fontWeight="bold"
          fill="url(#blueGradientWithText)"
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
        >
          $
        </text>
        
        {/* Left clock leg */}
        <rect 
          x="40" 
          y="72" 
          width="4" 
          height="12" 
          fill="white"
          transform="rotate(-20 42 78)"
        />
        
        {/* Right clock leg */}
        <rect 
          x="56" 
          y="72" 
          width="4" 
          height="12" 
          fill="white"
          transform="rotate(20 58 78)"
        />
        
        {/* Left leg foot */}
        <ellipse 
          cx="36" 
          cy="86" 
          rx="6" 
          ry="3" 
          fill="white"
        />
        
        {/* Right leg foot */}
        <ellipse 
          cx="64" 
          cy="86" 
          rx="6" 
          ry="3" 
          fill="white"
        />
        
        {/* DIME TIME text */}
        <text
          x="50"
          y="115"
          fontSize="12"
          fontWeight="bold"
          fill="white"
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
          letterSpacing="2px"
        >
          DIME TIME
        </text>
        
        <defs>
          <linearGradient id="blueGradientWithText" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9BB5FF" />
            <stop offset="100%" stopColor="#6B7AED" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}