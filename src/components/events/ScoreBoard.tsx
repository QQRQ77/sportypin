'use client';

import { useState } from "react";
import { PiNumberTwoFill } from "react-icons/pi";
import { GameSygnals } from "./HandBallGame";

interface ScoreBoardProps {
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
  setGameSignals: (signals: GameSygnals) => void;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ 
  team_1_score, team_2_score, isUserCreator = false, team1active = true, team2active = true, 
  members1active = true, members2active = true,
  noTeam1Members = false, noTeam2Members = false,
  setTeam1Active, setTeam2Active, setMembers1Active, setMembers2Active }) => {

  const [score1, setScore1] = useState(team_1_score);
  const [score2, setScore2] = useState(team_2_score);

  const handleTeam1ClickAdd = () => {
    setScore1(score1 + 1);
    if (setTeam2Active && !noTeam1Members) {
      setTeam2Active(false);
    }
    if (setMembers1Active && !noTeam1Members) {
      setMembers1Active(true);
    }
    if (setMembers2Active) {
      setMembers2Active(false);
    }
  };

   const handleTeam1ClickSub = () => {
    setScore1(score1 - 1);
    setTeam1Active(true);
    setTeam2Active(true);
    setMembers1Active(false);
    setMembers2Active(false);
  };

  const handleTeam2ClickAdd = () => {
    setScore2(score2 + 1);
    if (setTeam1Active && !noTeam2Members) {
      setTeam1Active(false);
    }
    if (setMembers2Active && !noTeam2Members) {
      setMembers2Active(true);
    }
    if (setMembers1Active) {
      setMembers1Active(false);
    }
  };

  const handleTeam2ClickSub = () => {
    setScore2(score2 - 1);
    setTeam1Active(true);
    setTeam2Active(true);
    setMembers1Active(false);
    setMembers2Active(false);
  }


  return (
    <div className="scoreboard flex flex-3 border-1 border-gray-300 rounded-xl pb-4">
      <div className="team-1 flex flex-2 w-64 items-center gap-4">
        <div className="w-12 flex flex-col gap-2 items-center justify-center">
          <PiNumberTwoFill size={48} className="text-gray-400 cursor-pointer hover:text-gray-500" />
          <div className="w-8 h-12 bg-yellow-300 rounded cursor-pointer hover:bg-yellow-400"></div>
          <div className="w-8 h-12 bg-red-500 rounded cursor-pointer hover:bg-red-600"></div>
        </div>
        <div className="w-52 flex flex-col items-center gap-4">
          <h2 className="text-9xl font-bold">{score1}</h2>
          {isUserCreator && 
            <div className="flex gap-2">
              <button onClick={handleTeam1ClickAdd} className={`px-4 py-2 ${team1active && !members1active ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400'} text-white text-3xl rounded cursor-pointer`}>+</button>
              <button onClick={handleTeam1ClickSub} className={`px-4 py-2 ${team1active ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-400'} text-white text-3xl rounded cursor-pointer`}>-</button>
            </div>}
        </div>
      </div>

      <div className="text-center text-9xl font-bold w-16 lg:w-24">:</div>
        <div className="team-2 flex flex-2 w-64 items-center gap-4">
          <div className="team-2 w-52 flex flex-col items-center gap-4">
            <h2 className="text-9xl font-bold">{score2}</h2>
            {isUserCreator && 
              <div className="flex gap-2">
                <button onClick={handleTeam2ClickAdd} className={`px-4 py-2 ${team2active && !members2active ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400'} text-white text-3xl rounded cursor-pointer`}>+</button>
                <button onClick={handleTeam2ClickSub} className={`px-4 py-2 ${team2active ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-400'} text-white text-3xl rounded cursor-pointer`}>-</button>
              </div>}
          </div>
          <div className="w-12 flex flex-col gap-2 items-center justify-center">
            <PiNumberTwoFill size={48} className="text-gray-400 cursor-pointer hover:text-gray-500" />
            <div className="w-8 h-12 bg-yellow-300 rounded cursor-pointer hover:bg-yellow-400"></div>
            <div className="w-8 h-12 bg-red-500 rounded cursor-pointer hover:bg-red-600"></div>
          </div>
        </div> 
    </div>
  );
};

export default ScoreBoard;