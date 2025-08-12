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
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
      >
        {/* Left bell */}
        <circle cx="20" cy="18" r="8" fill="#6B7AED" stroke="#6B7AED" strokeWidth="2" />
        
        {/* Right bell */}
        <circle cx="44" cy="18" r="8" fill="#6B7AED" stroke="#6B7AED" strokeWidth="2" />
        
        {/* Main clock body */}
        <circle cx="32" cy="32" r="16" fill="#6B7AED" stroke="#6B7AED" strokeWidth="3" />
        
        {/* Inner white circle */}
        <circle cx="32" cy="32" r="12" fill="white" stroke="white" strokeWidth="1" />
        
        {/* Dollar sign */}
        <text
          x="32"
          y="36"
          fontSize="12"
          fontWeight="bold"
          fill="#6B7AED"
          textAnchor="middle"
          fontFamily="system-ui, sans-serif"
        >
          $
        </text>
        
        {/* Left leg */}
        <line x1="26" y1="48" x2="22" y2="58" stroke="#6B7AED" strokeWidth="3" strokeLinecap="round" />
        
        {/* Right leg */}
        <line x1="38" y1="48" x2="42" y2="58" stroke="#6B7AED" strokeWidth="3" strokeLinecap="round" />
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