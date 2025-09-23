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
import { PencilSquareIcon, TrashIcon, TrophyIcon } from "@heroicons/react/20/solid";
import { useId, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import HarmonogramItemEditForm from "./forms/HarmonogramItemEditForm";
import DateViewer from "./DataViewer";

interface SortableHarmonogramProps {
  items: HarmonogramItem[];
  eventId: string;
  cathegories?: string[];
  setItems: React.Dispatch<React.SetStateAction<HarmonogramItem[]>>;
}

export default function SortableHarmonogram({
  items,
  eventId,
  setItems,
  cathegories = [],
}: SortableHarmonogramProps) {
  const id = useId();
  const [showEditForm, setShowEditForm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [scoreForm, setScoreForm] = useState("");

  function addLP(items: HarmonogramItem[]): (HarmonogramItem & { LP: number })[] {
    // licznik dla każdej daty
    const counter: Record<string, number> = {};

    return items.map(item => {
      const date = item.date;
      counter[date] = (counter[date] || 0) + 1;
      return { ...item, LP: counter[date] };
    });
  }

  items = addLP(items)

  const deleteHarmonogramItem = async (id: string) => {
    const itemIndex = items.findIndex((i) => i.id === id);
    //logika poprawiania czasów start_time i end_time
    if (itemIndex === items.length - 1) {
      await saveHarmonogram(eventId, items.filter((item) => item.id !== id))
      setItems(prev => prev.filter((item) => item.id !== id));
    } else {
      const itemShift = minutesBetween(items[itemIndex].start_time, items[itemIndex].end_time);
      const firstPause = minutesBetween(items[itemIndex].end_time, items[itemIndex + 1].start_time);

      for (let i = itemIndex + 1; i < items.length; i++) {
        items[i].start_time = addMinutesToTime(items[i].start_time, -(itemShift + firstPause));
        items[i].end_time = addMinutesToTime(items[i].end_time, -(itemShift + firstPause));
        }

      const newHarmonogramItems = items.filter((item) => item.id !== id);
      setItems(newHarmonogramItems);
      await saveHarmonogram(eventId, newHarmonogramItems);
      }
    }
 
  function SortableItem({ item, idx, dateStats }: { item: HarmonogramItem, idx: number, dateStats?: Record<string, number>}) {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: item.id });
    
    return (
      <div className="w-full flex flex-col lg:flex-row justify-between items-center">
        {(showEditForm && showEditForm === item.id) ? (
          <HarmonogramItemEditForm
            eventId={eventId}
            itemIdx={idx}
            items={items}
            setItems={setItems}
            score={scoreForm === item.id}
            cathegories={cathegories}
            onClose={() => {setShowEditForm("");setScoreForm(""); setErrorMessage("")}}
          />
        ) : (
            <div className="w-full flex flex-col gap-2">
              <div className="w-full flex flex-col lg:flex-row gap-2">  
                <div 
                  ref={setNodeRef}
                  {...attributes}
                  {...listeners}
                  style={{ transform: CSS.Transform.toString(transform), transition }}
                  className={`w-11/12 flex flex-col lg:flex-row lg:flex-wrap p-4 gap-2 rounded-xl shadow-xl ${idx % 2 === 0 ? "bg-sky-200" : "bg-gray-200"} cursor-grab items-center`}>
                    <div className="flex gap-2">  
                      <div className="w-[80px] text-center">{item.LP}.</div>
                      <div className="w-[100px] text-center">{item.start_time}</div>
                      <div className="w-[100px] text-center">{item.end_time}</div>
                    </div>
                    <div className="flex-1 text-center lg:text-left font-medium">{`${item.description} ${item.score ? `(${item.score})` : ""}`}</div>
                    {/* Kategoria: desktop - obok opisu, mobile - pod opisem */}
                    <div className="hidden lg:block">
                      <div className="flex gap-2 justify-center items-center">
                        <div className="w-[100px] text-center">
                          {item.itemType !== "inny" ? item.itemType : ""}
                        </div>
                        <div className="w-[100px] text-center">
                          {item.cathegory !== "wszystkie" ? item.cathegory : ""}
                        </div>
                      </div>
                    </div>
                    <div className="block lg:hidden mx-auto">
                      <div className="flex gap-2 justify-center items-center">
                        <div className="w-[100px] text-center">
                          {item.itemType !== "inny" ? item.itemType : ""}
                        </div>
                        <div className="w-[100px] text-center">
                          {item.cathegory !== "wszystkie" ? item.cathegory : ""}
                        </div>
                      </div>
                    </div>
                </div>
                <div className="flex flex-row justify-center items-center gap-4">
                  <div className="text-gray-500 hover:text-gray-800">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            setScoreForm(item.id);
                            setShowEditForm(item.id);
                            }}
                          aria-label="Dodaj wynik"
                        >
                          <TrophyIcon className="w-6 h-6 cursor-pointer" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Dodaj wynik</p>
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

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);

    //TODO: zmiana daty wydarzenia poprzez edycję punktu (rozwiązanie tymczasowe - docelowo zmiania poprzez przeciągnięcie)  
    if (items[oldIndex].date != items[newIndex].date) {setErrorMessage("Zmień datę elementu poprzez edytuję danego punktu."); return};

    const firstPause = minutesBetween(items[0].end_time, items[1].start_time );
    const lastPause = minutesBetween(items[items.length - 2].end_time, items[items.length - 1].start_time);

        /* 1. Ustal, które elementy faktycznie zmieniły kolejność */
    const affected = arrayMove(items, oldIndex, newIndex);

    //*****/ Time Shift w kierunku wcześniejszych czasów /*****//
    // Przesunięcie na najwcześniejszy termin w danym dniu
    console.log("NewIndex LP: ", items[newIndex].LP, "Nowy index: ", newIndex)
    if (items[newIndex].LP === 1) {
      console.log("pierwsza pozycja danego dnia.")
      const itemShift = minutesBetween(affected[newIndex].start_time, affected[newIndex].end_time);
      affected[newIndex].start_time = affected[newIndex + 1].start_time;
      affected[newIndex].end_time = addMinutesToTime(affected[newIndex].start_time, itemShift);

      for (let i = newIndex + 1; i <= oldIndex; i++) {
        affected[i].start_time = addMinutesToTime(affected[i].start_time, itemShift + firstPause);
        affected[i].end_time = addMinutesToTime(affected[i].end_time, itemShift + firstPause);
      }
    }

    // Przesunięcie na wcześniejszy termin, ale nie na najwcześniejszą pozycję
    if (items[newIndex].LP && items[newIndex].LP > 1 && newIndex < oldIndex) {
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
    // Przesunięcie na najpóźniejszy termin w danym dniu
    if (
      newIndex === affected.length - 1 ||
      (items[newIndex + 1] && (items[newIndex + 1].LP || 0) < (items[newIndex].LP || 1))
    ) {
      console.log("Przesunięcie na najpóźniejszą pozycję w danym dniu.")
      const itemShift = minutesBetween(affected[newIndex].start_time, affected[newIndex].end_time);
      affected[newIndex].end_time = affected[newIndex - 1].end_time;
      affected[newIndex].start_time = addMinutesToTime(affected[newIndex].end_time, -itemShift);

      for (let i = newIndex - 1; i >= oldIndex; i--) {
        affected[i].start_time = addMinutesToTime(affected[i].start_time, -(itemShift + lastPause));
        affected[i].end_time = addMinutesToTime(affected[i].end_time, -(itemShift + lastPause));
      }
    }

    // Przesunięcie na wcześniejszy termin, ale nie na najpóźniejszą pozycję
    if (newIndex < affected.length - 1 && newIndex > oldIndex && (items[newIndex + 1].LP || 0) > (items[newIndex].LP || 1)) {
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
    setItems(affected);
    await saveHarmonogram(eventId, affected); 
  };

  return (
    <DndContext
      id={id}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          <div className="w-11/12 flex flex-wrap gap-2 mb-2 p-4 rounded-xl shadow-xl">
            <div className="w-[80px] text-center">Lp.</div>
            <div className="w-[100px] text-center">Początek</div>
            <div className="w-[100px] text-center">Koniec</div>
            <div className="flex-1 text-center lg:text-left">Opis</div>
            <div className="w-[100px] text-center hidden lg:block">Kategoria</div>
            <div className="block lg:hidden w-full text-center mt-1">Kategoria</div>
          </div>
          {items.map((item, key) => (
            <div key={key}>
              {key === 0 && <div className="w-11/12 flex justify-center mb-2">
                <DateViewer date={item.date}/>    
              </div>}
              {key > 0 && items[key].date !== items[key - 1].date && <div className="w-11/12 flex justify-center mb-2">
                <DateViewer date={item.date}/>    
              </div>}
              <SortableItem item={item} idx={key}/>
            </div>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}