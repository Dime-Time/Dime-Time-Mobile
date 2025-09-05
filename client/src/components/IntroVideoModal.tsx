import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Play, Pause, Volume2, VolumeX } from "lucide-react";
import introVideo from "@assets/Using_918ef4_as_202508312147_1757083629199.mp4";

interface IntroVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function IntroVideoModal({ isOpen, onClose }: IntroVideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      // Auto-play when modal opens
      videoRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  }, [isOpen]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    // Auto-close modal after 2 seconds when video ends
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-4xl w-full p-0 bg-black border-0 overflow-hidden"
      >
        <DialogTitle className="sr-only">Dime Time Welcome Video</DialogTitle>
        <DialogDescription className="sr-only">
          Welcome introduction video for new Dime Time users explaining how to get out of debt one dime at a time
        </DialogDescription>
        <div className="relative">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 p-0"
            onClick={onClose}
            data-testid="close-intro-video"
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Skip Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 left-4 z-50 bg-black/50 hover:bg-black/70 text-white rounded-lg px-3 py-2"
            onClick={handleSkip}
            data-testid="skip-intro-video"
          >
            Skip Intro
          </Button>

          {/* Video Container */}
          <div 
            className="relative w-full aspect-video bg-black rounded-lg overflow-hidden cursor-pointer"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
            onClick={togglePlay}
          >
            <video
              ref={videoRef}
              src={introVideo}
              className="w-full h-full object-cover"
              onEnded={handleVideoEnd}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              playsInline
              data-testid="intro-video-player"
            />

            {/* Video Controls Overlay */}
            <div 
              className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${
                showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {/* Center Play/Pause Button */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="bg-black/50 hover:bg-black/70 text-white rounded-full w-16 h-16 p-0"
                    onClick={togglePlay}
                    data-testid="play-pause-button"
                  >
                    <Play className="h-6 w-6 ml-1" />
                  </Button>
                </div>
              )}

              {/* Bottom Controls */}
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 p-0"
                  onClick={togglePlay}
                  data-testid="control-play-pause"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4 ml-0.5" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 p-0"
                  onClick={toggleMute}
                  data-testid="mute-button"
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Welcome Message Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <div className="text-white">
              <h2 className="text-2xl font-bold mb-2">Welcome to Dime Time!</h2>
              <p className="text-white/90">
                Get ready to transform your spare change into debt freedom, one dime at a time.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}