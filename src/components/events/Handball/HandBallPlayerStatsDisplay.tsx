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
    <div className='w-16 flex flex-col items-center justify-start gap-2'>
      {goals > 0 && <div className='w-full flex flex-2 items-center gap-1'><div className='w-8 flex justify-center items-center'><PiSoccerBallLight size={24} /></div><div className='w-8 text-green-700 font-bold'>{goals}</div></div>}
      {penalties > 0 && <div className='flex flex-2 items-center gap-1'><div className='w-8 flex justify-center items-center'><PiNumberTwoFill size={24} /></div><div className='w-8 font-bold'>{penalties}</div></div>}
      {yellowCards > 0 && <div className='flex flex-2 items-center justify-center gap-1'><div className='w-8 flex justify-center items-center'><div className="w-4 h-8 bg-yellow-300 rounded"></div></div><div className="w-8 font-bold">{yellowCards}</div></div>}
      {redCards > 0 && <div className='flex flex-2 items-center justify-center gap-1'><div className='w-8 flex justify-center items-center'><div className="w-4 h-8 bg-red-500 rounded"></div></div><div className='w-8 font-bold'>{redCards}</div></div>}
    </div>
  );
};

export default HandBallPlayerStatsDisplay;