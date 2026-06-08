import React from 'react';
import { PiSoccerBallLight } from "react-icons/pi";
import { PiNumberTwoFill } from "react-icons/pi";


interface HandBallPlayerStatsDisplayProps {
  displayDirection?: "row" | "column";
  goals?: number;
  penalties?: number;
  yellowCards?: number;
  redCards?: number;
}

const HandBallPlayerStatsDisplay: React.FC<HandBallPlayerStatsDisplayProps> = ({
  displayDirection = "column",
  goals = 0,
  penalties = 0,
  yellowCards = 0,
  redCards = 0,

}) => {
  return (
    <div className={`flex ${displayDirection === "row" ? "w-58 flex-row" : "w-14 flex-col"} items-center justify-start gap-2`}>
      <div className='w-1/4 h-8 flex flex-2 items-center'>{goals > 0 && <><div className='w-8 flex justify-center items-center'><PiSoccerBallLight size={24} /></div><div className='w-6 text-green-700 font-bold'>{goals}</div></>}</div>
      <div className='w-1/4 h-8 flex flex-2 items-center'>{penalties > 0 && <><div className='w-8 flex justify-center items-center'><PiNumberTwoFill size={24} /></div><div className='w-6 font-bold'>{penalties}</div></>}</div>
      <div className='w-1/4 h-8 flex flex-2 items-center justify-center'>{yellowCards > 0 && <><div className='w-8 flex justify-center items-center'><div className="w-4 h-6 bg-yellow-300 rounded"></div></div><div className="w-6 font-bold">{yellowCards}</div></>}</div>
      <div className='w-1/4 h-8 flex flex-2 items-center justify-center'>{redCards > 0 && <><div className='w-8 flex justify-center items-center'><div className="w-4 h-6 bg-red-500 rounded"></div></div><div className='w-6 font-bold'>{redCards}</div></>}</div>
    </div>
  );
};

export default HandBallPlayerStatsDisplay;