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
        <div className='flex justify-center items-center'><PiSoccerBallLight size={24}/> {`${transmissionItem.teamName || ""}`}</div> 
      </div>
    )}
    {transmissionItem.eventType === "penalty" && (
      <div className='w-full h-8 flex flex-2 items-center'>
        <div className='w-8 flex justify-center items-center'><PiNumberTwoFill size={24} /></div>
      </div>
    )}
    </div>
  );
};

export default TransmissionSingleItem;
