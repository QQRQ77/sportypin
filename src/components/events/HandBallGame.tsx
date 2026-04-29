'use client'

import React, { useEffect } from 'react';
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

export type GameSygnals = {
  score1: number;
  score2: number;
  scorer1: string | number;
  scorer2: string | number;
  yellowCardsTeam1: number | string;
  yellowCardsTeam2: number | string;
  redCardsTeam1: number | string;
  redCardsTeam2: number | string;
  penaltyTeam1: number  | string;
  penaltyTeam2: number | string;
};

const HandBallGame: React.FC<HandBallGameProps> = ({ isUserCreator = false, matchTime = 0, team_1_members, team_2_members }) => {
  
  const [team_1, setTeam_1] = React.useState(team_1_members || []);
  const [team_2, setTeam_2] = React.useState(team_2_members || []);
  const [score1active, setScore1Active] = React.useState(true);
  const [score2active, setScore2Active] = React.useState(true);
  const [members1active, setMembers1Active] = React.useState(false);
  const [members2active, setMembers2Active] = React.useState(false);
  const [gameSignals, setGameSignals] = React.useState<GameSygnals>({
    score1: 0,
    score2: 0,
    scorer1: "",
    scorer2: "",
    yellowCardsTeam1: 0,
    yellowCardsTeam2: 0,
    redCardsTeam1: 0,
    redCardsTeam2: 0,
    penaltyTeam1: 0,
    penaltyTeam2: 0, 
  });

    useEffect(() => {
      if (gameSignals.yellowCardsTeam1 == -1 && gameSignals.scorer1 !== "") {
        if (team_1.length > 0) {
          setTeam_1(team_1.map((member) => (member.id === gameSignals.scorer1 ? { ...member, yellowCards: 1 } : member)));
        }
        setGameSignals((prevSignals) => ({ ...prevSignals, yellowCardsTeam1: 0 }));
      }
      if (gameSignals.yellowCardsTeam2 == -1 && gameSignals.scorer2 !== "") {
        if (team_2.length > 0) {
          setTeam_2(team_2.map((member) => (member.id === gameSignals.scorer2 ? { ...member, yellowCards: 1 } : member)));
        }
        setGameSignals((prevSignals) => ({ ...prevSignals, yellowCardsTeam2: 0 }));
        }
      
      if (gameSignals.redCardsTeam2 == -1 && gameSignals.scorer2 !== "") {
        if (team_2.length > 0) {
          setTeam_2(team_2.map((member) => (member.id === gameSignals.scorer2 ? { ...member, redCards: 1 } : member)));
        }
        setGameSignals((prevSignals) => ({ ...prevSignals, redCardsTeam2: 0 }))  ;
      }
      
      if (gameSignals.penaltyTeam1 == -1 && gameSignals.scorer1 !== "") {
        if (team_1.length > 0) {
          setTeam_1(team_1.map((member) => (member.id === gameSignals.scorer1 ? { ...member, penalty: 1 } : member)));
        }
        setGameSignals((prevSignals) => ({ ...prevSignals, penaltyTeam1: 0 }));
      }
      if (gameSignals.penaltyTeam2 == -1 && gameSignals.scorer2 !== "") {
        if (team_2.length > 0) {
          setTeam_2(team_2.map((member) => (member.id === gameSignals.scorer2 ? { ...member, penalty: 1 } : member)));
        }
        setGameSignals((prevSignals) => ({ ...prevSignals, penaltyTeam2: 0 }));
      }
    }, [gameSignals]);
  
  return (
    <>
      <Timer initialSeconds={matchTime} isUserCreator={isUserCreator} />
      <h1 className="text-3xl font-bold">Wynik:</h1>
      <ScoreBoard
        noTeam1Members={!team_1 || team_1.length === 0}
        noTeam2Members={!team_2 || team_2.length === 0} 
        team_1_score={gameSignals.score1} 
        team_2_score={gameSignals.score2} 
        isUserCreator={isUserCreator}
        team1active={score1active}
        team2active={score2active}
        members1active={members1active}
        members2active={members2active}
        setTeam1Active={setScore1Active}
        setTeam2Active={setScore2Active}
        setMembers1Active={setMembers1Active}
        setMembers2Active={setMembers2Active}
        setGameSignals={setGameSignals} 
        />
      <MatchTeamsMembers 
        team_1_members={team_1}
        team_2_members={team_2}
        team1active={score1active}
        team2active={score2active}
        members1active={members1active}
        members2active={members2active}
        setTeam1Active={setScore1Active}
        setTeam2Active={setScore2Active}
        setMembers1Active={setMembers1Active}
        setMembers2Active={setMembers2Active}
        setGameSignals={setGameSignals} 
      />
    </>
  );
};

export default HandBallGame;