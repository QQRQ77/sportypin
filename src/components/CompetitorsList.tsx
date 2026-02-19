import { Participant } from "@/types";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import { useState } from "react";
import CompetitorEditForm from "./forms/CompetitorEditForm";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { PencilSquareIcon, TrashIcon, UsersIcon } from "@heroicons/react/20/solid";
import { saveNewParticipant } from "@/lib/events.actions";
import EventParticipantTypeTeam from "./teams/EventParticipantTypeTeam";

interface CompetitorsProps {
  participants?: Participant[];
  isUserCreator?: boolean;
  setItems: React.Dispatch<React.SetStateAction<Participant[]>>;
  eventId: string;
  }

function groupByCategory(participants: Participant[]) {
  return participants.reduce<Record<string, Participant[]>>((groups, participant) => {
    const category = participant.cathegory || "Brak kategorii";
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(participant);
    return groups;
  }, {});
}

function getCategoryKeys(obj: Record<string, Participant[]>) {
    return Object.keys(obj);
  }

export default function CompetitorsList({eventId, setItems, participants = [], isUserCreator = false}: CompetitorsProps) {

  const [showEditForm, setShowEditForm] = useState("");

  const participantsByCategory = groupByCategory(participants);

  const categoryKeys = getCategoryKeys(participantsByCategory);

  const deleteItem = async (id: string) => {
      const newParticipants = participants.filter(item => item.id !== id);
      setItems(newParticipants);
      await saveNewParticipant(eventId, newParticipants);
    }
  
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue="item-1"
    >
      {categoryKeys.map((category, index) => (
        <AccordionItem key={category} value={`item-${index + 1}`}>
          <AccordionTrigger>
            <div className="text-lg font-medium cursor-pointer">
              {category} ({participantsByCategory[category].length})
            </div>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <div className="flex flex-col gap-1 pl-2">
              {participantsByCategory[category].map((participant) => (
                (showEditForm && participant.id === showEditForm) ? 
                  <CompetitorEditForm 
                    key={participant.id}
                    participant={participant} 
                    participants={participants} 
                    cathegories={categoryKeys}
                    eventId={eventId}
                    setItems={setItems} 
                    onClose={() => {setShowEditForm("")}} /> :
                  <div key={participant.id} className="flex w-full justify-between text-base gap-2">
                    {participant.itemType === "zawodnik" && <><div className="ml-5 font-medium text-lg">{participant.start_number}</div> 
                      <div className="flex flex-row gap-2 w-full lg:w-1/4">
                        <div className="ml-5 font-medium text-lg">{participant.first_name}</div> 
                        <div className="ml-5 font-medium text-lg">{participant.second_name}</div>
                      </div>
                    </>} 
                    <EventParticipantTypeTeam participant={participant}/>
                    {isUserCreator && 
                          <div className="flex flex-row w-24 justify-center items-center gap-4 ml-5">
                            <div className="text-gray-500 hover:text-gray-800">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={e => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setShowEditForm(participant.id || "");
                                      }}
                                    aria-label="Zawodnicy"
                                  >
                                    <div className="flex flex-row items-center"><UsersIcon className="w-6 h-6 cursor-pointer" /><UsersIcon className="w-6 h-6 cursor-pointer" /></div>
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Zawodnicy</p>
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
                                      setShowEditForm(participant.id || "");
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
                                        deleteItem(participant.id || "");
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
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
