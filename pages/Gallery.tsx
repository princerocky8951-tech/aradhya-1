
import React, { useState } from 'react';
import { useData } from '../context/MockBackend';
import { ShieldCheck, Zap, X, Maximize2, Camera, Film } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { MediaItem } from '../types';
import { ProtectedImage, ProtectedVideo } from '../components/ui/SecureMedia';

const Gallery: React.FC = () => {
  const { media, loading, addToHistory } = useData();
  const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null);

  // CRITICAL: Filter media to ONLY show items categorized as 'gallery'
  const galleryItems = media.filter(item => !item.category || item.category === 'gallery');
  const images = galleryItems.filter(item => item.type === 'image');
  const videos = galleryItems.filter(item => item.type === 'video');

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-20">
        <h1 className="text-5xl md:text-7xl font-serif mb-6 text-white tracking-tight uppercase">Sacred Archive</h1>
        <div className="flex items-center justify-center gap-3">
          <div className="h-px w-8 bg-crimson-900"></div>
          <div className="flex items-center gap-2 text-crimson-600 text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold">
            <ShieldCheck className="w-3 h-3 md:w-4 md:h-4" />
            <span>Authenticated Repository</span>
          </div>
          <div className="h-px w-8 bg-crimson-900"></div>
        </div>
        <div className="mt-8 flex justify-center">
           <div className="flex items-center gap-2 bg-crimson-950/20 border border-crimson-900/30 px-4 py-1.5 rounded-full">
              <Zap className="w-3 h-3 text-crimson-500 animate-pulse" />
              <span className="text-[10px] text-crimson-400 uppercase tracking-widest font-bold">Encrypted Manifestation</span>
           </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex flex-col justify-center items-center h-96 space-y-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-2 border-crimson-900/20 rounded-full"></div>
            <div className="absolute inset-0 border-t-2 border-crimson-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-neutral-600 text-xs uppercase tracking-[0.3em] animate-pulse">Decrypting Artifacts...</p>
        </div>
      ) : galleryItems.length === 0 ? (
        <div className="text-center py-32 bg-neutral-900/20 rounded-2xl border border-white/5 backdrop-blur-sm">
          <p className="text-neutral-500 italic font-serif text-xl opacity-60">The archives are currently silent.</p>
          <Link to="/contact" className="mt-8 inline-block">
             <Button variant="outline">Request Archive Deposition</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-32">
          {/* VIDEO SECTION */}
          {videos.length > 0 && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center gap-4 mb-12">
                <Film className="w-6 h-6 text-crimson-600" />
                <h2 className="text-3xl font-serif text-white tracking-widest uppercase">Cinematic Manifests</h2>
                <div className="flex-grow h-px bg-gradient-to-r from-crimson-900/30 to-transparent ml-4"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {videos.map((video) => (
                  <div key={video.id} className="group bg-neutral-900/40 border border-white/5 rounded-sm overflow-hidden flex flex-col hover:border-crimson-900/30 transition-all duration-500 shadow-2xl">
                    <div className="relative aspect-video bg-black overflow-hidden">
                      <ProtectedVideo 
                        src={video.url} 
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700"
                        poster={video.url + "#t=0.1"}
                        onView={() => addToHistory(video.id)}
                      />
                    </div>
                    <div className="p-8">
                       <h3 className="text-2xl font-serif text-white mb-2 uppercase tracking-wide">{video.title}</h3>
                       <p className="text-sm text-neutral-500 font-light leading-relaxed italic">"{video.description}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* IMAGE SECTION */}
          {images.length > 0 && (
            <section className="animate-in fade-in duration-1000">
              <div className="flex items-center gap-4 mb-12">
                <Camera className="w-6 h-6 text-crimson-600" />
                <h2 className="text-3xl font-serif text-white tracking-widest uppercase">Visual Artifacts</h2>
                <div className="flex-grow h-px bg-gradient-to-r from-crimson-900/30 to-transparent ml-4"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {images.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => {
                      setSelectedImage(item);
                      addToHistory(item.id);
                    }}
                    className="group relative aspect-[4/5] overflow-hidden bg-neutral-900 border border-white/5 hover:border-crimson-900/40 transition-all duration-700 shadow-2xl cursor-pointer"
                  >
                    <ProtectedImage 
                      src={item.url} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 opacity-60 group-hover:opacity-100 grayscale group-hover:grayscale-0"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90 group-hover:opacity-60 transition-opacity pointer-events-none"></div>
                    
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center">
                      <Maximize2 className="w-8 h-8 text-white/50 mb-2" />
                      <span className="text-[10px] text-white uppercase tracking-[0.3em] font-bold">Inspect Artifact</span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-out">
                      <h3 className="text-xl font-serif text-white mb-2 leading-tight uppercase tracking-widest">{item.title}</h3>
                      <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                        Sanctum Identity: {item.id.slice(-6)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Image Viewer Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button className="absolute top-6 right-6 text-white/50 hover:text-crimson-500 transition-colors z-[110]">
            <X className="w-10 h-10" />
          </button>
          
          <div 
            className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative border border-white/10 p-2 bg-neutral-900/40 rounded-sm shadow-2xl">
              <ProtectedImage 
                src={selectedImage.url} 
                alt={selectedImage.title} 
                className="max-w-full max-h-[75vh] object-contain"
              />
            </div>
            <div className="mt-8 text-center space-y-4">
               <h2 className="text-3xl font-serif text-white uppercase tracking-widest">{selectedImage.title}</h2>
               <p className="text-neutral-500 max-w-xl mx-auto italic font-serif leading-relaxed">"{selectedImage.description}"</p>
               <div className="flex items-center justify-center gap-4 text-[10px] text-neutral-700 uppercase tracking-widest font-bold">
                  <span>Category: {selectedImage.category || 'gallery'}</span>
                  <span className="w-1 h-1 bg-neutral-800 rounded-full"></span>
                  <span>ID: {selectedImage.id}</span>
               </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-24 text-center">
         <div className="h-px w-full bg-gradient-to-r from-transparent via-neutral-900 to-transparent mb-12"></div>
         <p className="text-neutral-700 font-serif italic text-lg mb-4">"The archive remains closed to the unworthy."</p>
         <Link to="/contact">
           <Button variant="outline" className="!text-[10px] opacity-40 hover:opacity-100 uppercase tracking-[0.2em]">Contact High Command</Button>
         </Link>
      </div>
    </div>
  );
};

export default Gallery;
