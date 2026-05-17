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

  return (
    <div className="transmission-single-item">
      {transmissionItem.eventType === "goal" && (
        <div className='w-full flex flex-2 items-center'>
          <div className='flex justify-center items-center border-l-2 border-orange-900'>
            <PiSoccerBallLight size={24}/> 
            {`${transmissionItem.teamName || ""}`}
          </div> 
        </div>
      )}
      {transmissionItem.eventType === "penalty" && (
        <div className='w-full flex flex-2 items-center'>
          <div className='flex justify-center items-center border-l-2 border-orange-900'>
            <PiNumberTwoFill size={24} /> 
            {`${transmissionItem.teamName || ""}`}
          </div>
        </div>
      )}
      {transmissionItem.eventType === "redCard  " && (
        <div className='w-full flex flex-2 items-center'>
          <div className='flex justify-center items-center border-l-2 border-orange-900'>
            <div className="w-4 h-6 bg-red-500 rounded"></div>
            {`${transmissionItem.teamName || ""}`}
          </div> 
        </div>
      )}
      {transmissionItem.eventType === "yellowCard" && (
        <div className='w-full flex flex-2 items-center'>
          <div className='flex justify-center items-center border-l-2 border-orange-900'>
            <div className="w-4 h-6 bg-yellow-300 rounded"></div>
            {`${transmissionItem.teamName || ""}`}
          </div> 
        </div>
      )}
      <div className='w-full h-8 border-l-2 border-orange-900'></div>
    </div>
  );
};

export default TransmissionSingleItem;
