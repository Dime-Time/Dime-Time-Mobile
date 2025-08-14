import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/navigation";

import Dashboard from "@/pages/dashboard";
import Transactions from "@/pages/transactions";
import Debts from "@/pages/debts";
import Crypto from "@/pages/crypto";
import Insights from "@/pages/insights";
import Banking from "@/pages/banking";
import QRCodePage from "@/pages/qr";
import Settings from "@/pages/settings";
import Notifications from "@/pages/notifications";
import Legal from "@/pages/legal";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/transactions" component={Transactions} />
      <Route path="/debts" component={Debts} />
      <Route path="/crypto" component={Crypto} />
      <Route path="/insights" component={Insights} />
      <Route path="/banking" component={Banking} />
      <Route path="/qr" component={QRCodePage} />
      <Route path="/settings" component={Settings} />
      <Route path="/notifications" component={Notifications} />
      <Route path="/legal" component={Legal} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-dime-lilac">
          <AppContent />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function AppContent() {
  return (
    <>
      <Navigation />
      <Router />
    </>
  );
}

export default App;
