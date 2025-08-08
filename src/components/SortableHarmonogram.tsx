'use client'

import { reorderHarmonogram } from "@/lib/events.actions";
import { recalculateTimesAfterReorder } from "@/lib/harmonogramShuffle";
import { addMinutesToTime, minutesBetween } from "@/lib/utils";
import { HarmonogramItem } from "@/types";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useId, useState } from "react";

interface SortableItineraryProps {
  items: HarmonogramItem[];
  eventId: string;
}


function SortableItem({ item, idx }: { item: HarmonogramItem, idx: number}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`w-full flex flex-wrap lg:flex-nowrap gap-2 mb-2 p-4 rounded-xl shadow-xl ${idx%2 == 0? "bg-sky-200" : "bg-gray-200"} cursor-grab`}
    >
      <div className="w-1/4 lg:w-1/12 text-center">{idx + 1}.</div>
      <div className="w-1/4 lg:w-1/12 text-center">{item.start_time}</div>
      <div className="w-1/4 lg:w=1/12 text-center">{item.end_time}</div>
      <div className="w-full lg:w-3/4">{item.description}</div>
    </div>
  );
}

export default function SortableHarmonogram({
  items,
  eventId,
}: SortableItineraryProps) {
  const id = useId();
  const [harmonogramItems, setHarmonogramItems] = useState(items);

  useEffect(() => {
    setHarmonogramItems(items);
  }, [items]);

// ---------------------------------------------------
// SortableHarmonogram – handleDragEnd
// ---------------------------------------------------

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = harmonogramItems.findIndex((i) => i.id === active.id);
    const newIndex = harmonogramItems.findIndex((i) => i.id === over.id);

    const firstPause = minutesBetween(harmonogramItems[0].end_time, harmonogramItems[1].start_time );
    const lastPause = minutesBetween(harmonogramItems[harmonogramItems.length - 2].end_time,
                                     harmonogramItems[harmonogramItems.length - 1].start_time)

    /* 1. Ustal, które elementy faktycznie zmieniły kolejność */
    const affected = arrayMove(harmonogramItems, oldIndex, newIndex);

    // Time Shift w kierunku wcześniejszych czasów
    // Przesunięcie na najwcześniejszy termin, ale nie z pozycji bezpośrednio po pierwszym
    if (newIndex === 0) {
      const itemShift = minutesBetween(affected[0].start_time, affected[0].end_time);
      affected[0].start_time = affected[1].start_time;
      affected[0].end_time = addMinutesToTime(affected[0].start_time, itemShift);

      for (let i = 1; i <= oldIndex; i++) {
        affected[i].start_time = addMinutesToTime(affected[i].start_time, itemShift + firstPause);
        affected[i].end_time = addMinutesToTime(affected[i].end_time, itemShift + firstPause);
      }
    }

    //TODO: A co jeśłi zamieniane elementy mają różną długość trwania?
    // if (newIndex === 1 && affected.length === 2) {
    //   const a = affected[0].start_time;
    //   const b = affected[0].end_time;
    //   affected[0].start_time = affected[1].start_time;  
    //   affected[0].end_time = affected[1].end_time;
    //   affected[1].start_time = a;
    //   affected[1].end_time = b;
    // }

    // Przesunięcie na wcześniejszy termin, ale nie z pozycji bezpośrednio po pierwszym
    if (newIndex > 0 && affected.length > 2 && newIndex < oldIndex) {
      const itemShift = minutesBetween(affected[newIndex].start_time, affected[newIndex].end_time);
      const pauseShift = minutesBetween(affected[newIndex - 1].end_time, affected[newIndex + 1].start_time);
      affected[newIndex].start_time = affected[newIndex + 1].start_time;
      affected[newIndex].end_time = addMinutesToTime(affected[newIndex].start_time, itemShift);

      for (let i = newIndex + 1; i <= oldIndex; i++) {
        affected[i].start_time = addMinutesToTime(affected[i].start_time, itemShift + pauseShift);
        affected[i].end_time = addMinutesToTime(affected[i].end_time, itemShift + pauseShift);
      }
    }
    
    // Time shift w kierunku późniejszych czasów
    // Przesunięcie na najpóźniejszy termin, ale nie z pozycji bezpośrednio przed ostatnim
    if (newIndex === affected.length - 1 && affected.length > 2 && newIndex - oldIndex > 1) {
      const itemShift = minutesBetween(affected[newIndex].start_time, affected[newIndex].end_time);
      const pauseShift = minutesBetween(affected[oldIndex].end_time, affected[oldIndex + 1].start_time);
      affected[newIndex].start_time = affected[newIndex - 1].start_time;
      affected[newIndex].end_time = addMinutesToTime(affected[newIndex].start_time, itemShift);

      for (let i = newIndex - 1; i >= oldIndex; i--) {
        affected[i].start_time = addMinutesToTime(affected[i].start_time, -(itemShift + pauseShift));
        affected[i].end_time = addMinutesToTime(affected[i].end_time, -(itemShift + pauseShift));
      }
    }
    
    // Przesunięcie na późniejszy termin, ale nie zamiana sąsiednich elementów
    if (newIndex < affected.length - 1 && affected.length > 2 && newIndex - oldIndex > 1) {
      const itemShift = minutesBetween(affected[newIndex].start_time, affected[newIndex].end_time);
      const pauseShift = minutesBetween(affected[oldIndex].end_time, affected[oldIndex + 1].start_time);
      affected[newIndex].start_time = affected[newIndex - 1].start_time;
      affected[newIndex].end_time = addMinutesToTime(affected[newIndex].start_time, itemShift);

      for (let i = newIndex - 1; i >= oldIndex; i--) {
        affected[i].start_time = addMinutesToTime(affected[i].start_time, -(itemShift + pauseShift));
        affected[i].end_time = addMinutesToTime(affected[i].end_time, -(itemShift + pauseShift));
      }
    }  

    // Zamiana sąsiednich elementów ruch w kierunku późniejszych czasów
    if (newIndex - oldIndex === 1) {
      const newIndexShift = minutesBetween(affected[newIndex].start_time, affected[newIndex].end_time);
      const oldIndexShift = minutesBetween(affected[oldIndex].start_time, affected[oldIndex].end_time);
      const newStartTime = affected[newIndex].start_time;
      const oldStartTime = affected[oldIndex].start_time;
      affected[newIndex].start_time = oldStartTime;
      affected[newIndex].end_time = addMinutesToTime(oldStartTime, newIndexShift) 
      affected[oldIndex].start_time = newStartTime;
      affected[oldIndex].end_time = addMinutesToTime(newStartTime, oldIndexShift);
    } 

    /* 4. Aktualizuj stan i backend */
    setHarmonogramItems(affected);
    await reorderHarmonogram(eventId, affected);
  };

  return (
    <DndContext
      id={id}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={harmonogramItems.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {harmonogramItems.map((item, key) => (
            <SortableItem key={key} item={item} idx={key} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}