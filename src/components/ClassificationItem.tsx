'use client';

import { ClassificationItem } from "@/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { CursorArrowRaysIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import ClassificationItemForm from "./forms/ClassificationItemForm";
import { saveClassification } from "@/lib/events.actions";
import { romanize } from 'romans';
import { getTeamLogoByTeamId } from "@/lib/teams.actions";
import Link from "next/link";
import Image from "next/image";

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
  const [classificationItem, setClassificationItem] = useState<ClassificationItem>(item);

    useEffect(() => {
      const fetchTeamLogo = async () => {
        let teamLogoUrl = null;
        if (item?.team_id) {
          teamLogoUrl = await getTeamLogoByTeamId(item.team_id);
        }
        setClassificationItem({...item, logoUrl: teamLogoUrl ? teamLogoUrl : ""});
      };
      fetchTeamLogo();
    }, [item]);

  const deleteItem = async (id: string) => {
    const newClassification = classification.filter(item => item.id !== id);
    setItems(newClassification);
    await saveClassification(eventId, newClassification);
  }

 return (
  <div className="flex flex-row items-center gap-3 w-full text-base">
    {showEditForm ? 
      <ClassificationItemForm 
        item={item} 
        eventId={eventId} 
        classification={classification}
        cathegories={cathegories} 
        setItems={setItems} 
        onClose={() => setShowEditForm(false)} />
    : <>
    <div className="flex flex-row items-center w-full justify-between">
      <div className="flex flex-row items-center flex-1 gap-4">
        <div className="w-[80px] font-medium text-center">
          {classificationItem.place && classificationItem.place < 11 ? romanize(classificationItem.place) : classificationItem.place} 
        </div>
        <div className="w-10 h-10 flex items-center justify-center overflow-hidden">
          {classificationItem.logoUrl && (
            <Link href={`/teams/${classificationItem.team_id}`}>
              <Image
                src={classificationItem.logoUrl}
                alt={`${classificationItem.description} logo`}
                width={40}
                height={40}
                className="object-contain rounded cursor-pointer hover:border-2 hover:border-gray-600"
              />
            </Link>
          )}
        </div>
              {classificationItem.team_id ? 
              <Link href={`/teams/${classificationItem.team_id}`} className="font-semibold text-lg cursor-pointer hover:text-gray-600">{classificationItem.description} <CursorArrowRaysIcon className="w-6 h-6 inline-block ml-1 sm:hidden" /></Link> 
              : <div className="flex-1 text-lg">
                  {classificationItem.description}
                </div>}
        <div className="w-[80px] text-center font-medium">
          {classificationItem.score && `${item.score}`}
        </div>
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
        }
      </div>
    </>}
  </div>
)
}
