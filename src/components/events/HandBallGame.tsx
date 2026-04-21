import React from 'react';
import { Timer } from "@/components/events/timer";
import ScoreBoard from "@/components/events/ScoreBoard";
import MatchTeamsMembers from "@/components/events/teamsMembers";
import { EventTeamMemberType } from "@/types";


interface HandBallGameProps {
  isUserCreator?: boolean;
  matchTime: number;
  team_1_members?: EventTeamMemberType[];
  team_2_members?: EventTeamMemberType[];
}

const HandBallGame: React.FC<HandBallGameProps> = ({ isUserCreator = false, matchTime = 0, team_1_members, team_2_members }) => {
  return (
    <>
      <Timer initialSeconds={matchTime} isUserCreator={isUserCreator} />
      <h1 className="text-3xl font-bold">Wynik:</h1>
      <ScoreBoard team_1_score={0} team_2_score={0} isUserCreator={isUserCreator} />
      <MatchTeamsMembers 
        team_1_members={team_1_members}
        team_2_members={team_2_members}
      />
    </>
  );
};

export default HandBallGame;