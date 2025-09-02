import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";

interface ServiceStatus {
  coinbase?: {
    configured: boolean;
    status: string;
  };
  plaid?: {
    configured: boolean;
    status: string;
  };
}

export function CoinbaseStatus() {
  const { data: serviceStatus, isLoading } = useQuery<ServiceStatus>({
    queryKey: ['/api/service-status'],
  });

  if (isLoading) {
    return (
      <Alert className="bg-[#918EF4] border-[#918EF4]">
        <AlertCircle className="h-4 w-4 text-white" />
        <AlertDescription className="text-white">Checking Coinbase connection...</AlertDescription>
      </Alert>
    );
  }

  const coinbaseStatus = serviceStatus?.coinbase;

  if (!coinbaseStatus) {
    return null;
  }

  if (coinbaseStatus.configured) {
    return (
      <Alert className="bg-[#918EF4] border-[#918EF4]">
        <CheckCircle className="h-4 w-4 text-white" />
        <AlertDescription className="text-white">
          <div className="flex items-center justify-between">
            <span>Coinbase integration is active - real crypto purchases enabled</span>
            <Badge variant="default" className="bg-white text-[#918EF4] border-white hover:bg-white">Connected</Badge>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="bg-[#918EF4] border-[#918EF4]">
      <XCircle className="h-4 w-4 text-white" />
      <AlertDescription className="text-white">
        <div className="flex items-center justify-between">
          <span>Coinbase not configured - using demo mode for crypto purchases</span>
          <Badge variant="outline" className="border-white text-white hover:bg-white hover:text-[#918EF4]">Demo Mode</Badge>
        </div>
      </AlertDescription>
    </Alert>
  );
}