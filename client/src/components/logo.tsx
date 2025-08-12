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
        {/* Main circular background */}
        <circle
          cx="24"
          cy="24"
          r="22"
          fill="url(#logoGradient)"
          stroke="hsl(260, 35%, 80%)"
          strokeWidth="2"
        />
        
        {/* Inner circle */}
        <circle
          cx="24"
          cy="24"
          r="18"
          fill="white"
          stroke="hsl(260, 35%, 80%)"
          strokeWidth="1"
        />
        
        {/* "DIME" text at top */}
        <text
          x="24"
          y="18"
          fontSize="8"
          fontWeight="bold"
          fill="hsl(260, 35%, 80%)"
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
          letterSpacing="1px"
        >
          DIME
        </text>
        
        {/* Large dollar sign in center */}
        <text
          x="24"
          y="28"
          fontSize="14"
          fontWeight="bold"
          fill="hsl(260, 35%, 80%)"
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
        >
          $
        </text>
        
        {/* "TIME" text at bottom */}
        <text
          x="24"
          y="34"
          fontSize="8"
          fontWeight="bold"
          fill="hsl(260, 35%, 80%)"
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
          letterSpacing="1px"
        >
          TIME
        </text>
        
        {/* Decorative dots around the circle */}
        <g fill="hsl(260, 35%, 80%)">
          <circle cx="24" cy="6" r="1" />
          <circle cx="42" cy="24" r="1" />
          <circle cx="24" cy="42" r="1" />
          <circle cx="6" cy="24" r="1" />
        </g>
        
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(270, 30%, 88%)" />
            <stop offset="100%" stopColor="hsl(280, 25%, 92%)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}