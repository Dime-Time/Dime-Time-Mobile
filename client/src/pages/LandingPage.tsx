import { Button } from "@/components/ui/button";
import { LogoWithText } from "@/components/logo";

export default function LandingPage() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-[#918EF4] text-white flex flex-col">
      {/* Header */}
      <header className="w-full py-6 px-4">
        <div className="max-w-6xl mx-auto flex justify-end items-center">
          <Button 
            onClick={handleLogin}
            className="bg-white text-[#918EF4] hover:bg-gray-100 font-semibold"
            data-testid="button-login"
          >
            Sign In with Replit
          </Button>
        </div>
      </header>

      {/* Hero Section with Centered Logo */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="flex flex-col items-center justify-center space-y-8">
          {/* Centered Official Logo */}
          <div className="flex items-center justify-center scale-150 md:scale-200">
            <LogoWithText />
          </div>

          {/* Login Button */}
          <div className="flex flex-col items-center space-y-4">
            <Button 
              onClick={handleLogin}
              size="lg"
              className="bg-white text-[#918EF4] hover:bg-gray-100 font-semibold text-lg px-8 py-4"
              data-testid="button-get-started"
            >
              Sign In with Replit
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-4 text-center text-white/60">
        <p>&copy; 2025 Dime Time. Get out of debt one dime at a time.</p>
      </footer>
    </div>
  );
}