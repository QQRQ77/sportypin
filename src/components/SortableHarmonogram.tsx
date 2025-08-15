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
import HarmonogramItemEditForm from "./forms/HarmonogramItemEditForm";

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
  const [showEditForm, setShowEditForm] = useState("");

  useEffect(() => {
    setHarmonogramItems(items);
  }, [items]);

  //TODO: Coś jest nie tak ze stanem formularza, po skasowaniu gdy dodajeszesz nowy element
  const deleteHarmonogramItem = async (id: string) => {
    const itemIndex = harmonogramItems.findIndex((i) => i.id === id);
    //logika poprawiania czasów start_time i end_time
    if (itemIndex === harmonogramItems.length - 1) {
      await saveHarmonogram(eventId, harmonogramItems.filter((item) => item.id !== id))
      setHarmonogramItems([]);
    } else {
      const itemShift = minutesBetween(harmonogramItems[itemIndex].start_time, harmonogramItems[itemIndex].end_time);
      const firstPause = minutesBetween(harmonogramItems[itemIndex].end_time, harmonogramItems[itemIndex + 1].start_time);

      for (let i = itemIndex + 1; i < harmonogramItems.length; i++) {
        harmonogramItems[i].start_time = addMinutesToTime(harmonogramItems[i].start_time, -(itemShift + firstPause));
        harmonogramItems[i].end_time = addMinutesToTime(harmonogramItems[i].end_time, -(itemShift + firstPause));
      }
      const newHarmonogramItems = harmonogramItems.filter((item) => item.id !== id);
      await saveHarmonogram(eventId, newHarmonogramItems);
      setHarmonogramItems(newHarmonogramItems);
      }
    }
  

  function SortableItem({ item, idx }: { item: HarmonogramItem, idx: number}) {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: item.id });
    
    return (
      <div className="w-full flex flex-col lg:flex-row justify-between items-center">
        {(showEditForm && showEditForm === item.id) ? (
          <HarmonogramItemEditForm
            eventId={eventId}
            itemIdx={idx}
            items={harmonogramItems}
            setItems={setHarmonogramItems}
            onClose={() => setShowEditForm("")}
          />
        ) : (
            <div className="w-full flex flex-col lg:flex-row gap-2">  
              <div 
                ref={setNodeRef}
                {...attributes}
                {...listeners}
                style={{ transform: CSS.Transform.toString(transform), transition }}
                className={`w-11/12 flex flex-wrap p-4 gap-2 rounded-xl shadow-xl ${idx % 2 === 0 ? "bg-sky-200" : "bg-gray-200"} cursor-grab items-center`}>
                  <div className="w-[80px] text-center">{idx + 1}.</div>
                  <div className="w-[100px] text-center">{item.start_time}</div>
                  <div className="w-[100px] text-center">{item.end_time}</div>
                  <div className="flex-1 text-center lg:text-left font-medium">{item.description}</div>
              </div>
              <div className="flex flex-row justify-center items-center gap-4">
                <div className="text-gray-500 hover:text-gray-800">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={e => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowEditForm(item.id);
                          }}
                        aria-label="Edytuj"
                      >
                        <PencilSquareIcon className="w-6 h-6 cursor-pointer" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edytuj</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="text-gray-500 hover:text-gray-800">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                          onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            deleteHarmonogramItem(item.id);
                              }}
                          aria-label="Usuń"
                        >
                        <TrashIcon className="w-6 h-6 cursor-pointer" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Usuń</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
        )}
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