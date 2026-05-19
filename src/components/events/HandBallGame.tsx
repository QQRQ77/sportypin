'use client'

import React, { useEffect } from 'react';
import { Timer } from "@/components/events/timer";
import ScoreBoard from "@/components/events/ScoreBoard";
import MatchTeamsMembers from "@/components/events/teamsMembers";
import { saveHarmonogramItem, saveHarmonogramItemTeamPlayers } from '@/lib/events.actions';
import { EventTeamMemberType, GameTransmissionItem, HarmonogramItem } from '@/types';
import HandballGameTransmission from './Handball/HandballGameTransmission';
import { createId } from "@paralleldrive/cuid2";

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
  scorer1: string;
  scorer2: string;
  yellowCardsTeam1: number | string;
  yellowCardsTeam2: number | string;
  redCardsTeam1: number | string;
  redCardsTeam2: number | string;
  penaltyTeam1: number  | string;
  penaltyTeam2: number | string;
  time: number;
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
    time: 0,
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
  const [prevScore1, setPrevScore1] = React.useState(itemData?.team_1_score || 0);
  const [prevScore2, setPrevScore2] = React.useState(itemData?.team_2_score || 0);
  const [isPenaltyButtonActive, setIsPenaltyButtonActive] = React.useState("");
  const [dataBaseSubmission, setDataBaseSubmission] = React.useState(false);
  const [gameSignals, setGameSignals] = React.useState<GameSygnals>({ ...defaultGameSignals, score1: itemData?.team_1_score || 0, score2: itemData?.team_2_score || 0 });
  const [gameTime, setGameTime] = React.useState(0);
  const [gameTransmission, setGameTransmission] = React.useState<GameTransmissionItem[]>([]);

    useEffect(() => {

      const handleGameSignalsChange = async () => {
        if (gameSignals.score1 > prevScore1 && gameSignals.scorer1 !== "") {
            if (team_1.length > 0) {
              const updatedTeamOne = team_1.map((member) =>
                member.id === gameSignals.scorer1
                  ? { ...member, goals: (member.goals || 0) + 1 }
                  : member
              );

              setDataBaseSubmission(true);

              setTeam_1(updatedTeamOne);
              setGameTransmission((prevTransmission) => [
                ...prevTransmission,
                {
                  id: createId(),
                  eventType: "goal",
                  time: gameTime,
                  playerId: gameSignals.scorer1,
                  playerName: itemData?.team_1_players?.find(player => player.id === gameSignals.scorer1)?.name || "",
                  playerNumber: itemData?.team_1_players?.find(player => player.id === gameSignals.scorer1)?.start_number || "",
                  score: `${gameSignals.score1}-${gameSignals.score2}`,
                  teamName: itemData?.team_1,
                  team: 1
                }
              ]);

              try {
                const result = await saveHarmonogramItem(eventId, itemData?.id, { 
                  ...itemData, 
                  team_1_score: gameSignals.score1,
                  team_2_score: gameSignals.score2,
                  team_1_players: updatedTeamOne,
                  team_2_players: team_2, 
                });

                if (result === "success") setDataBaseSubmission(false);
              } catch (error) {
                console.error("Błąd podczas zapisu:", error);
              }
            }
            
            setPrevScore1(gameSignals.score1);
            setGameSignals((prevSignals) => ({ ...prevSignals, scorer1: "" }));
          }

      if (gameSignals.score1 < prevScore1) {
        setDataBaseSubmission(true);
        try {
          const result = await saveHarmonogramItem(eventId, itemData?.id, { 
            ...itemData, 
            team_1_score: gameSignals.score1,
          });
          if (result === "success") setDataBaseSubmission(false);
        } catch (error) {
          console.error("Błąd podczas zapisu:", error);
        }
        setPrevScore1(gameSignals.score1);
        setGameSignals((prevSignals) => ({ ...prevSignals, scorer1: "" }))  ;
      }

      if (gameSignals.score2 > prevScore2 && gameSignals.scorer2 !== "") {
        if (team_2.length > 0) {
          
          const updatedTeamTwo = team_2.map((member) => (member.id === gameSignals.scorer2 ? { ...member, goals: (member.goals || 0) + 1 } : member))
          
          setDataBaseSubmission(true);

          setTeam_2(updatedTeamTwo);
          setGameTransmission((prevTransmission) => [
              ...prevTransmission,
              {
                id: createId(),
                eventType: "goal",
                time: gameTime,
                playerId: gameSignals.scorer2,
                score: `${gameSignals.score1}-${gameSignals.score2}`,
                teamName: itemData?.team_2,
                team: 2
              }
            ]);
           try {
                const result = await saveHarmonogramItem(eventId, itemData?.id, { 
                  ...itemData, 
                  team_2_score: gameSignals.score2,
                  team_1_score: gameSignals.score1,
                  team_2_players: updatedTeamTwo,
                  team_1_players: team_1, 
                });

                if (result === "success") setDataBaseSubmission(false);
              } catch (error) {
                console.error("Błąd podczas zapisu:", error);
              }
        }
        setPrevScore2(gameSignals.score2);
        setGameSignals((prevSignals) => ({ ...prevSignals, scorer2: "" }))  ;
      }

      if (gameSignals.score2 < prevScore2) {

        setDataBaseSubmission(true);
        try {
          const result = await saveHarmonogramItem(eventId, itemData?.id, { 
            ...itemData, 
            team_2_score: gameSignals.score2,
          });
          if (result === "success") setDataBaseSubmission(false);
        } catch (error) {
          console.error("Błąd podczas zapisu:", error);
        }
        setPrevScore2(gameSignals.score2);
        setGameSignals((prevSignals) => ({ ...prevSignals, scorer2: "" }))  ;
      }

      if (gameSignals.yellowCardsTeam1 == -1 && gameSignals.scorer1 !== "") {
        setDataBaseSubmission(true);
        if (team_1.length > 0) {
          const teamOne = team_1.map((member) => (member.id === gameSignals.scorer1 ? { ...member, yellowCards: (member.yellowCards || 0) + 1 } : member));
          setTeam_1(teamOne);
          setGameTransmission((prevTransmission) => [
            ...prevTransmission,
            {
              id: createId(),
              eventType: "yellowCard",
              playerId: gameSignals.scorer1,
              time: gameTime,
              teamName: itemData?.team_1,
              team: 1
            }
          ]);
          const result = await saveHarmonogramItemTeamPlayers(eventId, itemData?.id, 1, teamOne);
          if (result === "success") setDataBaseSubmission(false);
        }
        setGameSignals((prevSignals) => ({ ...prevSignals, yellowCardsTeam1: 0, scorer1: "" }))  ;
      }

      if (gameSignals.yellowCardsTeam2 == -1 && gameSignals.scorer2 !== "") {
        setDataBaseSubmission(true);
        if (team_2.length > 0) {
          const teamTwo = team_2.map((member) => (member.id === gameSignals.scorer2 ? { ...member, yellowCards: (member.yellowCards || 0) + 1 } : member));
          setTeam_2(teamTwo);
          setGameTransmission((prevTransmission) => [
            ...prevTransmission,
            {
              id: createId(),
              eventType: "yellowCard",
              playerId: gameSignals.scorer2,
              time: gameTime,
              teamName: itemData?.team_2,
              team: 2
            }
          ]);
          const result = await saveHarmonogramItemTeamPlayers(eventId, itemData?.id, 2, teamTwo);
          if (result === "success") setDataBaseSubmission(false);
        }
        setGameSignals((prevSignals) => ({ ...prevSignals, yellowCardsTeam2: 0, scorer2: "" }));
        }
      
      if (gameSignals.redCardsTeam1 == -1 && gameSignals.scorer1 !== "") {
        setDataBaseSubmission(true);
        if (team_1.length > 0) {
          const teamOne = team_1.map((member) => (member.id === gameSignals.scorer1 ? { ...member, redCards: 1 } : member));
          setTeam_1(teamOne);
          setGameTransmission((prevTransmission) => [
            ...prevTransmission,
            {
              id: createId(),
              eventType: "redCard",
              playerId: gameSignals.scorer1,
              time: gameTime,
              teamName: itemData?.team_1,
              team: 1
            }
          ]);
          const result = await saveHarmonogramItemTeamPlayers(eventId, itemData?.id, 1, teamOne);
          if (result === "success") setDataBaseSubmission(false);
        }
        setGameSignals((prevSignals) => ({ ...prevSignals, redCardsTeam1: 0, scorer1: "" }))  ;
      }
      
      if (gameSignals.redCardsTeam2 == -1 && gameSignals.scorer2 !== "") {
        setDataBaseSubmission(true);
        if (team_2.length > 0) {
          const teamTwo = team_2.map((member) => (member.id === gameSignals.scorer2 ? { ...member, redCards: 1 } : member));
          setTeam_2(teamTwo);
          setGameTransmission((prevTransmission) => [
            ...prevTransmission,
            {
              id: createId(),
              eventType: "redCard",
              playerId: gameSignals.scorer2,
              time: gameTime,
              teamName: itemData?.team_2,
              team: 2
            }
          ]);
          const result = await saveHarmonogramItemTeamPlayers(eventId, itemData?.id, 2, teamTwo);
          if (result === "success") setDataBaseSubmission(false);
        }
        setGameSignals((prevSignals) => ({ ...prevSignals, redCardsTeam2: 0, scorer2: "" }))  ;
      }
      
      if (gameSignals.penaltyTeam1 == -1 && gameSignals.scorer1 !== "") {
        setDataBaseSubmission(true);
        if (team_1.length > 0) {
          const teamOne = team_1.map((member) => (member.id === gameSignals.scorer1 ? { ...member, penalties: (member.penalties || 0) + 1 } : member));
          setTeam_1(teamOne);
          setGameTransmission((prevTransmission) => [
            ...prevTransmission,
            {
              id: createId(),
              eventType: "penalty",
              playerId: gameSignals.scorer1,
              time: gameTime,
              teamName: itemData?.team_1,
              team: 1
            }
          ]);
          const result = await saveHarmonogramItemTeamPlayers(eventId, itemData?.id, 1, teamOne);
          if (result === "success") setDataBaseSubmission(false);
        }
        setGameSignals((prevSignals) => ({ ...prevSignals, penaltyTeam1: 0, scorer1: "" }));
      }

      if (gameSignals.penaltyTeam2 == -1 && gameSignals.scorer2 !== "") {
        setDataBaseSubmission(true);
        if (team_2.length > 0) {
          const teamTwo = team_2.map((member) => (member.id === gameSignals.scorer2 ? { ...member, penalties: (member.penalties || 0) + 1 } : member));
          setTeam_2(teamTwo);
          setGameTransmission((prevTransmission) => [
            ...prevTransmission,
            {
              id: createId(),
              eventType: "penalty",
              playerId: gameSignals.scorer2,
              time: gameTime,
              teamName: itemData?.team_2,
              team: 2
            }
          ]);
          const result = await saveHarmonogramItemTeamPlayers(eventId, itemData?.id, 2, teamTwo);
          if (result === "success") setDataBaseSubmission(false);
        }
        setGameSignals((prevSignals) => ({ ...prevSignals, penaltyTeam2: 0, scorer2: "" }));
      }}

      handleGameSignalsChange();

    }, [gameSignals]);
  
  return (
    <>
      <Timer initialSeconds={matchTime} isUserCreator={isUserCreator} setGameTime={setGameTime} />
      <h1 className="text-3xl font-bold">Wynik:</h1>
      <ScoreBoard
        noTeam1Members={!team_1 || team_1.length === 0}
        noTeam2Members={!team_2 || team_2.length === 0} 
        team_1_score={gameSignals.score1} 
        team_2_score={gameSignals.score2} 
        isUserCreator={isUserCreator}
        isDataBaseSubmissionInAction={dataBaseSubmission}
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
      <HandballGameTransmission gameTransmissionItems={gameTransmission} />
    </>
  );
};

export default HandBallGame;
