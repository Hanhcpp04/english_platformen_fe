import React from "react";

export default function ImageGrid({ images }) {
  if (!images || images.length === 0) return null;
  return (
    <div className="grid grid-cols-2 gap-2 mb-4">
      {images.map((img, idx) => (
        <img
          key={idx}
          src={img}
          alt=""
          className="rounded-lg object-cover w-full h-32"
        />
      ))}
    </div>
  );
}
