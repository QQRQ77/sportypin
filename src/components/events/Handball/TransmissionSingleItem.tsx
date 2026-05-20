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
    return `${String(minutes)}'${String(secs)}''`;
    };
  
  const team_1 = transmissionItem.team === 1 

  const renderEvent = () => (
    <>
      {transmissionItem.eventType === "goal" && (
        <div className={team_1 ? 'w-full h-10 flex items-center justify-end' : 'w-full h-10 flex items-center justify-start'}>
          <div className='flex items-center gap-2'>          
            <div className={`font-bold text-gray-700 w-10 ${team_1 ? 'order-3' : 'order-1'}`}>{formatTime(transmissionItem?.time || 0)}</div>
            <PiSoccerBallLight size={24} className={`order-2`}/> 
            <div className={`${team_1 ? 'order-1' : 'order-3'}`}>{`${transmissionItem.playerName || ""}`} <span className='font-bold'>{`#${transmissionItem.playerNumber || ""}`}</span></div>
          </div> 
        </div>
      )}
      {transmissionItem.eventType === "penalty" && (
        <div className={team_1 ? 'w-full h-10 flex items-center justify-end' : 'w-full h-10 flex items-center justify-start'}>
          <div className={`flex items-center gap-2 ${team_1 ? 'justif' : 'justify-start'}`}>
            <div className={`font-bold text-gray-700 w-10 ${team_1 ? 'order-3' : 'order-1'}`}>{formatTime(transmissionItem?.time || 0)}</div>
            <PiNumberTwoFill size={24} className={`order-2`}/> 
            <div className={`${team_1 ? 'order-1' : 'order-3'}`}>{`${transmissionItem.playerName || ""}`} <span className='font-bold'>{`#${transmissionItem.playerNumber || ""}`}</span></div>
          </div>
        </div>
      )}
      {transmissionItem.eventType === "redCard" && (
        <div className={team_1 ? 'w-full h-10 flex items-center justify-end' : 'w-full h-10 flex items-center justify-start'}>
          <div className='flex items-center gap-2'>
            <div className={`font-bold text-gray-700 w-10 ${team_1 ? 'order-3' : 'order-1'}`}>{formatTime(transmissionItem?.time || 0)}</div>
            <div className='w-6 flex justify-center order-2'>
              <div className="w-4 h-6 bg-red-500 rounded"></div>
            </div>
            <div className={`${team_1 ? 'order-1' : 'order-3'}`}>{`${transmissionItem.playerName || ""}`} <span className='font-bold'>{`#${transmissionItem.playerNumber || ""}`}</span></div>
          </div> 
        </div>
      )}
      {transmissionItem.eventType === "yellowCard" && (
        <div className={team_1 ? 'w-full h-10 flex items-center justify-end' : 'w-full h-10 flex items-center justify-start'}>
          <div className='flex items-center gap-2'>
            <div className={`font-bold text-gray-700 w-10 ${team_1 ? 'order-3' : 'order-1'}`}>{formatTime(transmissionItem?.time || 0)}</div>
            <div className='w-6 flex justify-center order-2'>
              <div className="w-4 h-6 bg-yellow-300 rounded"></div>
            </div>
            <div className={`${team_1 ? 'order-1' : 'order-3'}`}>{`${transmissionItem.playerName || ""}`} <span className='font-bold'>{`#${transmissionItem.playerNumber || ""}`}</span></div>
          </div> 
        </div>
      )}
    </>
  );

  return (
    <div className="transmission-single-item w-full flex items-center justify-center">
      <div className="w-1/2 relative flex justify-end border-r-4 border-orange-900 pr-12">
        {transmissionItem.eventType === "goal" ? 
        <div className="absolute flex items-center justify-center w-18 -right-9.5 top-1/2 h-8 -translate-y-1/2 border-4 border-orange-900 bg-white rounded-full font-semibold">{transmissionItem.score || ""}</div>
        : (transmissionItem.eventType === "endGame" ?
          <div className='absolute flex justify-center items-center -right-20 top-1/2 h-12 w-40 -translate-y-1/2 bg-orange-600 text-white text-xl p-2 rounded-full border-4 border-orange-900'>Koniec meczu</div>
        : <div className="absolute -right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 border-4 border-orange-900 bg-white rounded-full" />)
        }
        {transmissionItem.team === 1 ? renderEvent() : <div className='w-full h-10' />}
      </div>
      <div className="w-1/2 flex justify-start pl-10">
        {transmissionItem.team === 2 ? renderEvent() : <div className='w-full h-10' />}
      </div>
    </div>
  );
};

export default TransmissionSingleItem;
