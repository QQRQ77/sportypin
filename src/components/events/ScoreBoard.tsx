'use client';

import { useState } from "react";

interface ScoreBoardProps {
  team_1_score: number;
  team_2_score: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ team_1_score, team_2_score }) => {

  const [score1, setScore1] = useState(team_1_score);
  const [score2, setScore2] = useState(team_2_score);
  
  return (
    <div className="scoreboard flex flex-2">
      <div className="team-1 w-52 flex flex-col items-center gap-4">
        <h2 className="text-9xl font-bold">{score1}</h2>
        <div className="flex gap-2">
          <button onClick={() => setScore1(score1 + 1)} className="px-4 py-2 bg-green-600 text-white text-3xl rounded hover:bg-green-700 cursor-pointer">+</button>
          <button onClick={() => setScore1(score1 - 1)} className="px-4 py-2 bg-red-600 text-white text-3xl rounded hover:bg-red-700 cursor-pointer">-</button>
        </div>
      </div>
      <div className="team-2 w-52 flex flex-col items-center gap-4">
        <h2 className="text-9xl font-bold">{score2}</h2>
        <div className="flex gap-2">
          <button onClick={() => setScore2(score2 + 1)} className="px-4 py-2 bg-green-600 text-white text-3xl rounded hover:bg-green-700 cursor-pointer">+</button>
          <button onClick={() => setScore2(score2 - 1)} className="px-4 py-2 bg-red-600 text-white text-3xl rounded hover:bg-red-700 cursor-pointer">-</button>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;