import React, { useState } from "react";
import Lightbox from "./Lightbox";
import { Image as ImageIcon } from "lucide-react";

export default function MediaGallery({ images, files }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!images && !files) return null;

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="mb-6">
      {/* Images Gallery */}
      {images && images.length > 0 && (
        <div className={`grid gap-3 mb-4 ${
          images.length === 1 ? "grid-cols-1" :
          images.length === 2 ? "grid-cols-2" :
          "grid-cols-2"
        }`}>
          {images.map((img, idx) => (
            <div
              key={idx}
              className={`relative bg-gray-100 rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-all group ${
                idx === 0 && images.length === 3 ? "col-span-2 aspect-video" : "aspect-square"
              }`}
              onClick={() => openLightbox(idx)}
            >
              <img 
                src={img} 
                alt="" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                <ImageIcon size={32} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Files List */}
      {files && files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, idx) => (
            <a
              key={idx}
              href={file.url}
              download={file.name}
              className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors group"
            >
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-primary-600 font-bold text-sm">
                  {file.name.split('.').pop().toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-dark-primary truncate group-hover:text-primary-600 transition-colors font-body">
                  {file.name}
                </div>
                <div className="text-xs text-gray-500 font-body">{file.size}</div>
              </div>
              <div className="text-sm text-primary-600 font-medium shrink-0 font-body">
                Download
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && images && (
        <Lightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}
