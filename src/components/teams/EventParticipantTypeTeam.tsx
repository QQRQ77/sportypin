import { getTeamLogoURL } from "@/lib/teams.actions";
import { Participant } from "@/types";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface EventParticipantTypeTeamProps {
  participant?: Participant;
}

const EventParticipantTypeTeam: React.FC<EventParticipantTypeTeamProps> = ({participant = {team_name: "Wczytuję..."}}) => {
  const [participantData, setParticipantData] = useState<Participant>(participant);

  useEffect(() => {
    const fetchTeamLogo = async () => {
      let teamLogoUrls = null;
      if (participant?.team_id) {
        teamLogoUrls = await getTeamLogoURL(participant.team_id);
      }
      setParticipantData({...participant, imageUrls: teamLogoUrls ? [...teamLogoUrls] : []});
    };
    fetchTeamLogo();
  }, [participant]);

  return (
    <div className="flex items-center gap-3 ml-5">
      <div className="w-14 h-14 flex items-center justify-center overflow-hidden">
        {participantData.imageUrls && participantData.imageUrls.length > 0 && (
          <Image
            src={participantData.imageUrls && participantData.imageUrls[0] || "/images/logo_team.png"}
            alt={`${participantData.name} logo`}
            width={50}
            height={50}
            className="object-contain rounded"
          />
        )}
      </div>
      {participant.team_id ? 
      <Link href={`/teams/${participant.team_id}`} className="font-medium cursor-pointer">{participantData.team_name}</Link> 
      : <span className="font-medium text-lg">{participantData.team_name}</span>}
    </div>
  );
};

export default EventParticipantTypeTeam;