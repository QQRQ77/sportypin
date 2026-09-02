import { EventTeamMembersList } from "@/components/teams/EventTeamMembersList";
import { getEventBaseInfo, getEventParticipants } from "@/lib/events.actions";
import { Participant } from "@/types";

export default async function teamMembers({ params }: { params: Promise<{ event_id: string, team_Id: string }>}) {

const { event_id, team_Id } = await params;

const eventInfo = await getEventBaseInfo(event_id);
const eventParticipants: Participant[] = await getEventParticipants(event_id);

const participant: Participant = eventParticipants.find(p => p.id === team_Id)!;

return (
  <>      
    <div className="w-full flex flex-col items-center gap-5">
      <h1 className="text-3xl font-bold">{eventInfo.name}</h1>
      <h1 className="text-3xl font-bold">{eventInfo.city}</h1>
      <h1 className="text-3xl font-bold">{participant.team_name || participant.name}</h1>
    </div>
    <EventTeamMembersList eventId={event_id} participants={eventParticipants} participant={participant} isUserCreator={true}/>
  </>
)

}
