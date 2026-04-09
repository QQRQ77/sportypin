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
          <IconContext.Provider value={{ color: "red", className: "global-class-name" }}>
            <div>
              <IoShirtOutline size={48} />
            </div>
          </IconContext.Provider>;
          <div className="flex flex-row">
            <p className="font-bold">{member.start_number}</p>
            <p>{member.first_name} {member.second_name ? member.second_name : ""}</p>
          </div>
        </div>
    );
};

export default EventTeamMember;