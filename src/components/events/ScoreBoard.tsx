'use client';

import { useState } from "react";

interface ScoreBoardProps {
  team_1_score: number;
  team_2_score: number;
  isUserCreator?: boolean;
  team1active?: boolean;
  team2active?: boolean;
  members1active?: boolean;
  members2active?: boolean;
  setTeam1Active?: (active: boolean) => void;
  setTeam2Active?: (active: boolean) => void;
  setMembers1Active?: (active: boolean) => void;
  setMembers2Active?: (active: boolean) => void;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ 
  team_1_score, team_2_score, isUserCreator = false, team1active = true, team2active = true, members1active = true, members2active = true,
  setTeam1Active, setTeam2Active, setMembers1Active, setMembers2Active }) => {

  const [score1, setScore1] = useState(team_1_score);
  const [score2, setScore2] = useState(team_2_score);

  const handleTeam1ClickAdd = () => {
    setScore1(score1 + 1);
    if (setTeam2Active) {
      setTeam2Active(false);
    }
    if (setMembers1Active) {
      setMembers1Active(true);
    }
    if (setMembers2Active) {
      setMembers2Active(false);
    }
  };

   const handleTeam1ClickSub = () => {
    setScore1(score1 - 1);
  };

  const handleTeam2ClickAdd = () => {
    setScore2(score2 + 1);
    if (setTeam1Active) {
      setTeam1Active(false);
    }
    if (setMembers2Active) {
      setMembers2Active(true);
    }
    if (setMembers1Active) {
      setMembers1Active(false);
    }
  };

  const handleTeam2ClickSub = () => {
    setScore2(score2 - 1);
  }


  return (
    <div className="scoreboard flex flex-3 border-1 border-gray-300 rounded-xl pb-4">
      <div className="team-1 w-52 flex flex-col items-center gap-4">
        <h2 className="text-9xl font-bold">{score1}</h2>
        {isUserCreator && 
          <div className="flex gap-2">
            <button onClick={handleTeam1ClickAdd} className={`px-4 py-2 ${team1active && !members1active ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400'} text-white text-3xl rounded cursor-pointer`}>+</button>
            <button onClick={handleTeam1ClickSub} className={`px-4 py-2 ${team1active ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-400'} text-white text-3xl rounded cursor-pointer`}>-</button>
          </div>}
      </div>
      <div className="text-center text-9xl font-bold w-16 lg:w-24">:</div>
      <div className="team-2 w-52 flex flex-col items-center gap-4">
        <h2 className="text-9xl font-bold">{score2}</h2>
        {isUserCreator && 
          <div className="flex gap-2">
            <button onClick={handleTeam2ClickAdd} className={`px-4 py-2 ${team2active && !members2active ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400'} text-white text-3xl rounded cursor-pointer`}>+</button>
            <button onClick={handleTeam2ClickSub} className={`px-4 py-2 ${team2active ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-400'} text-white text-3xl rounded cursor-pointer`}>-</button>
          </div>}
      </div>
    </div>
  );
};

export default ScoreBoard;