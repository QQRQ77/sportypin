// import { addMinutesToTime, minutesBetween } from "./utils";

// /**
//  * Funkcja przeliczająca czasy po przesunięciu elementu w tablicy
//  * @param items Tablica obiektów z czasami
//  * @param fromIndex Indeks przesuwanego elementu
//  * @param toIndex Indeks docelowy
//  * @returns Nowa tablica z przeliczonymi czasami
//  */
// export function recalculateTimesAfterReorder(
//   items: { start_time: string; end_time: string; [key: string]: any }[],
//   fromIndex: number,
//   toIndex: number
// ): { start_time: string; end_time: string; [key: string]: any }[] {
 
//   const result = [...items];
//   const itemShift = minutesBetween(result[toIndex].start_time, result[toIndex].end_time);
//   const firstPause = minutesBetween(result[0].end_time, result[1].start_time);
  
//   // Przeliczanie czasów
//   if (toIndex === 0) {
//     result[0].start_time = result[1].start_time;
//     result[0].end_time = addMinutesToTime(result[0].start_time, itemShift);
//     result[1].start_time = addMinutesToTime(result[1].start_time, itemShift + firstPause);
//     result[1].end_time = addMinutesToTime(result[1].end_time, itemShift + firstPause);
//   }

//   if (toIndex < fromIndex) {
//     result[toIndex].start_time = result[toIndex + 1].start_time;
//     result[toIndex].end_time = addMinutesToTime(result[toIndex].start_time, itemShift);
//   }

//   return result;
// }