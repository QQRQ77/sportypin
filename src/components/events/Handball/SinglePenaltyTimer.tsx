import React from 'react';

type SinglePenaltyTimerProps = {
  penalty: { playerId: string; playerNumber: string | number; time: number; teamNumber: number };
};


const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };
  
const SinglePenaltyTimer: React.FC<SinglePenaltyTimerProps> = ({ penalty }) => {
  return (
    <div className="single-penalty-timer">
      <h3>#{penalty.playerNumber}</h3>
      <p>{formatTime(penalty.time)}</p> 
    </div>
  );
};

export default SinglePenaltyTimer;
