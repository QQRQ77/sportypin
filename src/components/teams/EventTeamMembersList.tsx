import { Participant } from '@/types';
import React from 'react';


interface EventTeamMembersListProps {
  eventId: string;
  cathegories?: string[];
  participant?: Participant;
  participants?: Participant[];
  setItems: React.Dispatch<React.SetStateAction<Participant[]>>;
  onClose: () => void;
}

export const EventTeamMembersList: React.FC<EventTeamMembersListProps> = ({ onClose }) => {
  return (
    <div className="">
      <h2>Team Members</h2>
      <button onClick={() => onClose()}>Close</button>
    </div>
  );
};