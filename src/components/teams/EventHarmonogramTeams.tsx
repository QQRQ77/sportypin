import { getTeamLogoByTeamId } from "@/lib/teams.actions";
import { HarmonogramItem } from "@/types";
import { useEffect, useState } from "react";
import Image from "next/image";

interface EventHarmonogramTeamsProps {
  item: HarmonogramItem;
}

export const EventHarmonogramTeamsItem: React.FC<EventHarmonogramTeamsProps> = ({item}) => {

  const [team_1_LogoURL, setTeam_1_LogoURL] = useState<string>("");
  const [team_2_LogoURL, setTeam_2_LogoURL] = useState<string>("");

  useEffect(() => {
    const fetchTeamLogo = async () => {
      let team_1_logoURL
      let team_2_logoURL 
      if (item.team_1_id) {
        team_1_logoURL = await getTeamLogoByTeamId(item.team_1_id);
        setTeam_1_LogoURL(team_1_logoURL);
      }
      if (item.team_2_id) {
        team_2_logoURL = await getTeamLogoByTeamId(item.team_2_id);
        setTeam_2_LogoURL(team_2_logoURL);
      }
    };
    fetchTeamLogo();
  }, [item]);

  return (
    <div className="text-center lg:text-left font-medium inline-flex items-center gap-2">
      {item.team_1_id ? <Image
                    src={team_1_LogoURL}
                    alt={`${item.team_1} logo`}
                    width={40}
                    height={40}
                    className="object-contain rounded"
                  /> : <div className="w-[40px] h-[40px]"></div>}{item.team_1}
      {item.team_1 && <span className="ml-2">vs.</span>}
      {item.team_2_id ? <Image
              src={team_2_LogoURL}
              alt={`${item.team_2} logo`}
              width={40}
              height={40}
              className="object-contain rounded"
            /> : <div className=""></div>}{item.team_2}
      {((item.team_1 && item.description) || (item.team_2 && item.description)) && " - "}{` ${item.description}`}
    </div>
  );
};

export default EventHarmonogramTeamsItem;