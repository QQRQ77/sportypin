import { GameTransmissionItem } from '@/types';
import React from 'react';
import { PiSoccerBallLight } from "react-icons/pi";
import { PiNumberTwoFill } from "react-icons/pi";

interface TransmissionSingleItemProps {
  transmissionItem: GameTransmissionItem
}

const TransmissionSingleItem: React.FC<TransmissionSingleItemProps> = ({
  transmissionItem,
}) => {

  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

  return (
    <div className="transmission-single-item w-full flex flex-col flex-2 items-center justify-center gap-1">
      <div className={`${transmissionItem.team === 1 ? "flex justify-end order-1" : "flex justify-start order-2"} w-full`}>
        {transmissionItem.eventType === "goal" && (
          <div className='w-full flex flex-2 items-center gap-2'>
            <div className='flex justify-center items-center border-l-2 border-orange-900'>          
              <div className='text-sm text-gray-700 w-10'>{formatTime(transmissionItem?.time || 0)}</div>
              <PiSoccerBallLight size={24}/> 
              {`${transmissionItem.teamName || ""}`}
            </div> 
          </div>
        )}
        {transmissionItem.eventType === "penalty" && (
          <div className='w-full flex flex-2 items-center'>
            <div className='flex justify-center items-center border-l-2 border-orange-900'>
              <div className='text-sm text-gray-700 w-10'>{formatTime(transmissionItem?.time || 0)}</div>
              <PiNumberTwoFill size={24} /> 
              {`${transmissionItem.teamName || ""}`}
            </div>
          </div>
        )}
        {transmissionItem.eventType === "redCard" && (
          <div className='w-full flex flex-2 items-center'>
            <div className='flex justify-center items-center border-l-2 border-orange-900'>
              <div className='text-sm text-gray-700 w-10'>{formatTime(transmissionItem?.time || 0)}</div>
              <div className='w-6 flex justify-center'>
                <div className="w-4 h-6 bg-red-500 rounded"></div>
              </div>
              {`${transmissionItem.teamName || ""}`}
            </div> 
          </div>
        )}
        {transmissionItem.eventType === "yellowCard" && (
          <div className='w-full flex flex-2 items-center'>
            <div className='flex justify-center items-center border-l-2 border-orange-900'>
              <div className='text-sm text-gray-700 w-10'>{formatTime(transmissionItem?.time || 0)}</div>
              <div className='w-6 flex justify-center'>
                <div className="w-4 h-6 bg-yellow-300 rounded"></div>
              </div>
              {`${transmissionItem.teamName || ""}`}
            </div> 
          </div>
        )}
        <div className='w-full h-8 border-l-2 border-orange-900'></div>
      </div>
    </div>
  );
};

export default TransmissionSingleItem;
