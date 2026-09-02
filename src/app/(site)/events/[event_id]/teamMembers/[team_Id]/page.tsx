import { EventTeamMembersList } from "@/components/teams/EventTeamMembersList";
import { getEventBaseInfo, getEventParticipants } from "@/lib/events.actions";
import { getTeamLogoByTeamId } from "@/lib/teams.actions";
import { Participant } from "@/types";
import Image from "next/image";
import Link from "next/link";

export default async function teamMembers({ params }: { params: Promise<{ event_id: string, team_Id: string }>}) {

const { event_id, team_Id } = await params;

const eventInfo = await getEventBaseInfo(event_id);
const eventParticipants: Participant[] = await getEventParticipants(event_id);

const participant: Participant = eventParticipants.find(p => p.id === team_Id)!;

let teamLogoURL = "";
if (participant?.team_id) {
  teamLogoURL = await getTeamLogoByTeamId(participant.team_id);
}

return (
  <>      
    <div className="w-full flex flex-col items-center gap-5">
      <h1 className="text-3xl font-bold">{eventInfo.name}</h1>
      <h1 className="text-3xl font-semibold">{eventInfo.city}</h1>
      <h1 className="text-4xl font-bold">{participant.team_name || participant.name}</h1>
      {teamLogoURL && (
        <Link href={`/teams/${participant.team_id}`}>
          <Image
            src={teamLogoURL}
            alt={`${participant.team_name} logo`}
            width={100}
            height={100}
            className="object-contain rounded cursor-pointer hover:border-2 hover:border-gray-600"
          />
        </Link>
      )}
    </div>
    <EventTeamMembersList eventId={event_id} participants={eventParticipants} participant={participant} isUserCreator={true}/>
  </>
)

}
