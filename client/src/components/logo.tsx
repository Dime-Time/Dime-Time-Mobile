import logoImage from "@assets/D22C55D0-9527-4CE7-863F-F9327653E73E_1755411050022.png";

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className = "", size = 32 }: LogoProps) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <img 
        src={logoImage} 
        alt="Dime Time Official Logo" 
        width={size} 
        height={size}
        className="object-contain drop-shadow-sm"
        style={{ 
          filter: 'brightness(1.1) contrast(1.2)',
          backgroundColor: 'transparent'
        }}
      />
    </div>
  );
}

// Version with DIME TIME text for standalone use - using official logo design
export function LogoWithText({ className = "", size = 120 }: LogoProps) {
  return (
    <div className={`flex flex-col items-center ${className}`} style={{ width: size * 1.2 }}>
      <div style={{ width: size, height: size }}>
        <img 
          src={logoImage} 
          alt="Dime Time Official Logo" 
          width={size} 
          height={size}
          className="object-contain drop-shadow-lg"
          style={{ 
            filter: 'brightness(1.1) contrast(1.2)',
            backgroundColor: 'transparent'
          }}
        />
      </div>
      <div className="mt-2">
        <span 
          className="font-bold text-black tracking-wide"
          style={{ 
            fontSize: size * 0.12,
            letterSpacing: '2px'
          }}
        >
          DIME TIME
        </span>
      </div>
    </div>
  );
}