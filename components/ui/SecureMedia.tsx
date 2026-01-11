import React, { useState, useRef, useEffect } from 'react';
import { useSecureMedia } from '../../hooks/useSecureMedia';
import { Maximize, Settings, Play, Pause, Volume2, VolumeX, ShieldCheck } from 'lucide-react';

interface MediaProps {
  src: string;
  alt?: string;
  className?: string;
  poster?: string;
  onView?: () => void;
}

export const ProtectedImage: React.FC<MediaProps> = ({ src, alt, className }) => {
  const { secureUrl, loading } = useSecureMedia(src);

  if (loading) return <div className={`${className} bg-neutral-900 animate-pulse`} />;

  return (
    <img 
      src={secureUrl} 
      alt={alt} 
      className={className} 
      onContextMenu={(e) => e.preventDefault()}
      draggable={false}
    />
  );
};

export const ProtectedVideo: React.FC<MediaProps> = ({ src, className, poster, onView }) => {
  const { secureUrl, loading } = useSecureMedia(src);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [quality, setQuality] = useState('1080p');
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasTriggeredView = useRef(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
      if (!hasTriggeredView.current) {
        onView?.();
        hasTriggeredView.current = true;
      }
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  };

  if (loading) return <div className={`${className} bg-neutral-900 animate-pulse`} />;

  return (
    <div 
      ref={containerRef}
      className={`relative group flex flex-col items-center justify-center bg-black overflow-hidden ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => {
        setShowControls(false);
        setShowQualityMenu(false);
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <video
        ref={videoRef}
        src={secureUrl}
        className="w-full h-full object-contain"
        poster={poster}
        playsInline
        onClick={togglePlay}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="absolute inset-0 z-10 cursor-pointer" onClick={togglePlay}></div>

      <div className={`absolute inset-x-0 bottom-0 z-20 p-4 bg-gradient-to-t from-black/90 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={togglePlay} className="text-white hover:text-crimson-500 transition-colors">
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            </button>
            <button onClick={toggleMute} className="text-white hover:text-crimson-500 transition-colors">
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex items-center gap-6">
             <div className="relative">
                <button 
                  onClick={() => setShowQualityMenu(!showQualityMenu)}
                  className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-white/70 hover:text-white transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>{quality}</span>
                </button>
                
                {showQualityMenu && (
                  <div className="absolute bottom-full right-0 mb-2 w-32 bg-neutral-900 border border-white/10 rounded overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
                    {['2160p (4K)', '1080p', '720p', 'Auto'].map((q) => (
                      <button
                        key={q}
                        onClick={() => {
                          setQuality(q.includes(' ') ? q.split(' ')[0] : q);
                          setShowQualityMenu(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-[10px] uppercase tracking-wider hover:bg-crimson-900/20 transition-colors ${quality === q || (q === '1080p' && quality === '1080p') ? 'text-crimson-500' : 'text-neutral-400'}`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
             </div>

             <button onClick={handleFullscreen} className="text-white hover:text-crimson-500 transition-colors">
                <Maximize className="w-5 h-5" />
             </button>
          </div>
        </div>
      </div>

      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 opacity-30 pointer-events-none">
        <ShieldCheck className="w-3 h-3 text-crimson-500" />
        <span className="text-[8px] uppercase tracking-[0.3em] text-white font-bold">Encrypted Stream</span>
      </div>
      
      {!isPlaying && !loading && (
        <div className="absolute inset-0 flex items-center justify-center z-15 pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-crimson-900/20 border border-crimson-600/50 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
            <Play className="w-6 h-6 text-white fill-white ml-1" />
          </div>
        </div>
      )}
    </div>
  );
};