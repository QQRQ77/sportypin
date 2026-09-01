import { EventTeamMembersList } from "@/components/teams/EventTeamMembersList";
import { getEventParticipants } from "@/lib/events.actions";
import { Participant } from "@/types";

export default async function teamMembers({ params }: { params: Promise<{ event_id: string, team_id: string }>}) {

const { event_id, team_id } = await params;

console.log("event_id:", event_id);
console.log("team_id:", team_id);

const eventParticipants: Participant[] = await getEventParticipants(event_id);

const participant: Participant = eventParticipants.find(p => p.id === team_id)!;

return (
  <>
    <EventTeamMembersList eventId={event_id} participants={eventParticipants} participant={participant}/>
  </>
)

}
