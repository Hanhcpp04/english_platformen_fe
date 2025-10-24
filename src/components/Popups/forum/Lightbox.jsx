import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut } from "lucide-react";

export default function Lightbox({ images, currentIndex, onClose, onNavigate }) {
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && currentIndex > 0) onNavigate(currentIndex - 1);
      if (e.key === "ArrowRight" && currentIndex < images.length - 1) onNavigate(currentIndex + 1);
    };
    
    // Prevent body scroll
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyPress);
    
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [currentIndex, images.length, onClose, onNavigate]);

  return (
    <div 
      className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm z-10"
        aria-label="Close"
      >
        <X size={24} className="text-white" />
      </button>

      {/* Navigation - Left */}
      {currentIndex > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(currentIndex - 1);
          }}
          className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm z-10"
          aria-label="Previous"
        >
          <ChevronLeft size={32} className="text-white" />
        </button>
      )}

      {/* Navigation - Right */}
      {currentIndex < images.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(currentIndex + 1);
          }}
          className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm z-10"
          aria-label="Next"
        >
          <ChevronRight size={32} className="text-white" />
        </button>
      )}

      {/* Image */}
      <div 
        className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={images[currentIndex]}
          alt=""
          className="max-w-full max-h-[90vh] object-contain transition-transform duration-200"
          style={{ transform: `scale(${zoom})` }}
        />
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-2">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setZoom(Math.max(0.5, zoom - 0.25));
          }} 
          className="p-2 hover:bg-white/20 rounded transition-colors"
          aria-label="Zoom out"
        >
          <ZoomOut size={20} className="text-white" />
        </button>
        
        <span className="text-white font-semibold px-2 min-w-[60px] text-center font-body">
          {Math.round(zoom * 100)}%
        </span>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setZoom(Math.min(3, zoom + 0.25));
          }} 
          className="p-2 hover:bg-white/20 rounded transition-colors"
          aria-label="Zoom in"
        >
          <ZoomIn size={20} className="text-white" />
        </button>
        
        <div className="w-px h-6 bg-white/30 mx-1"></div>
        
        <a
          href={images[currentIndex]}
          download
          onClick={(e) => e.stopPropagation()}
          className="p-2 hover:bg-white/20 rounded transition-colors"
          aria-label="Download"
        >
          <Download size={20} className="text-white" />
        </a>
      </div>

      {/* Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white font-semibold bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg font-body">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}
