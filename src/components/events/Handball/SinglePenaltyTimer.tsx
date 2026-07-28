import React, { useEffect, useState } from 'react';

type SinglePenaltyTimerProps = {
  penalty: { penaltyId: string; playerId: string; playerNumber: string | number; time: number; teamNumber: number };
  setPenaltyTable?: React.Dispatch<React.SetStateAction<{ penaltyId: string; playerId: string; playerNumber: string | number; time: number; teamNumber: number }[]>>;
  penaltyTimeSeconds?: number;
  isMainClockRunning?: boolean;
};


const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

const SinglePenaltyTimer: React.FC<SinglePenaltyTimerProps> = ({ penalty, penaltyTimeSeconds = 0, isMainClockRunning = true, setPenaltyTable }) => {
  
  const [penaltySeconds, setPenaltySeconds] = useState(penaltyTimeSeconds);
  const [isPenaltyRunning, setIsPenaltyRunning] = useState(isMainClockRunning && penaltySeconds > 0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPenaltyRunning && penaltySeconds > 0) {
      interval = setInterval(() => {
        setPenaltySeconds((prev) => {
          const nextSecond = prev - 1;
          if (nextSecond === 0) {
            setIsPenaltyRunning(false);
          }
          return nextSecond;
        });
      }, 1000);
    } else if (penaltySeconds === 0) {
      setIsPenaltyRunning(false);
      if (setPenaltyTable) {
        setPenaltyTable(prev => prev?.filter((item) => item.penaltyId !== penalty.penaltyId));
      }
    }

    return () => clearInterval(interval);
  }, [ isPenaltyRunning, penaltySeconds ]);  
  
  return (
    <>
      <div className="single-penalty-timer flex items-center gap-2">
        <h3 className='text-lg font-bold h-max'>#{penalty.playerNumber}</h3>
        <div className="flex flex-col justify-center items-center gap-2">
          <div className='flex items-center gap-2'>
            <p>{formatTime(penalty.time)}</p>
            <p>-</p>
            <p>{formatTime(penalty.time + penaltyTimeSeconds)}</p>
          </div>
          <div className='font-bold text-lg'>{formatTime(penaltySeconds)}</div>
        </div>
      </div>
    </>
  );
};

export default SinglePenaltyTimer;
