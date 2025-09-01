import { Link, useLocation } from "wouter";
import { 
  CreditCard, 
  Home, 
  TrendingUp, 
  Receipt,
  Menu,
  User,
  Bitcoin,
  Coins,
  QrCode,
  Bell,
  Settings,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/logo";

export function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/transactions", label: "Transactions", icon: Receipt },
    { href: "/debts", label: "Debts", icon: CreditCard },
    { href: "/crypto", label: "Crypto", icon: Bitcoin },
    { href: "/dime-token", label: "DTT", icon: Coins },
    { href: "/banking", label: "Banking", icon: CreditCard },
    { href: "/insights", label: "Insights", icon: TrendingUp },
    { href: "/business-analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="shadow-sm border-b border-white/20 sticky top-0 z-1" style={{ backgroundColor: 'var(--dime-background)' }}>
        <div className="w-full mx-auto px-2 sm:px-4">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Logo and Title */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <div className="mt-1">
                <Logo size={28} />
              </div>
              <span className="text-lg md:text-xl font-black text-white z-50 relative">Dime Time</span>
            </div>
            
            {/* Center - Desktop Navigation (hidden on mobile) */}
            <div className="hidden md:flex items-center space-x-6 flex-1 justify-center">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-medium transition-colors ${
                    location === item.href
                      ? "text-white font-bold"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Right side - Icons */}
            <div className="flex items-center space-x-1 md:space-x-3 flex-shrink-0">
              {/* Desktop Icons */}
              <div className="hidden md:flex items-center space-x-3">
                <Link href="/notifications">
                  <Button variant="ghost" size="icon" className="text-white/70 hover:text-white relative">
                    <Bell className="w-5 h-5" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">3</span>
                    </div>
                  </Button>
                </Link>
                <Link href="/settings">
                  <Button variant="ghost" size="icon" className="text-white/70 hover:text-white">
                    <Settings className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/qr">
                  <Button variant="ghost" size="icon" className="text-white/70 hover:text-white">
                    <QrCode className="w-5 h-5" />
                  </Button>
                </Link>
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </div>
              
              {/* Mobile - Just notifications and menu */}
              <Link href="/notifications" className="md:hidden">
                <Button variant="ghost" size="icon" className="text-white/70 hover:text-white relative w-10 h-10">
                  <Bell className="w-5 h-5" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">3</span>
                  </div>
                </Button>
              </Link>
              
              {/* Mobile menu trigger */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden w-10 h-10 text-white">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent style={{ backgroundColor: 'var(--dime-background)' }}>
                  <div className="flex flex-col space-y-4 mt-8">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                            location === item.href
                              ? "bg-white/20 text-white"
                              : "text-white/70 hover:bg-white/10"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      );
                    })}
                    
                    <div className="border-t border-white/20 pt-4 mt-4">
                      <Link
                        href="/notifications"
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                          location === "/notifications"
                            ? "bg-white/20 text-white"
                            : "text-white/70 hover:bg-white/10"
                        }`}
                      >
                        <Bell className="w-5 h-5" />
                        <span className="font-medium">Notifications</span>
                        <div className="w-2 h-2 bg-red-500 rounded-full ml-auto"></div>
                      </Link>
                      
                      <Link
                        href="/settings"
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                          location === "/settings"
                            ? "bg-white/20 text-white"
                            : "text-white/70 hover:bg-white/10"
                        }`}
                      >
                        <Settings className="w-5 h-5" />
                        <span className="font-medium">Settings</span>
                      </Link>
                      
                      <Link
                        href="/qr"
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                          location === "/qr"
                            ? "bg-white/20 text-white"
                            : "text-white/70 hover:bg-white/10"
                        }`}
                      >
                        <QrCode className="w-5 h-5" />
                        <span className="font-medium">QR Code</span>
                      </Link>
                      

                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom Footer Navigation - Always Visible */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-white/20 px-1 py-1 z-50" style={{ backgroundColor: 'var(--dime-background)' }}>
        <div className="flex justify-between items-center max-w-screen-xl mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center py-2 px-1 min-w-0 flex-1 transition-colors ${
                  location === item.href
                    ? "text-white"
                    : "text-white/70"
                }`}
                style={{ maxWidth: `${100/navItems.length}%` }}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span 
                  className="text-center leading-none truncate w-full block" 
                  style={{ fontSize: '10px', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
