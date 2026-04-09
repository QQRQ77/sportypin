import { Participant, TeamMember } from '@/types';
import React from 'react';
import { IoShirtOutline } from "react-icons/io5";


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
        <div><IoShirtOutline className='w-16'/>{member.start_number} {member.first_name} {member.second_name ? member.second_name : ""}</div>
    );
};

export default EventTeamMember;