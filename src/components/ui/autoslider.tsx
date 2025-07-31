"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface AutoSliderProps {
  imageUrls: string[];
  altBase: string;
  navBullets?: boolean;
  className?: string
  time?: number
}

export default function AutoSlider({ imageUrls, altBase, navBullets = false, className, time = 2000 }: AutoSliderProps) {
  const [current, setCurrent] = useState(0);

  /* ---------- auto-play ---------- */
  useEffect(() => {
    if (!imageUrls.length) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % imageUrls.length);
    }, time);
    return () => clearInterval(timer);
  }, [imageUrls.length]);

  if (!imageUrls.length) return null;

  return (
    <div className={`relative w-full overflow-hidden h-full ${className}`}>
      {imageUrls.map((url, idx) => (
        <div
          key={url}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            idx === current ? "opacity-100 z-10" : "opacity-0"
          }`}
        >
          <Image
            src={url}
            alt={`${altBase} ${idx + 1}`}
            fill
            className="object-cover"
          />
        </div>
      ))}

      {/* kropki nawigacyjne (opcjonalnie) */}
      {navBullets && <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
        {imageUrls.map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => {e.stopPropagation(); setCurrent(idx)}}
            className={`w-2.5 h-2.5 rounded-full transition ${
              idx === current ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Przejdź do slajdu ${idx + 1}`}
          />
        ))}
      </div>}
    </div>
  );
}