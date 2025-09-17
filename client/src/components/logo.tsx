import logoImage from "@assets/D22C55D0-9527-4CE7-863F-F9327653E73E_1755411050022.png";
import newLogoImage from "@assets/9C86D612-C9E4-448E-8F8B-CC8F618BAE03_1756051233947.png";
import transparentLogoImage from "@assets/D22C55D0-9527-4CE7-863F-F9327653E73E_1756052612472.png";
import appIconImage from "@assets/9C86D612-C9E4-448E-8F8B-CC8F618BAE03_1756051233947.png";
import transparentClockLogo from "@assets/generated_images/White_transparent_clock_logo_bfaa3447.png";

interface LogoProps {
  className?: string;
  size?: number;
  clean?: boolean;
}

export function Logo({ className = "", size = 32, clean = false }: LogoProps) {
  if (clean) {
    return (
      <div className={`relative logo-clean ${className}`} style={{ width: size, height: size }}>
        <img 
          src={transparentClockLogo} 
          alt="Dime Time Official Logo" 
          width={size} 
          height={size}
          className="logo-image-clean object-contain"
          style={{ 
            backgroundColor: 'transparent'
          }}
        />
      </div>
    );
  }

  return (
    <div className={`relative logo-outline ${className}`} style={{ width: size, height: size }}>
      <div className="relative">
        {/* Dark purple outline layer */}
        <img 
          src={transparentLogoImage} 
          alt="" 
          width={size} 
          height={size}
          className="absolute object-contain"
          style={{ 
            filter: `brightness(0) saturate(100%) invert(21%) sepia(85%) saturate(1654%) hue-rotate(230deg) brightness(93%) contrast(106%)`,
            transform: 'translate(-1px, -1px)',
            backgroundColor: 'transparent'
          }}
        />
        <img 
          src={transparentLogoImage} 
          alt="" 
          width={size} 
          height={size}
          className="absolute object-contain"
          style={{ 
            filter: `brightness(0) saturate(100%) invert(21%) sepia(85%) saturate(1654%) hue-rotate(230deg) brightness(93%) contrast(106%)`,
            transform: 'translate(1px, -1px)',
            backgroundColor: 'transparent'
          }}
        />
        <img 
          src={transparentLogoImage} 
          alt="" 
          width={size} 
          height={size}
          className="absolute object-contain"
          style={{ 
            filter: `brightness(0) saturate(100%) invert(21%) sepia(85%) saturate(1654%) hue-rotate(230deg) brightness(93%) contrast(106%)`,
            transform: 'translate(-1px, 1px)',
            backgroundColor: 'transparent'
          }}
        />
        <img 
          src={transparentLogoImage} 
          alt="" 
          width={size} 
          height={size}
          className="absolute object-contain"
          style={{ 
            filter: `brightness(0) saturate(100%) invert(21%) sepia(85%) saturate(1654%) hue-rotate(230deg) brightness(93%) contrast(106%)`,
            transform: 'translate(1px, 1px)',
            backgroundColor: 'transparent'
          }}
        />
        {/* White logo on top */}
        <img 
          src={transparentLogoImage} 
          alt="Dime Time Official Logo" 
          width={size} 
          height={size}
          className="relative object-contain"
          style={{ 
            filter: `brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)`,
            backgroundColor: 'transparent'
          }}
        />
      </div>
    </div>
  );
}

// Version with DIME TIME text for standalone use - using official logo design
export function LogoWithText({ className = "", size = 120 }: LogoProps) {
  return (
    <div className={`flex flex-col items-center logo-with-text-outlined ${className}`} style={{ width: size * 1.2 }}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* Dark purple outline layer */}
        <img 
          src={transparentLogoImage} 
          alt="" 
          width={size} 
          height={size}
          className="absolute object-contain"
          style={{ 
            filter: `brightness(0) saturate(100%) invert(21%) sepia(85%) saturate(1654%) hue-rotate(230deg) brightness(93%) contrast(106%)`,
            transform: 'translate(-1px, -1px)',
            backgroundColor: 'transparent'
          }}
        />
        <img 
          src={transparentLogoImage} 
          alt="" 
          width={size} 
          height={size}
          className="absolute object-contain"
          style={{ 
            filter: `brightness(0) saturate(100%) invert(21%) sepia(85%) saturate(1654%) hue-rotate(230deg) brightness(93%) contrast(106%)`,
            transform: 'translate(1px, -1px)',
            backgroundColor: 'transparent'
          }}
        />
        <img 
          src={transparentLogoImage} 
          alt="" 
          width={size} 
          height={size}
          className="absolute object-contain"
          style={{ 
            filter: `brightness(0) saturate(100%) invert(21%) sepia(85%) saturate(1654%) hue-rotate(230deg) brightness(93%) contrast(106%)`,
            transform: 'translate(-1px, 1px)',
            backgroundColor: 'transparent'
          }}
        />
        <img 
          src={transparentLogoImage} 
          alt="" 
          width={size} 
          height={size}
          className="absolute object-contain"
          style={{ 
            filter: `brightness(0) saturate(100%) invert(21%) sepia(85%) saturate(1654%) hue-rotate(230deg) brightness(93%) contrast(106%)`,
            transform: 'translate(1px, 1px)',
            backgroundColor: 'transparent'
          }}
        />
        {/* White logo on top */}
        <img 
          src={transparentLogoImage} 
          alt="Dime Time Official Logo" 
          width={size} 
          height={size}
          className="relative object-contain"
          style={{ 
            filter: `brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)`,
            backgroundColor: 'transparent'
          }}
        />
      </div>
      <div className="mt-2">
        <span 
          className="font-bold text-white tracking-wide logo-text"
          style={{ 
            fontSize: size * 0.12,
            letterSpacing: '2px',
            textShadow: `-2px -2px 0 #5a56a8,
                         2px -2px 0 #5a56a8,
                         -2px 2px 0 #5a56a8,
                         2px 2px 0 #5a56a8,
                         0 0 3px #5a56a8`
          }}
        >
          DIME TIME
        </span>
      </div>
    </div>
  );
}