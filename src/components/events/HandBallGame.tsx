'use client'

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
  
  const [team1active, setTeam1Active] = React.useState(true);
  const [team2active, setTeam2Active] = React.useState(true);
  
  return (
    <>
      <Timer initialSeconds={matchTime} isUserCreator={isUserCreator} />
      <h1 className="text-3xl font-bold">Wynik:</h1>
      <ScoreBoard 
        team_1_score={0} 
        team_2_score={0} 
        isUserCreator={isUserCreator}
        team1active={team1active}
        team2active={team2active}
        setTeam1Active={setTeam1Active}
        setTeam2Active={setTeam2Active} 
        />
      <MatchTeamsMembers 
        team_1_members={team_1_members}
        team_2_members={team_2_members}
        team1active={team1active}
        team2active={team2active}
        setTeam1Active={setTeam1Active}
        setTeam2Active={setTeam2Active}
      />
    </>
  );
};

export default HandBallGame;