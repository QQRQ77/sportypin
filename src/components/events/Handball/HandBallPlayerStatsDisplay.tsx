import React from 'react';
import { PiSoccerBallLight } from "react-icons/pi";
import { PiNumberTwoFill } from "react-icons/pi";


interface HandBallPlayerStatsDisplayProps {
  goals?: number;
  penalties?: number;
  yellowCards?: number;
  redCards?: number;
}

const HandBallPlayerStatsDisplay: React.FC<HandBallPlayerStatsDisplayProps> = ({
  goals = 0,
  penalties = 0,
  yellowCards = 0,
  redCards = 0,

}) => {
  return (
    <div className='flex flex-col items-center justify-center gap-2'>
      {goals > 0 && <div className='flex items-center gap-1'><PiSoccerBallLight /><span className='text-green-600 font-bold'>{goals}</span></div>}
      {penalties > 0 && <div className='flex items-center gap-1'><PiNumberTwoFill /><span className='text-red-600 font-bold'>{penalties}</span></div>}
      {yellowCards > 0 && <div className='flex items-center gap-1'><div className="w-8 h-12 bg-yellow-300 rounded"></div><span className='text-yellow-600 font-bold'>{yellowCards}</span></div>}
      {redCards > 0 && <div className='flex items-center gap-1'><div className="w-8 h-12 bg-red-500 rounded"></div><span className='text-red-600 font-bold'>{redCards}</span></div>}
    </div>
  );
};

export default HandBallPlayerStatsDisplay;