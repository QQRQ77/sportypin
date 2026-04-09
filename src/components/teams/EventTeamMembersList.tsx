import { Participant } from '@/types';
import { AddEventTeamMember } from './forms/AddEventTeamMemeber';
import EventTeamMember from './EventTeamMember';

interface EventTeamMembersListProps {
  eventId: string;
  isUserCreator?: boolean;
  participant?: Participant;
  participants?: Participant[];
  setItems: React.Dispatch<React.SetStateAction<Participant[]>>;
}

export const EventTeamMembersList: React.FC<EventTeamMembersListProps> = ({ isUserCreator = false, eventId, participant, participants, setItems }) => {
  
  return (
    <div className="">
      <h2>Skład zespołu:</h2>
      {participant?.eventTeamMembers?.length && (
        <ul className="list-disc list-inside">
          {participant.eventTeamMembers.map((member) => (
            <EventTeamMember 
              key={member.id}
              member={member} 
              participant={participant} 
              participants={participants} 
              setItems={setItems} 
              eventId={eventId} />
          ))}
        </ul>
      )}
      {isUserCreator && 
        <AddEventTeamMember
          eventId={eventId}
          participant={participant}
          participants={participants}
          setItems={setItems}
        />}
    </div>
  );
};