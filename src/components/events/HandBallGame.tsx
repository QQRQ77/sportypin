'use client'

import React, { useEffect, useRef } from 'react';
import { Timer } from "@/components/events/timer";
import ScoreBoard from "@/components/events/ScoreBoard";
import MatchTeamsMembers from "@/components/events/teamsMembers";
import { saveHarmonogramItem, saveHarmonogramItemTeamPlayers, saveNewParticipant } from '@/lib/events.actions';
import { EventTeamMemberType, GameTransmissionItem, HarmonogramItem, Participant } from '@/types';
import HandballGameTransmission from './Handball/HandballGameTransmission';
import { createId } from "@paralleldrive/cuid2";
import { Button } from '../ui/button';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Form } from "@/components/ui/form";

interface HandBallGameProps {
  eventId: string;
  itemData: HarmonogramItem;
  isUserCreator?: boolean;
  team_1_members?: EventTeamMemberType[];
  team_2_members?: EventTeamMemberType[];
  eventParticipants: Participant[];
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

type FormValues = Record<string, unknown>;

const HandBallGame: React.FC<HandBallGameProps> = (
  { isUserCreator = false, itemData, 
    eventId, team_1_members, team_2_members, eventParticipants }) => {
  
  const matchTime 
    = itemData ? Math.floor((new Date(`1970-01-01 ${itemData.end_time}`).getTime() - new Date(`1970-01-01 ${itemData.start_time}`).getTime()) / 1000) : 0;

  const form = useForm<FormValues>();

  const endOfTheGame = itemData?.gameTransmission && itemData.gameTransmission.length > 0 && itemData.gameTransmission[itemData.gameTransmission.length - 1].eventType === "endGame";
  
  const [team_1, setTeam_1] = React.useState(team_1_members || []);
  const [team_2, setTeam_2] = React.useState(team_2_members || []);
  const [score1active, setScore1Active] = React.useState(endOfTheGame ? false : true);
  const [score2active, setScore2Active] = React.useState(endOfTheGame ? false : true);
  const [members1active, setMembers1Active] = React.useState(false);
  const [members2active, setMembers2Active] = React.useState(false);
  const [prevScore1, setPrevScore1] = React.useState(itemData?.team_1_score || 0);
  const [prevScore2, setPrevScore2] = React.useState(itemData?.team_2_score || 0);
  const [isPenaltyButtonActive, setIsPenaltyButtonActive] = React.useState(endOfTheGame ? "disabled" : "");
  const [dataBaseSubmission, setDataBaseSubmission] = React.useState(false);
  const [gameSignals, setGameSignals] = React.useState<GameSygnals>({ ...defaultGameSignals, score1: itemData?.team_1_score || 0, score2: itemData?.team_2_score || 0 });
  const gameTimeRef = useRef(0);
  const [gameTransmission, setGameTransmission] = React.useState<GameTransmissionItem[]>(itemData?.gameTransmission || []);
  const [endTimeVis, setEndTimeVis] = React.useState(false); 
    
  useEffect(() => {

      const handleGameSignalsChange = async () => {
        const currentMatchTime = gameTimeRef.current;

      if (gameSignals.score1 > prevScore1 && gameSignals.scorer1 !== "") {
          if (team_1.length > 0) {
            const updatedTeamOne = team_1.map((member) =>
              member.id === gameSignals.scorer1
                ? { ...member, goals: (member.goals || 0) + 1 }
                : member
            );

            const updatedEventParticipants = eventParticipants.map(participant => {
              if (participant.id === itemData?.participant_1_id) {
                if (participant.eventTeamMembers ) {
                  participant.eventTeamMembers = participant.eventTeamMembers.map(member => {
                    if (member.id === gameSignals.scorer1) {
                      return { ...member, goals: (member.goals || 0) + 1 };
                    }
                    return member;
                  });
               }}
              return participant;
            });

            try {
              await saveNewParticipant(eventId, updatedEventParticipants);
            } catch (error) {
              console.error("Błąd podczas zapisu uczestników:", error);
            }  

            setDataBaseSubmission(true);

            const updatedGameTransmission = [
              ...gameTransmission,
              {
                id: createId(),
                eventType: "goal",
                time: currentMatchTime,
                playerId: gameSignals.scorer1,
                playerName: team_1.find(player => player.id === gameSignals.scorer1)?.name || "John Doe",
                playerNumber: team_1.find(player => player.id === gameSignals.scorer1)?.start_number || "99",
                score: `${gameSignals.score1} : ${gameSignals.score2}`,
                teamName: itemData?.team_1,
                team: 1
              }
            ]

            setTeam_1(updatedTeamOne);
            setGameTransmission(updatedGameTransmission);

            try {
              const result = await saveHarmonogramItem(eventId, itemData?.id, { 
                ...itemData, 
                team_1_score: gameSignals.score1,
                team_2_score: gameSignals.score2,
                team_1_players: updatedTeamOne,
                team_2_players: team_2,
                gameTransmission: updatedGameTransmission,  
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

        const updatedGameTransmission = [...gameTransmission];
        const lastGoalIndex = updatedGameTransmission.reduce((acc, item, index) => item.eventType === "goal" && item.team === 1 ? index : acc, -1);
        
        const teamMemberIdToSubtractGoal = updatedGameTransmission[lastGoalIndex] ? updatedGameTransmission[lastGoalIndex].playerId : null;
        
        let updatedTeamOne = team_1;

        if (team_1.length > 0) {
            updatedTeamOne = team_1.map((member) =>
              member.id === teamMemberIdToSubtractGoal
                ? { ...member, goals: (member.goals || 0) - 1 }
                : member
            );
        }

        const updatedEventParticipants = eventParticipants.map(participant => {
              if (participant.id === itemData?.participant_1_id) {
                if (participant.eventTeamMembers ) {
                  participant.eventTeamMembers = participant.eventTeamMembers.map(member => {
                    if (member.id === gameSignals.scorer1) {
                      return { ...member, goals: (member.goals || 0) - 1 };
                    }
                    return member;
                  });
               }}
              return participant;
            });

        try {
          await saveNewParticipant(eventId, updatedEventParticipants);
        } catch (error) {
          console.error("Błąd podczas zapisu uczestników:", error);
        }

        setTeam_1(updatedTeamOne);

        if (lastGoalIndex !== -1) {
          updatedGameTransmission.splice(lastGoalIndex, 1);
        }
        setGameTransmission(updatedGameTransmission);

        try {
          const result = await saveHarmonogramItem(eventId, itemData?.id, { 
            ...itemData, 
            team_1_score: gameSignals.score1,
            team_2_score: gameSignals.score2,
            team_1_players: updatedTeamOne,
            team_2_players: team_2,
            gameTransmission: updatedGameTransmission,
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
          
          const updatedEventParticipants = eventParticipants.map(participant => {
              if (participant.id === itemData?.participant_2_id) {
                if (participant.eventTeamMembers ) {
                  participant.eventTeamMembers = participant.eventTeamMembers.map(member => {
                    if (member.id === gameSignals.scorer2) {
                      return { ...member, goals: (member.goals || 0) + 1 };
                    }
                    return member;
                  });
               }}
              return participant;
            });

        try {
          await saveNewParticipant(eventId, updatedEventParticipants);
        } catch (error) {
          console.error("Błąd podczas zapisu uczestników:", error);
        }

          const updatedGameTransmission = [
              ...gameTransmission,
              {
                id: createId(),
                eventType: "goal",
                time: currentMatchTime,
                playerId: gameSignals.scorer2,
                playerName: team_2.find(player => player.id === gameSignals.scorer2)?.name || "",
                playerNumber: team_2.find(player => player.id === gameSignals.scorer2)?.start_number || "",
                score: `${gameSignals.score1} : ${gameSignals.score2}`,
                teamName: itemData?.team_2,
                team: 2
              }]

          setGameTransmission(updatedGameTransmission);

           try {
                const result = await saveHarmonogramItem(eventId, itemData?.id, { 
                  ...itemData, 
                  team_2_score: gameSignals.score2,
                  team_1_score: gameSignals.score1,
                  team_2_players: updatedTeamTwo,
                  team_1_players: team_1, 
                  gameTransmission: updatedGameTransmission,  
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
        const updatedGameTransmission = [...gameTransmission];
        const lastGoalIndex = updatedGameTransmission.reduce((acc, item, index) => item.eventType === "goal" && item.team === 2 ? index : acc, -1);
        const teamMemberIdToSubtractGoal = updatedGameTransmission[lastGoalIndex] ? updatedGameTransmission[lastGoalIndex].playerId : null;
        
        let updatedTeamTwo = team_2;

        if (team_2.length > 0) {
            updatedTeamTwo = team_2.map((member) =>
              member.id === teamMemberIdToSubtractGoal
                ? { ...member, goals: (member.goals || 0) - 1 }
                : member
            );
        }

        setTeam_2(updatedTeamTwo);

        const updatedEventParticipants = eventParticipants.map(participant => {
              if (participant.id === itemData?.participant_2_id) {
                if (participant.eventTeamMembers ) {
                  participant.eventTeamMembers = participant.eventTeamMembers.map(member => {
                    if (member.id === gameSignals.scorer2) {
                      return { ...member, goals: (member.goals || 0) - 1 };
                    }
                    return member;
                  });
               }}
              return participant;
            });

        try {
          await saveNewParticipant(eventId, updatedEventParticipants);
        } catch (error) {
          console.error("Błąd podczas zapisu uczestników:", error);
        }
        
        if (lastGoalIndex !== -1) {
          updatedGameTransmission.splice(lastGoalIndex, 1);
        }
        setGameTransmission(updatedGameTransmission);
        
        try {
          const result = await saveHarmonogramItem(eventId, itemData?.id, { 
            ...itemData, 
            team_2_score: gameSignals.score2,
            team_1_score: gameSignals.score1,
            team_2_players: updatedTeamTwo,
            team_1_players: team_1,
            gameTransmission: updatedGameTransmission,
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

        const updatedEventParticipants = eventParticipants.map(participant => {
            if (participant.id === itemData?.participant_1_id) {
              if (participant.eventTeamMembers ) {
                participant.eventTeamMembers = participant.eventTeamMembers.map(member => {
                  if (member.id === gameSignals.scorer1) {
                    return { ...member, yellowCards: (member.yellowCards || 0) + 1 };
                  }
                  return member;
                });
              }}
            return participant;
          });

        try {
          await saveNewParticipant(eventId, updatedEventParticipants);
        } catch (error) {
          console.error("Błąd podczas zapisu uczestników:", error);
        }

          const updatedGameTransmission = [
            ...gameTransmission,
            {
              id: createId(),
              eventType: "yellowCard",
              playerId: gameSignals.scorer1,
              playerName: team_1.find(player => player.id === gameSignals.scorer1)?.name || "",
              playerNumber: team_1.find(player => player.id === gameSignals.scorer1)?.start_number || "",
              time: currentMatchTime,
              teamName: itemData?.team_1,
              team: 1
            }
          ]
          setGameTransmission(updatedGameTransmission);
          const result = await saveHarmonogramItemTeamPlayers(eventId, itemData?.id, 1, teamOne, updatedGameTransmission);
          if (result === "success") setDataBaseSubmission(false);
        }
        setGameSignals((prevSignals) => ({ ...prevSignals, yellowCardsTeam1: 0, scorer1: "" }))  ;
      }

      if (gameSignals.yellowCardsTeam2 == -1 && gameSignals.scorer2 !== "") {
        setDataBaseSubmission(true);
        if (team_2.length > 0) {
          const teamTwo = team_2.map((member) => (member.id === gameSignals.scorer2 ? { ...member, yellowCards: (member.yellowCards || 0) + 1 } : member));
          setTeam_2(teamTwo);

          const updatedEventParticipants = eventParticipants.map(participant => {
              if (participant.id === itemData?.participant_2_id) {
                if (participant.eventTeamMembers ) {
                  participant.eventTeamMembers = participant.eventTeamMembers.map(member => {
                    if (member.id === gameSignals.scorer2) {
                      return { ...member, yellowCards: (member.yellowCards || 0) + 1 };
                    }
                    return member;
                  });
              }}
              return participant;
            });

          try {
            await saveNewParticipant(eventId, updatedEventParticipants);
          } catch (error) {
            console.error("Błąd podczas zapisu uczestników:", error);
          }

          const updatedGameTransmission = [
            ...gameTransmission,
            {
              id: createId(),
              eventType: "yellowCard",
              playerId: gameSignals.scorer2,
              playerName: team_2.find(player => player.id === gameSignals.scorer2)?.name || "",
              playerNumber: team_2.find(player => player.id === gameSignals.scorer2)?.start_number || "",
              time: currentMatchTime,
              teamName: itemData?.team_2,
              team: 2
            }]

          setGameTransmission(updatedGameTransmission);
          const result = await saveHarmonogramItemTeamPlayers(eventId, itemData?.id, 2, teamTwo, updatedGameTransmission);
          if (result === "success") setDataBaseSubmission(false);
        }
        setGameSignals((prevSignals) => ({ ...prevSignals, yellowCardsTeam2: 0, scorer2: "" }));
        }
      
      if (gameSignals.redCardsTeam1 == -1 && gameSignals.scorer1 !== "") {
        setDataBaseSubmission(true);
        if (team_1.length > 0) {
          const teamOne = team_1.map((member) => (member.id === gameSignals.scorer1 ? { ...member, redCards: 1 } : member));
          setTeam_1(teamOne);

          const updatedEventParticipants = eventParticipants.map(participant => {
              if (participant.id === itemData?.participant_1_id) {
                if (participant.eventTeamMembers ) {
                  participant.eventTeamMembers = participant.eventTeamMembers.map(member => {
                    if (member.id === gameSignals.scorer1) {
                      return { ...member, redCards: (member.redCards || 0) + 1 };
                    }
                    return member;
                  });
               }}
              return participant;
            });

          try {
            await saveNewParticipant(eventId, updatedEventParticipants);
          } catch (error) {
            console.error("Błąd podczas zapisu uczestników:", error);
          }

          const updatedGameTransmission = [
              ...gameTransmission,
              {
              id: createId(),
              eventType: "redCard",
              playerId: gameSignals.scorer1,
              playerName: team_1.find(player => player.id === gameSignals.scorer1)?.name || "",
              playerNumber: team_1.find(player => player.id === gameSignals.scorer1)?.start_number || "",
              time: currentMatchTime,
              teamName: itemData?.team_1,
              team: 1
            }]

          setGameTransmission(updatedGameTransmission);
          
          const result = await saveHarmonogramItemTeamPlayers(eventId, itemData?.id, 1, teamOne, updatedGameTransmission);
          if (result === "success") setDataBaseSubmission(false);
        }
        setGameSignals((prevSignals) => ({ ...prevSignals, redCardsTeam1: 0, scorer1: "" }))  ;
      }
      
      if (gameSignals.redCardsTeam2 == -1 && gameSignals.scorer2 !== "") {
        setDataBaseSubmission(true);
        if (team_2.length > 0) {
          const teamTwo = team_2.map((member) => (member.id === gameSignals.scorer2 ? { ...member, redCards: 1 } : member));
          setTeam_2(teamTwo);

          const updatedEventParticipants = eventParticipants.map(participant => {
              if (participant.id === itemData?.participant_2_id) {
                if (participant.eventTeamMembers ) {
                  participant.eventTeamMembers = participant.eventTeamMembers.map(member => {
                    if (member.id === gameSignals.scorer2) {
                      return { ...member, redCards: (member.redCards || 0) + 1 };
                    }
                    return member;
                  });
               }}
              return participant;
            });

          try {
            await saveNewParticipant(eventId, updatedEventParticipants);
          } catch (error) {
            console.error("Błąd podczas zapisu uczestników:", error);
          }

          const updatedGameTransmission = [
            ...gameTransmission,
            {
              id: createId(),
              eventType: "redCard",
              playerId: gameSignals.scorer2,
              playerName: team_2.find(player => player.id === gameSignals.scorer2)?.name || "",
              playerNumber: team_2.find(player => player.id === gameSignals.scorer2)?.start_number || "",
              time: currentMatchTime,
              teamName: itemData?.team_2,
              team: 2
            }]

          setGameTransmission(updatedGameTransmission);
          const result = await saveHarmonogramItemTeamPlayers(eventId, itemData?.id, 2, teamTwo, updatedGameTransmission);
          if (result === "success") setDataBaseSubmission(false);
        }
        setGameSignals((prevSignals) => ({ ...prevSignals, redCardsTeam2: 0, scorer2: "" }))  ;
      }
      
      if (gameSignals.penaltyTeam1 == -1 && gameSignals.scorer1 !== "") {
        setDataBaseSubmission(true);
        if (team_1.length > 0) {
          const teamOne = team_1.map((member) => (member.id === gameSignals.scorer1 ? { ...member, penalties: (member.penalties || 0) + 1 } : member));
          setTeam_1(teamOne);

          const updatedEventParticipants = eventParticipants.map(participant => {
              if (participant.id === itemData?.participant_1_id) {
                if (participant.eventTeamMembers ) {
                  participant.eventTeamMembers = participant.eventTeamMembers.map(member => {
                    if (member.id === gameSignals.scorer1) {
                      return { ...member, penalties: (member.penalties || 0) + 1 };
                    }
                    return member;
                  });
               }}
              return participant;
            });

          try {
            await saveNewParticipant(eventId, updatedEventParticipants);
          } catch (error) {
            console.error("Błąd podczas zapisu uczestników:", error);
          }

          const updatedGameTransmission = [
              ...gameTransmission,
              {
              id: createId(),
              eventType: "penalty",
              playerId: gameSignals.scorer1,
              playerName: team_1.find(player => player.id === gameSignals.scorer1)?.name || "",
              playerNumber: team_1.find(player => player.id === gameSignals.scorer1)?.start_number || "",
              time: currentMatchTime,
              teamName: itemData?.team_1,
              team: 1
            }]

          setGameTransmission(updatedGameTransmission);
          const result = await saveHarmonogramItemTeamPlayers(eventId, itemData?.id, 1, teamOne, updatedGameTransmission);
          if (result === "success") setDataBaseSubmission(false);
        }
        setGameSignals((prevSignals) => ({ ...prevSignals, penaltyTeam1: 0, scorer1: "" }));
      }

      if (gameSignals.penaltyTeam2 == -1 && gameSignals.scorer2 !== "") {
        setDataBaseSubmission(true);
        if (team_2.length > 0) {
          const teamTwo = team_2.map((member) => (member.id === gameSignals.scorer2 ? { ...member, penalties: (member.penalties || 0) + 1 } : member));
          setTeam_2(teamTwo);

          const updatedEventParticipants = eventParticipants.map(participant => {
              if (participant.id === itemData?.participant_2_id) {
                if (participant.eventTeamMembers ) {
                  participant.eventTeamMembers = participant.eventTeamMembers.map(member => {
                    if (member.id === gameSignals.scorer2) {
                      return { ...member, penalties: (member.penalties || 0) + 1 };
                    }
                    return member;
                  });
               }}
              return participant;
            });

          try {
            await saveNewParticipant(eventId, updatedEventParticipants);
          } catch (error) {
            console.error("Błąd podczas zapisu uczestników:", error);
          }

          const updatedGameTransmission = [
            ...gameTransmission,
            {
              id: createId(),
              eventType: "penalty",
              playerId: gameSignals.scorer2,
              playerName: team_2.find(player => player.id === gameSignals.scorer2)?.name || "",
              playerNumber: team_2.find(player => player.id === gameSignals.scorer2)?.start_number || "",
              time: currentMatchTime,
              teamName: itemData?.team_2,
              team: 2
            }]

          setGameTransmission(updatedGameTransmission);
          const result = await saveHarmonogramItemTeamPlayers(eventId, itemData?.id, 2, teamTwo, updatedGameTransmission);
          if (result === "success") setDataBaseSubmission(false);
        }
        setGameSignals((prevSignals) => ({ ...prevSignals, penaltyTeam2: 0, scorer2: "" }));
      }}

      handleGameSignalsChange();

  }, [gameSignals]);

  const handleSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log(data);
    const gameEndDataTransmission = [...gameTransmission, {
      id: createId(),
      eventType: "endGame",
      team: 1
    }
    ];
    setGameTransmission((prevTransmission) => [
      ...prevTransmission,
      {
        id: createId(),
        eventType: "endGame",
        team: 1
      }
    ]);
    
    setMembers1Active(false);
    setMembers2Active(false);
    setScore1Active(false);
    setScore2Active(false);
    setIsPenaltyButtonActive("disabled");
    setEndTimeVis(false);
    await saveHarmonogramItemTeamPlayers(eventId, itemData?.id, 1, team_1, gameEndDataTransmission);
  }
  
  return (
    <>
      <Timer 
        initialSeconds={matchTime} 
        isUserCreator={isUserCreator} 
        onTimeChange={(seconds) => { gameTimeRef.current = seconds; }}
        setEndTimeVis={setEndTimeVis} 
      />
      {endTimeVis ?
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <div className="w-full md:w-96 rounded-xl flex flex-col items-center justify-center p-5 border-1">
            <div className="text-red-500 font-bold text-xl">Czas gry minął!</div>
            <div className="text-gray-700 text-xl">Czy zakończyć mecz?</div>
            <div className="flex gap-4">
              <Button size="lg" type="submit" className="cursor-pointer bg-green-700 hover:bg-green-800 text-white">
                Tak 
              </Button>
              <Button size="lg" className="cursor-pointer bg-red-500 hover:bg-red-600 text-white" onClick={() => setEndTimeVis(false)}>
                Nie 
              </Button>
            </div>
          </div>
        </form>
      </Form>
       :
      <>
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
        gameEnd={endTimeVis}
        /></>}
      <MatchTeamsMembers 
        team_1_members={team_1}
        team_2_members={team_2}
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
