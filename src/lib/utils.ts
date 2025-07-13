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


type PolishMonth =
  | 'styczeń'
  | 'luty'
  | 'marzec'
  | 'kwiecień'
  | 'maj'
  | 'czerwiec'
  | 'lipiec'
  | 'sierpień'
  | 'wrzesień'
  | 'październik'
  | 'listopad'
  | 'grudzień';

export function monthNameToColorClass(monthName: string) {
  const monthColors: Record<PolishMonth, { bg100: string; bg500: string; bg200: string; hex500: string }> = {
    'styczeń': { bg100: 'bg-blue-100', bg500: 'bg-blue-500', bg200: 'bg-blue-200', hex500: '#3B82F6' },
    'luty': { bg100: 'bg-indigo-100', bg500: 'bg-indigo-500', bg200: 'bg-indigo-200', hex500: '#6366F1' },
    'marzec': { bg100: 'bg-green-100', bg500: 'bg-green-500', bg200: 'bg-green-200', hex500: '#10B981' },
    'kwiecień': { bg100: 'bg-lime-100', bg500: 'bg-lime-500', bg200: 'bg-lime-200', hex500: '#84CC16' },
    'maj': { bg100: 'bg-emerald-100', bg500: 'bg-emerald-500', bg200: 'bg-emerald-200', hex500: '#10B981' },
    'czerwiec': { bg100: 'bg-yellow-100', bg500:'bg-yellow-500', bg200: 'bg-yellow-200', hex500: '#F59E0B' },
    'lipiec': { bg100: 'bg-orange-100', bg500: 'bg-orange-500', bg200: 'bg-orange-200', hex500: '#F97316' },
    'sierpień': { bg100: 'bg-amber-100', bg500: 'bg-amber-500', bg200: 'bg-amber-200', hex500: '#FBBF24' },
    'wrzesień': { bg100: 'bg-red-100', bg500: 'bg-red-500', bg200: 'bg-red-200', hex500: '#EF4444' },
    'październik': { bg100: 'bg-rose-100', bg500: 'bg-rose-500', bg200: 'bg-rose-200', hex500: '#F43F5E' },
    'listopad': { bg100: 'bg-fuchsia-100', bg500: 'bg-fuchsia-500', bg200: 'bg-fuchsia-200', hex500: '#D946EF' },
    'grudzień': { bg100: 'bg-cyan-100', bg500: 'bg-cyan-500', bg200: 'bg-cyan-200', hex500: '#06B6D4' },
  };

  const normalizedMonth = monthName.toLowerCase() as PolishMonth;
  return monthColors[normalizedMonth] || { bg100: 'bg-gray-100', bg500: 'bg-gray-500', bg200: 'bg-gray-200', hex500: '#9CA3AF' };
}