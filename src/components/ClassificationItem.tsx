'use client';

import { ClassificationItem } from "@/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import ClassificationItemForm from "./forms/ClassificationItemForm";
import { saveClassification } from "@/lib/events.actions";

interface ClassificationItemProps {
  item: ClassificationItem;
  isUserCreator?: boolean;
  eventId: string;
  classification?: ClassificationItem[];
  cathegories?: string[];
  setItems: React.Dispatch<React.SetStateAction<ClassificationItem[]>>;
}

export default function ClassificationSingleItem({eventId, item, isUserCreator = false, classification = [], setItems, cathegories}: ClassificationItemProps) {

  const [showEditForm, setShowEditForm] = useState<boolean>(false);

  const deleteItem = async (id: string) => {
    const newClassification = classification.filter(item => item.id !== id);
    setItems(newClassification);
    await saveClassification(eventId, newClassification);
  }

 return (
  <div className="flex flex-row w-full text-base">
    {showEditForm ? 
      <ClassificationItemForm 
        item={item} 
        eventId={eventId} 
        classification={classification}
        cathegories={cathegories} 
        setItems={setItems} 
        onClose={() => setShowEditForm(false)} />
    : <>
    <div className="w-[80px] font-medium text-center">
      {item.place} 
    </div>
    <div className="flex-1">
      {item.description}
    </div>
    <div className="w-[80px] text-center font-medium">
      {item.score && `${item.score}`}
    </div>
    {isUserCreator && 
      <div className="flex flex-row justify-center items-center gap-4 ml-5">
        <div className="text-gray-500 hover:text-gray-800">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowEditForm(true);
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
                    deleteItem(item.id);
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
    }</>}
  </div>
)
}
