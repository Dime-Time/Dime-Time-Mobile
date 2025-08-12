import { Link, useLocation } from "wouter";
import { 
  CreditCard, 
  Home, 
  TrendingUp, 
  Receipt,
  Menu,
  User,
  Bitcoin,
  QrCode,
  Bell,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/logo";

export function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/transactions", label: "Transactions", icon: Receipt },
    { href: "/debts", label: "Debts", icon: CreditCard },
    { href: "/crypto", label: "Crypto", icon: Bitcoin },
    { href: "/insights", label: "Insights", icon: TrendingUp },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center justify-center space-x-3">
              <div className="mt-1">
                <Logo size={32} />
              </div>
              <span className="text-xl font-black text-black">Dime Time</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-medium transition-colors ${
                    location === item.href
                      ? "text-dime-purple"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/notifications">
                <Button variant="ghost" size="icon" className="text-slate-600 hover:text-slate-900 relative">
                  <Bell className="w-5 h-5" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">3</span>
                  </div>
                </Button>
              </Link>
              <Link href="/settings">
                <Button variant="ghost" size="icon" className="text-slate-600 hover:text-slate-900">
                  <Settings className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/qr">
                <Button variant="ghost" size="icon" className="text-slate-600 hover:text-slate-900">
                  <QrCode className="w-5 h-5" />
                </Button>
              </Link>
              <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-slate-600" />
              </div>
              
              {/* Mobile menu trigger */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="flex flex-col space-y-4 mt-8">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                            location === item.href
                              ? "bg-dime-purple/10 text-dime-purple"
                              : "text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      );
                    })}
                    
                    <div className="border-t pt-4 mt-4">
                      <Link
                        href="/notifications"
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                          location === "/notifications"
                            ? "bg-dime-purple/10 text-dime-purple"
                            : "text-slate-600 hover:bg-slate-100"
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
                            ? "bg-dime-purple/10 text-dime-purple"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <Settings className="w-5 h-5" />
                        <span className="font-medium">Settings</span>
                      </Link>
                      
                      <Link
                        href="/qr"
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                          location === "/qr"
                            ? "bg-dime-purple/10 text-dime-purple"
                            : "text-slate-600 hover:bg-slate-100"
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

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 z-50">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center py-2 transition-colors ${
                  location === item.href
                    ? "text-dime-purple"
                    : "text-slate-400"
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
