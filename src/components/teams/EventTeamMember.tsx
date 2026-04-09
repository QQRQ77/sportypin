import { Participant, TeamMember } from '@/types';
import React from 'react';

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
        <div>{member.first_name} {member.second_name ? member.second_name : ""} (start number: {member.start_number})</div>
    );
};

export default EventTeamMember;