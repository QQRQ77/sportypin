import { Participant } from '@/types';

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
    </div>
  );
};