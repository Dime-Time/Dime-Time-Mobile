import appIcon from "@assets/app-icon.png";

export default function Landing() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#918EF4' }}>
      <div className="text-center px-8">
        {/* Logo */}
        <div className="mb-12">
          <img 
            src={appIcon} 
            alt="Dime Time Logo" 
            className="w-32 h-32 mx-auto mb-8"
          />
        </div>
        
        {/* Main Message */}
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
          Get out of debt, one dime at a time with Dime Time.
        </h1>
        
        {/* Coming Soon */}
        <h2 className="text-3xl md:text-4xl font-semibold text-white">
          Coming soon!
        </h2>
      </div>
    </div>
  );
}