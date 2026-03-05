import { Participant } from "@/types";
import { useState } from "react";
import { EventTeamMembersList } from "./teams/EventTeamMembersList";
import CompetitorEditForm from "./forms/CompetitorEditForm";
import EventParticipantTypeTeam from "./teams/EventParticipantTypeTeam";
import EventParticipantTypeAthlete from "./athletes/EventParticipantTypeAthlete";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { UsersIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/20/solid";
import { saveNewParticipant } from "@/lib/events.actions";

interface CompetitorSingleItemProps {
  isUserCreator?: boolean;
  eventId: string;
  setItems: React.Dispatch<React.SetStateAction<Participant[]>>;
  participant?: Participant;
  participants?: Participant[]; 
  cathegories: string[];
}

const CompetitorSingleItem: React.FC<CompetitorSingleItemProps> = ({isUserCreator, eventId, setItems, participant, participants, cathegories}) => {
  
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const [showTeamMembers, setShowTeamMembers] = useState<boolean>(false);

  const deleteItem = async (id: string) => {
      if (participants) {
        const newParticipants = participants.filter(item => item.id !== id);
        setItems(newParticipants);
        await saveNewParticipant(eventId, newParticipants);
      }
    }
    
  
  return (
    <div className="competitor-single-item flex flex-col gap-2">
      {showEditForm ? (
        <CompetitorEditForm 
          participant={participant} 
          participants={participants} 
          cathegories={cathegories}
          eventId={eventId}
          setItems={setItems} 
        />
      ) : 
        <>
          {participant?.itemType === "zespół" && <EventParticipantTypeTeam participant={participant}/>}
          {participant?.itemType === "zawodnik" && <EventParticipantTypeAthlete participant={participant} />}
        </>
      }
      <div className="flex flex-row w-30 justify-center items-center gap-4 ml-5">
        <div className="text-gray-500 hover:text-gray-800">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowTeamMembers(!showTeamMembers);
                  setShowEditForm(false)
                  }}
                aria-label="Zawodnicy"
              >
                <div className="flex flex-row items-center">
                  <UsersIcon className="w-7 h-7 cursor-pointer scale-x-[-1] -mr-2 hover:text-black" />
                  <UsersIcon className="w-6 h-6 cursor-pointer text-black" />
                </div>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Zawodnicy</p>
            </TooltipContent>
          </Tooltip>
        </div>
        {isUserCreator && <>
        <div className="text-gray-500 hover:text-gray-800">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowEditForm(!showEditForm);
                  setShowTeamMembers(false)
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
                    deleteItem(participant?.id || "");
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
        </>}
      </div>
      {showTeamMembers && (
        <EventTeamMembersList 
          participant={participant} 
          participants={participants} 
          eventId={eventId}
          setItems={setItems} 
        />
      )}
    </div>
  );
};

export default CompetitorSingleItem;