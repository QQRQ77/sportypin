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

export const getPolishMonthName = (timestamp: number | string | Date) => {
  const months = [
    "styczeń", "luty", "marzec", "kwiecień", "maj", "czerwiec",
    "lipiec", "sierpień", "wrzesień", "październik", "listopad", "grudzień"
  ];
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return null;
  return months[date.getMonth()];
};

export const formatPolishDate = (timestamp: number | string | Date) => {
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return null;
  const day = date.getDate();
  const month = getPolishMonthName(date)
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

export const getPolishWeekday = (timestamp: number | string | Date) => {
  const weekdays = [
    "niedziela", "poniedziałek", "wtorek", "środa",
    "czwartek", "piątek", "sobota"
  ];
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return null;
  return weekdays[date.getDay()];
};

export const monthNameToColorClass = (monthName: string) => {
  if (typeof monthName !== "string") return "gray";
  switch (monthName.toLowerCase()) {
    case "styczeń": return "blue";
    case "luty": return "indigo";
    case "marzec": return "green";
    case "kwiecień": return "lime";
    case "maj": return "emerald";
    case "czerwiec": return "yellow";
    case "lipiec": return "orange";
    case "sierpień": return "amber";
    case "wrzesień": return "red";
    case "październik": return "rose";
    case "listopad": return "fuchsia";
    case "grudzień": return "cyan";
    default: return "gray";
  }
};