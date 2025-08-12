interface QRCodeProps {
  url: string;
  size?: number;
  className?: string;
}

export function QRCode({ url, size = 200, className = "" }: QRCodeProps) {
  // Simple QR code generator using qr-server.com API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}`;
  
  return (
    <div className={`inline-block ${className}`}>
      <img 
        src={qrCodeUrl} 
        alt={`QR Code for ${url}`}
        width={size}
        height={size}
        className="border rounded-lg shadow-sm"
      />
    </div>
  );
}