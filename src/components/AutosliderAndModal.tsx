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
    if (!open) return;
    const timer = setInterval(() => setCurrent((c) => (c + 1) % imageUrls.length), 3000);
    return () => clearInterval(timer);
  }, [open, imageUrls.length]);

  return (
    <>
      {/* MINIATURA */}
      <div
        className="relative w-full h-64 md:h-80 cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <Image
          src={imageUrls[0]}
          alt={`${altBase} miniatura`}
          fill
          className="object-cover rounded-t-2xl"
        />
        {imageUrls.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {imageUrls.map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full ${i === 0 ? "bg-sky-400" : "bg-white/50"}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* MODAL PEŁNOEKRANOWY */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setOpen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white"
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
                className={`w-3 h-3 rounded-full ${i === current ? "bg-white" : "bg-white/40"}`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}