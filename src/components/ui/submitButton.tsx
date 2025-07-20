"use client";
import { useMemo } from "react";
import { Button } from "@/components/ui/button"; // Twój Button z shadcn/ui lub własny

export default function SearchButton({
  isSubmitting,
  submittingText,
  baseText,
}: {
  isSubmitting: boolean;
  submittingText: string;
  baseText: string
}) {
  const text = isSubmitting ? submittingText : baseText;

  // Rozbijamy tekst na litery z opóźnioną animacją
  const letters = useMemo(
    () =>
      text.split("").map((char, i) => (
        <span
          key={i}
          className="animate-rainbow"
          style={{ animationDelay: `${i * 0.2}s` }}
        >
          {char}
        </span>
      )),
    [text]
  );

  return (
    <Button
      type="submit"
      disabled={isSubmitting}
      className="font-semibold text-lg text-white hover:-translate-y-1 cursor-pointer"
    >
      {isSubmitting ? letters : baseText}
    </Button>
  );
}