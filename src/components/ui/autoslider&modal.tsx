"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

interface AutoSliderProps {
  imageUrls: string[];
  altBase: string;
}

export default function AutoSliderAndModal({ imageUrls, altBase }: AutoSliderProps) {
  const [current, setCurrent] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  /* ---------- auto-play w modalu ---------- */
  useEffect(() => {
    if (!isOpen || !imageUrls.length) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % imageUrls.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [imageUrls.length, isOpen]);

  if (!imageUrls.length) return null;

  /* ---------- miniatura (klikalna) ---------- */
  const thumb = (
    <div
      className="relative w-full lg:w-1/5 overflow-hidden cursor-pointer"
      onClick={(e) => {e.stopPropagation(); setIsOpen(true)}}
    >
      <Image
        src={imageUrls[0]}
        alt={`${altBase} thumbnail`}
        fill
        className="object-cover"
      />
      {imageUrls.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {imageUrls.map((_, i) => (
            <span
              key={i}
              className={`w-2.5 h-2.5 rounded-full ${
                i === 0 ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );

  /* ---------- modal pełnoekranowy ---------- */
  const modal = isOpen && (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80"
      onClick={() => setIsOpen(false)}
    >
      {/* przycisk zamknięcia */}
      <button
        className="absolute top-4 right-4 z-[1000] text-white"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(false);
        }}
        aria-label="Zamknij"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* slajdy */}
      <div
        className="relative w-full h-full max-w-screen-lg max-h-screen"
        onClick={(e) => e.stopPropagation()}
      >
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
              className="object-contain"
            />
          </div>
        ))}
      </div>

      {/* kropki nawigacyjne */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-[1000]">
        {imageUrls.map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              setCurrent(idx);
            }}
            className={`w-3 h-3 rounded-full transition ${
              idx === current ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );

  return (
    <>
      {thumb}
      {modal}
    </>
  );
}