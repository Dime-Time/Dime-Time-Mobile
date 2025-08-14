import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";

export function CoinbaseStatus() {
  const { data: serviceStatus, isLoading } = useQuery({
    queryKey: ['/api/service-status'],
  });

  if (isLoading) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Checking Coinbase connection...</AlertDescription>
      </Alert>
    );
  }

  const coinbaseStatus = serviceStatus?.coinbase;

  if (!coinbaseStatus) {
    return null;
  }

  if (coinbaseStatus.configured) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <div className="flex items-center justify-between">
            <span>Coinbase integration is active - real crypto purchases enabled</span>
            <Badge variant="default" className="bg-green-600">Connected</Badge>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="border-orange-200 bg-orange-50">
      <XCircle className="h-4 w-4 text-orange-600" />
      <AlertDescription className="text-orange-800">
        <div className="flex items-center justify-between">
          <span>Coinbase not configured - using demo mode for crypto purchases</span>
          <Badge variant="outline" className="border-orange-600 text-orange-600">Demo Mode</Badge>
        </div>
      </AlertDescription>
    </Alert>
  );
}