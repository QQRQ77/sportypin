import React from 'react';

type SinglePenaltyTimerProps = {
  penalty: { playerId: string; playerNumber: string | number; time: number; teamNumber: number };
  penaltyTimeSeconds?: number;
};


const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

const SinglePenaltyTimer: React.FC<SinglePenaltyTimerProps> = ({ penalty, penaltyTimeSeconds = 0 }) => {
  return (
    <div className="single-penalty-timer flex items-center gap-2">
      <h3 className="text-lg font-bold">#{penalty.playerNumber}</h3>
      <p>{formatTime(penalty.time)}</p>
      <p className="text-lg font-medium mx-3">-</p>
      <p>{formatTime(penalty.time + penaltyTimeSeconds)}</p>
    </div>
  );
};

export default SinglePenaltyTimer;
