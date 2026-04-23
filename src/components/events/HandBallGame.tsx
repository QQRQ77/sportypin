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
  
  const [score1active, setScore1Active] = React.useState(true);
  const [score2active, setScore2Active] = React.useState(true);
  const [members1active, setMembers1Active] = React.useState(false);
  const [members2active, setMembers2Active] = React.useState(false);
  
  return (
    <>
      <Timer initialSeconds={matchTime} isUserCreator={isUserCreator} />
      <h1 className="text-3xl font-bold">Wynik:</h1>
      <ScoreBoard
        noTeam1Members={!team_1_members || team_1_members.length === 0}
        noTeam2Members={!team_2_members || team_2_members.length === 0} 
        team_1_score={0} 
        team_2_score={0} 
        isUserCreator={isUserCreator}
        team1active={score1active}
        team2active={score2active}
        members1active={members1active}
        members2active={members2active}
        setTeam1Active={setScore1Active}
        setTeam2Active={setScore2Active}
        setMembers1Active={setMembers1Active}
        setMembers2Active={setMembers2Active} 
        />
      <MatchTeamsMembers 
        team_1_members={team_1_members}
        team_2_members={team_2_members}
        team1active={score1active}
        team2active={score2active}
        members1active={members1active}
        members2active={members2active}
        setTeam1Active={setScore1Active}
        setTeam2Active={setScore2Active}
        setMembers1Active={setMembers1Active}
        setMembers2Active={setMembers2Active} 
      />
    </>
  );
};

export default HandBallGame;