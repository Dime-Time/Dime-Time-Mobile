import { QRCode } from "@/components/QRCode";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Download, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function QRCodePage() {
  const { toast } = useToast();
  
  // Get the current domain from the window location
  const appUrl = window.location.origin;
  
  const handleCopyUrl = () => {
    navigator.clipboard.writeText(appUrl);
    toast({
      title: "URL Copied",
      description: "The app URL has been copied to your clipboard",
    });
  };

  const handleDownloadQR = () => {
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(appUrl)}`;
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'dime-time-qr-code.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "QR Code Downloaded",
      description: "The QR code has been saved to your downloads",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-2">
          Dime Time Mobile Access
        </h1>
        <p className="text-slate-600">
          Scan this QR code with your phone to access Dime Time instantly
        </p>
      </div>

      <Card className="text-center">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            <Smartphone className="w-5 h-5 text-dime-purple" />
            Quick Access QR Code
          </CardTitle>
          <CardDescription>
            Point your phone's camera at the QR code below to open Dime Time
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <QRCode url={appUrl} size={250} />
          </div>
          
          <div className="text-sm text-slate-600 bg-dime-lilac/5 border border-dime-lilac/10 p-3 rounded-lg">
            <strong>URL:</strong> {appUrl}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={handleCopyUrl} variant="outline" className="flex items-center gap-2">
              <Copy className="w-4 h-4" />
              Copy URL
            </Button>
            <Button onClick={handleDownloadQR} className="flex items-center gap-2 bg-dime-purple hover:bg-dime-accent">
              <Download className="w-4 h-4" />
              Download QR Code
            </Button>
          </div>
          
          <div className="text-xs text-slate-500 mt-4">
            <p>
              <strong>How to use:</strong> Open your phone's camera app and point it at the QR code. 
              Tap the notification that appears to open Dime Time in your mobile browser.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}