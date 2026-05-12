'use client'

import React, { useEffect } from 'react';
import { Timer } from "@/components/events/timer";
import ScoreBoard from "@/components/events/ScoreBoard";
import MatchTeamsMembers from "@/components/events/teamsMembers";
import { saveHarmonogramItem, saveHarmonogramItemTeamPlayers } from '@/lib/events.actions';
import { EventTeamMemberType, HarmonogramItem } from '@/types';

interface HandBallGameProps {
  eventId: string;
  itemData: HarmonogramItem;
  isUserCreator?: boolean;
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

export const defaultGameSignals = {
    scorer1: "",
    scorer2: "",
    yellowCardsTeam1: 0,
    yellowCardsTeam2: 0,
    redCardsTeam1: 0,
    redCardsTeam2: 0,
    penaltyTeam1: 0,
    penaltyTeam2: 0,
}

const HandBallGame: React.FC<HandBallGameProps> = (
  { isUserCreator = false, itemData, 
    eventId, team_1_members, team_2_members }) => {
  
  const matchTime 
    = itemData ? Math.floor((new Date(`1970-01-01 ${itemData.end_time}`).getTime() - new Date(`1970-01-01 ${itemData.start_time}`).getTime()) / 1000) : 0;

  
  const [team_1, setTeam_1] = React.useState(team_1_members || []);
  const [team_2, setTeam_2] = React.useState(team_2_members || []);
  const [score1active, setScore1Active] = React.useState(true);
  const [score2active, setScore2Active] = React.useState(true);
  const [members1active, setMembers1Active] = React.useState(false);
  const [members2active, setMembers2Active] = React.useState(false);
  const [prevScore1, setPrevScore1] = React.useState(0);
  const [prevScore2, setPrevScore2] = React.useState(0);
  const [isPenaltyButtonActive, setIsPenaltyButtonActive] = React.useState("");
  const [gameSignals, setGameSignals] = React.useState<GameSygnals>({ ...defaultGameSignals, score1: itemData?.team_1_score || 0, score2: itemData?.team_2_score || 0 });

    useEffect(() => {

      const handleGameSignalsChange = async () => {
      if (gameSignals.score1 > prevScore1 && gameSignals.scorer1 !== "") {
        if (team_1.length > 0) {
          const teamOne = team_1.map((member) => (member.id === gameSignals.scorer1 ? { ...member, goals: (member.goals || 0) + 1 } : member))
          setTeam_1(teamOne);
          await saveHarmonogramItemTeamPlayers(eventId, itemData?.id, 1, teamOne);
          saveHarmonogramItem(eventId, itemData?.id, {...itemData, team_1_score: itemData.team_1_score ? itemData?.team_1_score + 1 : 1});
        }
        setPrevScore1(gameSignals.score1);
        setGameSignals((prevSignals) => ({ ...prevSignals, scorer1: "" }))  ;
      }

      if (gameSignals.score1 < prevScore1) {
        setPrevScore1(gameSignals.score1);
        setGameSignals((prevSignals) => ({ ...prevSignals, scorer1: "" }))  ;
      }

      if (gameSignals.score2 > prevScore2 && gameSignals.scorer2 !== "") {
        if (team_2.length > 0) {
          const teamTwo = team_2.map((member) => (member.id === gameSignals.scorer2 ? { ...member, goals: (member.goals || 0) + 1 } : member))
          setTeam_2(teamTwo);
          await saveHarmonogramItemTeamPlayers(eventId, itemData?.id, 2, teamTwo);
        }
        setPrevScore2(gameSignals.score2);
        setGameSignals((prevSignals) => ({ ...prevSignals, scorer2: "" }))  ;
      }

      if (gameSignals.score2 < prevScore2) {
        setPrevScore2(gameSignals.score2);
        setGameSignals((prevSignals) => ({ ...prevSignals, scorer2: "" }))  ;
      }

      if (gameSignals.yellowCardsTeam1 == -1 && gameSignals.scorer1 !== "") {
        if (team_1.length > 0) {
          const teamOne = team_1.map((member) => (member.id === gameSignals.scorer1 ? { ...member, yellowCards: (member.yellowCards || 0) + 1 } : member));
          setTeam_1(teamOne);
          await saveHarmonogramItemTeamPlayers(eventId, itemData?.id, 1, teamOne);
        }
        setGameSignals((prevSignals) => ({ ...prevSignals, yellowCardsTeam1: 0, scorer1: "" }))  ;
      }

      if (gameSignals.yellowCardsTeam2 == -1 && gameSignals.scorer2 !== "") {
        if (team_2.length > 0) {
          const teamTwo = team_2.map((member) => (member.id === gameSignals.scorer2 ? { ...member, yellowCards: (member.yellowCards || 0) + 1 } : member));
          setTeam_2(teamTwo);
          await saveHarmonogramItemTeamPlayers(eventId, itemData?.id, 2, teamTwo);
        }
        setGameSignals((prevSignals) => ({ ...prevSignals, yellowCardsTeam2: 0, scorer2: "" }));
        }
      
      if (gameSignals.redCardsTeam1 == -1 && gameSignals.scorer1 !== "") {
        if (team_1.length > 0) {
          const teamOne = team_1.map((member) => (member.id === gameSignals.scorer1 ? { ...member, redCards: 1 } : member));
          setTeam_1(teamOne);
          await saveHarmonogramItemTeamPlayers(eventId, itemData?.id, 1, teamOne);
        }
        setGameSignals((prevSignals) => ({ ...prevSignals, redCardsTeam1: 0, scorer1: "" }))  ;
      }
      
      if (gameSignals.redCardsTeam2 == -1 && gameSignals.scorer2 !== "") {
        if (team_2.length > 0) {
          const teamTwo = team_2.map((member) => (member.id === gameSignals.scorer2 ? { ...member, redCards: 1 } : member));
          setTeam_2(teamTwo);
          await saveHarmonogramItemTeamPlayers(eventId, itemData?.id, 2, teamTwo);
        }
        setGameSignals((prevSignals) => ({ ...prevSignals, redCardsTeam2: 0, scorer2: "" }))  ;
      }
      
      if (gameSignals.penaltyTeam1 == -1 && gameSignals.scorer1 !== "") {
        if (team_1.length > 0) {
          const teamOne = team_1.map((member) => (member.id === gameSignals.scorer1 ? { ...member, penalties: (member.penalties || 0) + 1 } : member));
          setTeam_1(teamOne);
          await saveHarmonogramItemTeamPlayers(eventId, itemData?.id, 1, teamOne);
        }
        setGameSignals((prevSignals) => ({ ...prevSignals, penaltyTeam1: 0, scorer1: "" }));
      }

      if (gameSignals.penaltyTeam2 == -1 && gameSignals.scorer2 !== "") {
        if (team_2.length > 0) {
          const teamTwo = team_2.map((member) => (member.id === gameSignals.scorer2 ? { ...member, penalties: (member.penalties || 0) + 1 } : member));
          setTeam_2(teamTwo);
          await saveHarmonogramItemTeamPlayers(eventId, itemData?.id, 2, teamTwo);
        }
        setGameSignals((prevSignals) => ({ ...prevSignals, penaltyTeam2: 0, scorer2: "" }));
      }}

      handleGameSignalsChange();

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
        isPenaltyButtonActive={isPenaltyButtonActive}
        setIsPenaltyButtonActive={setIsPenaltyButtonActive}
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
        setIsPenaltyButtonActive={setIsPenaltyButtonActive}
      />
    </>
  );
};

export default HandBallGame;