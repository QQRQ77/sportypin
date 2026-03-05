import { Participant } from "@/types";

interface EventParticipantTypeAthleteProps {
  participant?: Participant;
}

const EventParticipantTypeAthlete: React.FC<EventParticipantTypeAthleteProps> = ({
  participant,
}) => {

  return (
    <>
      <div className="ml-5 font-medium text-lg">{participant?.start_number}</div> 
        <div className="flex flex-row gap-2 w-full lg:w-1/4">
          <div className="ml-5 font-medium text-lg">{participant?.first_name}</div> 
          <div className="ml-5 font-medium text-lg">{participant?.second_name}</div>
        </div>
      </>
  );
};

export default EventParticipantTypeAthlete;