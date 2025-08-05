'use client'

import { reorderHarmonogram } from "@/lib/events.actions";
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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = harmonogramItems.findIndex((item) => item.id === active.id);
      const newIndex = harmonogramItems.findIndex((item) => item.id === over!.id);

      const newHarmonogramOrder = arrayMove(
        harmonogramItems,
        oldIndex,
        newIndex
      ).map((item, index) => ({ ...item, order: index }));

      setHarmonogramItems(newHarmonogramOrder);

      await reorderHarmonogram(
        eventId,
        newHarmonogramOrder
      );
    }
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