"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/24/solid";

interface Props {
  imageUrls: string[];
  altBase: string;
}

export default function AutoSliderAndModal({ imageUrls, altBase }: Props) {
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!imageUrls.length) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % imageUrls.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [imageUrls.length]);

  if (!imageUrls.length) return null;

  return (
    <>
      {/* MINIATURA */}
      <div
        className="relative w-full h-64 md:h-80 cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <Image
          src={imageUrls[current]}
          alt={`${altBase} miniatura`}
          fill
          className="object-cover rounded-t-2xl"
        />
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
          {imageUrls.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {e.stopPropagation(); setCurrent(idx)}}
              className={`w-2.5 h-2.5 rounded-full transition ${
                idx === current ? "bg-white" : "bg-white/50"
              } cursor-pointer`}
              aria-label={`Przejdź do slajdu ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* MODAL PEŁNOEKRANOWY */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setOpen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
          >
            <XMarkIcon className="w-8 h-8" />
          </button>

          <div className="relative w-full h-full max-w-screen-2xl">
            <Image
              src={imageUrls[current]}
              alt={`${altBase} ${current + 1}`}
              fill
              className="object-contain"
            />
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {imageUrls.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrent(i);
                }}
                className={`w-3 h-3 rounded-full ${i === current ? "bg-white" : "bg-white/40"} cursor-pointer`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}