import { Participant } from '@/types';
import { Button } from '../ui/button';
import { AddEventTeamMember } from './forms/AddEventTeamMemeber';

interface EventTeamMembersListProps {
  eventId: string;
  participant?: Participant;
  participants?: Participant[];
  setItems: React.Dispatch<React.SetStateAction<Participant[]>>;
}

export const EventTeamMembersList: React.FC<EventTeamMembersListProps> = () => {
  return (
    <div className="">
      <h2>Skład zespołu:</h2>
      <AddEventTeamMember />
    </div>
  );
};