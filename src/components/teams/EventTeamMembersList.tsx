import { Participant } from '@/types';
import { Button } from '../ui/button';

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
      <Button onClick={() => {console.log("Closing team members list"); onClose()}}>Close</Button>
    </div>
  );
};