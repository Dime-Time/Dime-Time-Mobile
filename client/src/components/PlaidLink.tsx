import { useCallback, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Loader2, CreditCard } from 'lucide-react';

interface PlaidLinkProps {
  onSuccess?: (publicToken: string, metadata: any) => void;
  onExit?: () => void;
}

export function PlaidLink({ onSuccess, onExit }: PlaidLinkProps) {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleOnSuccess = useCallback(
    async (publicToken: string, metadata: any) => {
      setIsLoading(true);
      try {
        // Exchange public token for access token
        const response = await apiRequest('/api/plaid/exchange-token', {
          method: 'POST',
          body: JSON.stringify({ publicToken }),
        });

        if (response.ok) {
          const data = await response.json();
          toast({
            title: "Bank Account Connected",
            description: "Your bank account has been successfully linked to Dime Time!",
          });
          onSuccess?.(publicToken, metadata);
        } else {
          throw new Error('Failed to exchange token');
        }
      } catch (error) {
        console.error('Error connecting bank account:', error);
        toast({
          title: "Connection Failed",
          description: "Failed to connect your bank account. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [onSuccess, toast]
  );

  const handleOnExit = useCallback(() => {
    console.log('Plaid Link exited');
    onExit?.();
  }, [onExit]);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: handleOnSuccess,
    onExit: handleOnExit,
  });

  const createLinkToken = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest('/api/plaid/create-link-token', {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setLinkToken(data.linkToken);
      } else {
        throw new Error('Failed to create link token');
      }
    } catch (error) {
      console.error('Error creating link token:', error);
      toast({
        title: "Setup Error",
        description: "Failed to initialize bank connection. Please ensure Plaid credentials are configured.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = () => {
    if (linkToken && ready) {
      open();
    } else {
      createLinkToken();
    }
  };

  return (
    <Button
      onClick={handleConnect}
      disabled={isLoading || (linkToken && !ready)}
      className="flex items-center space-x-2"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <CreditCard className="w-4 h-4" />
      )}
      <span>
        {isLoading ? 'Connecting...' : 'Connect Bank Account'}
      </span>
    </Button>
  );
}