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

  const renderEvent = () => (
    <>
      {transmissionItem.eventType === "goal" && (
        <div className='w-full flex items-center'>
          <div className='flex justify-center items-center border-l-2 border-orange-900 gap-2'>          
            <div className='text-sm text-gray-700 w-10'>{formatTime(transmissionItem?.time || 0)}</div>
            <PiSoccerBallLight size={24}/> 
            {`${transmissionItem.teamName || ""}`}
          </div> 
        </div>
      )}
      {transmissionItem.eventType === "penalty" && (
        <div className='w-full flex items-center'>
          <div className='flex justify-center items-center border-l-2 border-orange-900 gap-2'>
            <div className='text-sm text-gray-700 w-10'>{formatTime(transmissionItem?.time || 0)}</div>
            <PiNumberTwoFill size={24} /> 
            {`${transmissionItem.teamName || ""}`}
          </div>
        </div>
      )}
      {transmissionItem.eventType === "redCard" && (
        <div className='w-full flex items-center'>
          <div className='flex justify-center items-center border-l-2 border-orange-900 gap-2'>
            <div className='text-sm text-gray-700 w-10'>{formatTime(transmissionItem?.time || 0)}</div>
            <div className='w-6 flex justify-center'>
              <div className="w-4 h-6 bg-red-500 rounded"></div>
            </div>
            {`${transmissionItem.teamName || ""}`}
          </div> 
        </div>
      )}
      {transmissionItem.eventType === "yellowCard" && (
        <div className='w-full flex items-center'>
          <div className='flex justify-center items-center border-l-2 border-orange-900 gap-2'>
            <div className='text-sm text-gray-700 w-10'>{formatTime(transmissionItem?.time || 0)}</div>
            <div className='w-6 flex justify-center'>
              <div className="w-4 h-6 bg-yellow-300 rounded"></div>
            </div>
            {`${transmissionItem.teamName || ""}`}
          </div> 
        </div>
      )}
    </>
  );

  return (
    <div className="transmission-single-item w-full flex items-center justify-center gap-2">
      <div className="w-1/2 flex justify-start border-r-2 border-orange-900">
        {transmissionItem.team === 1 ? renderEvent() : <div className='w-full h-8' />}
      </div>
      <div className="w-1/2 flex justify-end border-l-2 border-orange-900">
        {transmissionItem.team === 2 ? renderEvent() : <div className='w-full h-8' />}
      </div>
    </div>
  );
};

export default TransmissionSingleItem;
