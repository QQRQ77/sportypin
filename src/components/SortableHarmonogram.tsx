'use client'

import { saveHarmonogram } from "@/lib/events.actions";
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
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useEffect, useId, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface SortableHarmonogramProps {
  items: HarmonogramItem[];
  eventId: string;
}





export default function SortableHarmonogram({
  items,
  eventId,
}: SortableHarmonogramProps) {
  const id = useId();
  const [harmonogramItems, setHarmonogramItems] = useState(items);

  useEffect(() => {
    setHarmonogramItems(items);
  }, [items]);

  const deleteHarmonogramItem = (id: string) => {
    setHarmonogramItems((prev) => prev.filter((item) => item.id !== id));
    //logika poprawiania czasów start_time i end_time
    //zapisywanie zmian do bazy danych, użycie saveHarmonogram
    saveHarmonogram(eventId, harmonogramItems.filter((item) => item.id !== id));
  };

  function SortableItem({ item, idx }: { item: HarmonogramItem, idx: number}) {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: item.id });

    return (
      <div className="w-full flex flex-col lg:flex-row gap-2 justify-between items-center">
        <div
          ref={setNodeRef}
          {...attributes}
          {...listeners}
          style={{ transform: CSS.Transform.toString(transform), transition }}
          className={`relative w-full lg:w-11/12 flex flex-wrap lg:flex-nowrap gap-2 p-4 rounded-xl shadow-xl ${idx%2 == 0? "bg-sky-200" : "bg-gray-200"} cursor-grab`}
        >
          <div className="w-1/4 lg:w-1/12 text-center">{idx + 1}.</div>
          <div className="w-1/4 lg:w-1/12 text-center">{item.start_time}</div>
          <div className="w-1/4 lg:w-1/12 text-center">{item.end_time}</div>
          <div className="w-full lg:w-3/4 text-center lg:text-left font-medium">{item.description}</div>
        </div>
        <div className="w-1/12 flex justify-center items-center gap-4">
          <div className="text-gray-500 hover:text-gray-800">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={(e)=> {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Item ID: ", item.id)
                    }}
                  className=""
                  aria-label="Edytuj">
                    <PencilSquareIcon className="w-6 h-6 cursor-pointer" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>"Edytuj"</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="text-gray-500 hover:text-gray-800">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={(e)=> {
                    e.preventDefault();
                    e.stopPropagation();
                    deleteHarmonogramItem(item.id)
                    }}
                  className=""
                  aria-label="Zamknij">
                    <TrashIcon className="w-6 h-6 cursor-pointer" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>"Usuń"</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
      
    );
  }

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

    //*****/ Time Shift w kierunku wcześniejszych czasów /*****//
    // Przesunięcie na najwcześniejszy termin
    if (newIndex === 0) {
      const itemShift = minutesBetween(affected[0].start_time, affected[0].end_time);
      affected[0].start_time = affected[1].start_time;
      affected[0].end_time = addMinutesToTime(affected[0].start_time, itemShift);

      for (let i = 1; i <= oldIndex; i++) {
        affected[i].start_time = addMinutesToTime(affected[i].start_time, itemShift + firstPause);
        affected[i].end_time = addMinutesToTime(affected[i].end_time, itemShift + firstPause);
      }
    }

    // Przesunięcie na wcześniejszy termin, ale nie na najwcześniejszą pozycję
    if (newIndex > 0 && newIndex < oldIndex) {
      const itemShift = minutesBetween(affected[newIndex].start_time, affected[newIndex].end_time);
      const pauseShift = minutesBetween(affected[newIndex - 1].end_time, affected[newIndex + 1].start_time);
      affected[newIndex].start_time = affected[newIndex + 1].start_time;
      affected[newIndex].end_time = addMinutesToTime(affected[newIndex].start_time, itemShift);

      for (let i = newIndex + 1; i <= oldIndex; i++) {
        affected[i].start_time = addMinutesToTime(affected[i].start_time, itemShift + pauseShift);
        affected[i].end_time = addMinutesToTime(affected[i].end_time, itemShift + pauseShift);
      }
    }

    //*****/ Time Shift w kierunku późniejszych czasów /*****//
    // Przesunięcie na najpóźniejszy termin
    if (newIndex === affected.length - 1) {
      const itemShift = minutesBetween(affected[newIndex].start_time, affected[newIndex].end_time);
      affected[newIndex].end_time = affected[newIndex - 1].end_time;
      affected[newIndex].start_time = addMinutesToTime(affected[newIndex].end_time, -itemShift);

      for (let i = newIndex - 1; i >= oldIndex; i--) {
        affected[i].start_time = addMinutesToTime(affected[i].start_time, -(itemShift + lastPause));
        affected[i].end_time = addMinutesToTime(affected[i].end_time, -(itemShift + lastPause));
      }
    }

    // Przesunięcie na wcześniejszy termin, ale nie na najpóźniejszą pozycję
    if (newIndex < affected.length - 1 && newIndex > oldIndex) {
      const itemShift = minutesBetween(affected[newIndex].start_time, affected[newIndex].end_time);
      const pauseShift = minutesBetween(affected[newIndex - 1].end_time, affected[newIndex + 1].start_time);
      affected[newIndex].end_time = affected[newIndex - 1].end_time;
      affected[newIndex].start_time = addMinutesToTime(affected[newIndex].end_time, -(itemShift));

      for (let i = newIndex - 1; i >= oldIndex; i--) {
        affected[i].start_time = addMinutesToTime(affected[i].start_time, -(itemShift + pauseShift));
        affected[i].end_time = addMinutesToTime(affected[i].end_time, -(itemShift + pauseShift));
      }
    }
    
    /* 4. Aktualizuj stan i backend */
    setHarmonogramItems(affected);
    await saveHarmonogram(eventId, affected); 
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