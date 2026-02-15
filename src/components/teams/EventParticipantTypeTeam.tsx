import { getTeamLogoByTeamId } from "@/lib/teams.actions";
import { Participant } from "@/types";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CursorArrowRaysIcon } from "@heroicons/react/20/solid";

interface EventParticipantTypeTeamProps {
  participant?: Participant;
}

const EventParticipantTypeTeam: React.FC<EventParticipantTypeTeamProps> = ({participant = {team_name: "Wczytuję..."}}) => {
  const [participantData, setParticipantData] = useState<Participant>(participant);

  useEffect(() => {
    const fetchTeamLogo = async () => {
      let teamLogoUrl = "";
      if (participant?.team_id) {
        teamLogoUrl = await getTeamLogoByTeamId(participant.team_id);
      }
      setParticipantData({...participant, teamLogoUrl: teamLogoUrl});
    };
    fetchTeamLogo();
  }, [participant]);

  return (
    <div className="flex items-center gap-3 ml-5">
      <div className="w-14 h-14 flex items-center justify-center overflow-hidden">
        {participantData.teamLogoUrl && (
          <Link href={`/teams/${participant.team_id}`}>
            <Image
              src={participantData.teamLogoUrl}
              alt={`${participantData.name} logo`}
              width={50}
              height={50}
              className="object-contain rounded cursor-pointer hover:border-2 hover:border-gray-600"
            />
          </Link>
        )}
      </div>
      {participant.team_id ? 
      <Link href={`/teams/${participant.team_id}`} className="font-semibold text-lg cursor-pointer hover:text-gray-600">{participantData.team_name} <CursorArrowRaysIcon className="w-6 h-6 inline-block ml-1 sm:hidden" /></Link> 
      : <span className="font-medium text-lg">{participantData.team_name}</span>}
    </div>
  );
};

export default EventParticipantTypeTeam;