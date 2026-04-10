import { Participant, TeamMember } from '@/types';
import React, { useState } from 'react';
import { IoShirtOutline } from "react-icons/io5";
import { IconContext } from "react-icons";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/20/solid";
import { EventTeamMemberEditForm } from './forms/EventTeamMemberEditForm';

interface EventTeamMemberProps {
  isUserCreator?: boolean;
  eventId: string;
  setItems: React.Dispatch<React.SetStateAction<Participant[]>>;
  member: TeamMember;
  participant?: Participant;
  participants?: Participant[]; 
  activeMemberId?: string;
  setActiveMemberId?: React.Dispatch<React.SetStateAction<string>>;
}

const EventTeamMember: React.FC<EventTeamMemberProps> = ({eventId, participant, participants, member, isUserCreator, activeMemberId, setItems, setActiveMemberId = () => {}}) => {

  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  
  return (
        <div className="flex items-center space-x-2 p-2 border rounded">
          {member.id === activeMemberId && showEditForm ? (
              <EventTeamMemberEditForm 
                member={member} 
                onClose={setShowEditForm} 
                eventId={eventId}
                participants={participants || []}
                participant={participant!}
                setItems={setItems}
              />
          ) : (<>
            <IconContext.Provider value={{ className: "text-sky-600" }}>
              <div className='relative'>
                <IoShirtOutline size={48} />
                  <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold">{member.start_number}</p>
              </div>
            </IconContext.Provider>
          <div className="flex flex-row w-96">
            <p>{member.first_name} {member.second_name ? member.second_name : ""}</p>
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
                      setActiveMemberId(member.id || "");
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
                        // deleteItem(participant?.id || "");
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
            </>
          )}
        </div>
    );
};

export default EventTeamMember;