import logoImage from "@assets/D22C55D0-9527-4CE7-863F-F9327653E73E_1755411050022.png";
import newLogoImage from "@assets/9C86D612-C9E4-448E-8F8B-CC8F618BAE03_1756051233947.png";
import transparentLogoImage from "@assets/D22C55D0-9527-4CE7-863F-F9327653E73E_1756052612472.png";
import appIconImage from "@assets/9C86D612-C9E4-448E-8F8B-CC8F618BAE03_1756051233947.png";

interface LogoProps {
  className?: string;
  size?: number;
  clean?: boolean;
}

export function Logo({ className = "", size = 32, clean = false }: LogoProps) {
  const maskStyle = {
    width: size,
    height: size,
    backgroundColor: '#FFFFFF',
    WebkitMaskImage: `url(${transparentLogoImage})`,
    maskImage: `url(${transparentLogoImage})`,
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskSize: 'contain',
    maskSize: 'contain',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
  } as const;

  return (
    <div 
      className={`relative ${className}`} 
      style={maskStyle} 
      aria-label="Dime Time Logo" 
    />
  );
}

// Version with DIME TIME text for standalone use - using official logo design
export function LogoWithText({ className = "", size = 120 }: LogoProps) {
  const maskStyle = {
    width: size,
    height: size,
    backgroundColor: '#FFFFFF',
    WebkitMaskImage: `url(${transparentLogoImage})`,
    maskImage: `url(${transparentLogoImage})`,
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskSize: 'contain',
    maskSize: 'contain',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
  } as const;

  return (
    <div className={`flex flex-col items-center ${className}`} style={{ width: size * 1.2 }}>
      <div 
        style={maskStyle} 
        aria-label="Dime Time Logo"
      />
      <div className="mt-2">
        <span 
          className="font-bold text-white tracking-wide"
          style={{ 
            fontSize: size * 0.12,
            letterSpacing: '2px',
            color: '#FFFFFF'
          }}
        >
          DIME TIME
        </span>
      </div>
    </div>
  );
}