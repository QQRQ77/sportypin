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

    console.log("affected:", affected);

    if (newIndex === 0) {
      const itemShift = minutesBetween(affected[0].start_time, affected[0].end_time);
      affected[0].start_time = affected[1].start_time;
      affected[0].end_time = addMinutesToTime(affected[0].start_time, itemShift);

      for (let i = 1; i <= oldIndex; i++) {
        affected[i].start_time = addMinutesToTime(affected[i].start_time, itemShift + firstPause);
        affected[i].end_time = addMinutesToTime(affected[i].end_time, itemShift + firstPause);
      }
    }

    console.log("affected after time change: ", affected);
  
    // if (newIndex < oldIndex) {
    //   const itemShift = minutesBetween(affected[newIndex].start_time, affected[newIndex].end_time);
    //   affected[newIndex].start_time = affected[newIndex + 1].start_time;
    //   affected[newIndex].end_time = addMinutesToTime(affected[newIndex].start_time, itemShift);
    // }  

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