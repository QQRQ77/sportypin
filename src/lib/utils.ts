import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const monthNameToNumber = (monthName: unknown = "styczeń") => {

  const months = ["styczeń", "luty", "marzec", "kwiecień", "maj", "czerwiec", "lipiec", "sierpień", "wrzesień", "październik", "listopad", "grudzień"];
  
  if (typeof monthName !== "string") return null;
  const monthNumber = months.indexOf(monthName.toLowerCase()) + 1;

  return monthNumber > 0 ? monthNumber : null; // zwraca null jeśli nie znaleziono

};