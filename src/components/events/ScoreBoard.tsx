'use client';

import { Dispatch, SetStateAction } from "react";
import { PiNumberTwoFill } from "react-icons/pi";
import { defaultGameSignals, GameSygnals } from "./HandBallGame";

interface ScoreBoardProps {
  isPenaltyButtonActive?: string;
  setIsPenaltyButtonActive: Dispatch<SetStateAction<string>>;
  noTeam1Members: boolean;
  noTeam2Members: boolean;
  team_1_score: number;
  team_2_score: number;
  isUserCreator?: boolean;
  team1active?: boolean;
  team2active?: boolean;
  members1active?: boolean;
  members2active?: boolean;
  setTeam1Active: (active: boolean) => void;
  setTeam2Active: (active: boolean) => void;
  setMembers1Active: (active: boolean) => void;
  setMembers2Active: (active: boolean) => void;
  setGameSignals: Dispatch<SetStateAction<GameSygnals>>;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ 
  team_1_score, team_2_score, isUserCreator = false, team1active = true, team2active = true, 
  members1active = true, members2active = true,
  noTeam1Members = false, noTeam2Members = false, isPenaltyButtonActive = "",
  setTeam1Active, setTeam2Active, setMembers1Active, setMembers2Active, setGameSignals, setIsPenaltyButtonActive }) => {
  
  const handleTeam1ClickAdd = (event: string) => {
    if (event === "") {
      setGameSignals((prevSignals) => ({
        ...defaultGameSignals,
        score1: prevSignals.score1,
        score2: prevSignals.score2,
    }))};

    if (event === "score") {
      setGameSignals((prevSignals) => ({
        ...defaultGameSignals,
        score1: prevSignals.score1 + 1,
        score2: prevSignals.score2,
        }))
      setIsPenaltyButtonActive("disabled");
      if (setTeam2Active && !noTeam1Members) {
        setTeam2Active(isPenaltyButtonActive === "" ? false : true);
      }
      if (setMembers1Active && !noTeam1Members) {
        setMembers1Active(isPenaltyButtonActive === "" ? true : false);
      }
      if (setMembers2Active) {
        setMembers2Active(false);
      }
    };

    if (event === "penalty" && !noTeam1Members) {  
      setGameSignals((prevSignals) => ({
        ...defaultGameSignals,
        penaltyTeam1:  -1,
        score1: prevSignals.score1,
        score2: prevSignals.score2,
      }));
    }
    if (event === "yellowCard" && !noTeam1Members) {
      setGameSignals((prevSignals) => ({
        ...defaultGameSignals,
        yellowCardsTeam1: -1,
        score1: prevSignals.score1,
        score2: prevSignals.score2,
      }));
    }

    if (event === "redCard" && !noTeam1Members) {
      setGameSignals((prevSignals) => ({
        ...defaultGameSignals,
        redCardsTeam1: -1,
        score1: prevSignals.score1,
        score2: prevSignals.score2,
      }));
    }


  };

  const handleTeam1ClickSub = () => {
    if (!(team1active && (isPenaltyButtonActive === "" || isPenaltyButtonActive === "disabled"))) return;
    setGameSignals((prevSignals) => ({
      ...defaultGameSignals,
      score1: prevSignals.score1 - 1,
      score2: prevSignals.score2,
    }));
    setIsPenaltyButtonActive("");
    setTeam1Active(true);
    setTeam2Active(true);
    setMembers1Active(false);
    setMembers2Active(false);
  };

  const handleTeam2ClickAdd = (event: string) => {
    if (event === "") {
      setGameSignals((prevSignals) => ({
        ...defaultGameSignals,
        score1: prevSignals.score1,
        score2: prevSignals.score2,
    }))};
    if (event === "score") {
      setGameSignals((prevSignals) => ({
        ...defaultGameSignals,
        score2: prevSignals.score2 + 1,
        score1: prevSignals.score1,
      }));
      setIsPenaltyButtonActive("disabled");
      if (setTeam1Active && !noTeam2Members) {
        setTeam1Active(false);
      }
      if (setMembers2Active && !noTeam2Members) {
        setMembers2Active(true);
      }
      if (setMembers1Active) {
        setMembers1Active(false);
      }
    }

    if (event === "penalty" && !noTeam2Members) {  
      setGameSignals((prevSignals) => ({
        ...defaultGameSignals,
        penaltyTeam2: -1,
        score1: prevSignals.score1,
        score2: prevSignals.score2,
      }));
    }
    if (event === "yellowCard" && !noTeam2Members) {
      setGameSignals((prevSignals) => ({
        ...defaultGameSignals,
        yellowCardsTeam2: -1,
        score1: prevSignals.score1,
        score2: prevSignals.score2,
      }));
    }
    if (event === "redCard" && !noTeam2Members) {
      setGameSignals((prevSignals) => ({
        ...defaultGameSignals,
        redCardsTeam2: -1,
        score1: prevSignals.score1,
        score2: prevSignals.score2,
      }));
    }
  };

  const handleTeam2ClickSub = () => {
    if (!(team2active && (isPenaltyButtonActive === "" || isPenaltyButtonActive === "disabled"))) return;
    setGameSignals((prevSignals) => ({
      ...defaultGameSignals,
      score2: prevSignals.score2 - 1,
      score1: prevSignals.score1,
    }));
    setIsPenaltyButtonActive("");
    setTeam1Active(true);
    setTeam2Active(true);
    setMembers1Active(false);
    setMembers2Active(false);
  }

  const resetPenaltyState = () => {
      setIsPenaltyButtonActive("");
      setMembers1Active(false);
      setMembers2Active(false);
      setTeam2Active(true);
      setTeam1Active(true);
  };

  const handlePenalty1Click = () => {
    if (isPenaltyButtonActive === "disabled") {
      return;
    }
    if (isPenaltyButtonActive === "penalty1") {
      resetPenaltyState();
      handleTeam1ClickAdd("");
    } else {
      handleTeam1ClickAdd("penalty");
      setIsPenaltyButtonActive("penalty1");
      setMembers1Active(true);
      setMembers2Active(false);
      setTeam1Active(false);
      setTeam2Active(false);
    }
  };

  const handleYellowCard1Click = () => {
    if (isPenaltyButtonActive === "disabled") {
      return;
    }
    if (isPenaltyButtonActive === "yellowCard1") {
      resetPenaltyState();
      handleTeam1ClickAdd("");
    } else {
      handleTeam1ClickAdd("yellowCard");
      setIsPenaltyButtonActive("yellowCard1");
      setMembers1Active(true);
      setMembers2Active(false);
      setTeam1Active(false);
      setTeam2Active(false);
    }
  };

    const handleRedCard1Click = () => {
    if (isPenaltyButtonActive === "disabled") {
      return;
    }
    if (isPenaltyButtonActive === "redCard1") {
      resetPenaltyState();
      handleTeam1ClickAdd("");
    } else {
      handleTeam1ClickAdd("redCard");
      setIsPenaltyButtonActive("redCard1");
      setMembers1Active(true);
      setMembers2Active(false);
      setTeam1Active(false);
      setTeam2Active(false);
    }
  };

  const handlePenalty2Click = () => {
    if (isPenaltyButtonActive === "disabled") {
      return;
    }
    if (isPenaltyButtonActive === "penalty2") {
      resetPenaltyState();
      handleTeam2ClickAdd("");
    } else {
      handleTeam2ClickAdd("penalty");
      setIsPenaltyButtonActive("penalty2");
      setMembers1Active(false);
      setMembers2Active(true);
      setTeam1Active(false);
      setTeam2Active(false);
    }
  };

  const handleYellowCard2Click = () => {
    if (isPenaltyButtonActive === "disabled") {
      return;
    }
    if (isPenaltyButtonActive === "yellowCard2") {
      resetPenaltyState();
      handleTeam2ClickAdd("");
    } else {
      handleTeam2ClickAdd("yellowCard");
      setIsPenaltyButtonActive("yellowCard2");
      setMembers1Active(false);
      setMembers2Active(true);
      setTeam1Active(false);
      setTeam2Active(false);
    }
  };

    const handleRedCard2Click = () => {
    if (isPenaltyButtonActive === "disabled") {
      return;
    }
    if (isPenaltyButtonActive === "redCard2") {
      resetPenaltyState();
      handleTeam2ClickAdd("");
    } else {
      handleTeam2ClickAdd("redCard");
      setIsPenaltyButtonActive("redCard2");
      setMembers1Active(false);
      setMembers2Active(true);
      setTeam1Active(false);
      setTeam2Active(false);
    }
  };

  return (
    <div className="scoreboard flex flex-3 border-1 border-gray-300 rounded-xl pb-4">
      <div className="team-1 flex flex-2 w-64 items-center gap-4">
        <div className="w-12 flex flex-col gap-2 items-center justify-center">
          <PiNumberTwoFill size={48} className={`${isPenaltyButtonActive === "disabled" ? "text-gray-300" : "text-gray-400 cursor-pointer hover:text-gray-500"} ${isPenaltyButtonActive === "penalty1" ? "pulse-border-blue" : "border-1 border-transparent"}`}
            onClick={handlePenalty1Click} />
          <div className={`w-8 h-12 ${isPenaltyButtonActive === "disabled" ? "bg-gray-300" : "bg-yellow-300 cursor-pointer hover:bg-yellow-400"} rounded  ${isPenaltyButtonActive === "yellowCard1" ? "pulse-border-blue p-1" : "border-1 border-transparent"}`}
            onClick={handleYellowCard1Click} ></div>
          <div className={`w-8 h-12 ${isPenaltyButtonActive === "disabled" ? "bg-gray-300" : "bg-red-500 cursor-pointer hover:bg-red-400"} rounded  ${isPenaltyButtonActive === "redCard1" ? "pulse-border-blue p-1" : "border-1 border-transparent"}`}
            onClick={handleRedCard1Click} ></div>
        </div>
        <div className="w-52 flex flex-col items-center gap-4">
          <h2 className="text-9xl font-bold">{team_1_score}</h2>
          {isUserCreator && 
            <div className="flex gap-2">
              <button onClick={() => { if (!(team1active && !members1active)) { return; } handleTeam1ClickAdd("score"); }} className={`px-4 py-2 ${team1active && !members1active ? 'bg-green-600 hover:bg-green-700 cursor-pointer' : 'bg-gray-400'} text-white text-3xl rounded`}>+</button>
              <button onClick={handleTeam1ClickSub} className={`px-4 py-2 ${team1active && (isPenaltyButtonActive === "" || isPenaltyButtonActive === "disabled") ? 'bg-red-600 hover:bg-red-700 cursor-pointer' : 'bg-gray-400'} text-white text-3xl rounded`}>-</button>
            </div>}
        </div>
      </div>

      <div className="text-center text-9xl font-bold w-16 lg:w-24">:</div>
        <div className="team-2 flex flex-2 w-64 items-center gap-4">
          <div className="team-2 w-52 flex flex-col items-center gap-4">
            <h2 className="text-9xl font-bold">{team_2_score}</h2>
            {isUserCreator && 
              <div className="flex gap-2">
                <button onClick={() => { if (!(team2active && !members2active)) { return; } handleTeam2ClickAdd("score"); }} className={`px-4 py-2 ${team2active && !members2active ? 'bg-green-600 hover:bg-green-700 cursor-pointer' : 'bg-gray-400'} text-white text-3xl rounded`}>+</button>
                <button onClick={handleTeam2ClickSub} className={`px-4 py-2 ${team2active && (isPenaltyButtonActive === "" || isPenaltyButtonActive === "disabled") ? 'bg-red-600 hover:bg-red-700 cursor-pointer' : 'bg-gray-400'} text-white text-3xl rounded`}>-</button>
              </div>}
          </div>
          <div className="w-12 flex flex-col gap-2 items-center justify-center">
            <PiNumberTwoFill size={48} className={`${isPenaltyButtonActive === "disabled" ? "text-gray-300" : "text-gray-400 cursor-pointer hover:text-gray-500"} ${isPenaltyButtonActive === "penalty2" ? "pulse-border-green" : "border-1 border-transparent"}`}
              onClick={handlePenalty2Click} />
            <div className={`w-8 h-12 ${isPenaltyButtonActive === "disabled" ? "bg-gray-300" : "bg-yellow-300 cursor-pointer hover:bg-yellow-400"} rounded  ${isPenaltyButtonActive === "yellowCard2" ? "pulse-border-green p-1" : "border-1 border-transparent"}`}
              onClick={handleYellowCard2Click} ></div>
            <div className={`w-8 h-12 ${isPenaltyButtonActive === "disabled" ? "bg-gray-300" : "bg-red-500 cursor-pointer hover:bg-red-400"} rounded  ${isPenaltyButtonActive === "redCard2" ? "pulse-border-green p-1" : "border-1 border-transparent"}`}
              onClick={handleRedCard2Click} ></div>
          </div>
        </div> 
    </div>
  );
};

export default ScoreBoard;