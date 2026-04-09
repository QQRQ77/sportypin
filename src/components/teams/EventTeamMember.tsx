import { Participant, TeamMember } from '@/types';
import React from 'react';
import { IoShirtOutline } from "react-icons/io5";
import { IconContext } from "react-icons";



interface EventTeamMemberProps {
  isUserCreator?: boolean;
  eventId: string;
  setItems: React.Dispatch<React.SetStateAction<Participant[]>>;
  member: TeamMember;
  participant?: Participant;
  participants?: Participant[]; 
  activeParticipantId?: string;
  setActiveParticipantId?: React.Dispatch<React.SetStateAction<string>>;
}

const EventTeamMember: React.FC<EventTeamMemberProps> = ({member}) => {


  return (
        <div className="flex items-center space-x-2 p-2 border rounded">
          <IconContext.Provider value={{ className: "text-sky-600" }}>
            <div className='relative'>
              <IoShirtOutline size={48} />
                <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold">{member.start_number}</p>
            </div>
          </IconContext.Provider>
          <div className="flex flex-row">
            <p>{member.first_name} {member.second_name ? member.second_name : ""}</p>
          </div>
        </div>
    );
};

export default EventTeamMember;