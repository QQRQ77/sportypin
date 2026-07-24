import React from 'react';

type PenaltyTimersProps = {
  penaltyTimeSeconds?: number;
  penaltyTable?: { playerId: string; playerNumber: string | number; time: number; teamNumber: number }[];
  setPenaltyTable?: React.Dispatch<React.SetStateAction<{ playerId: string; playerNumber: string | number; time: number; teamNumber: number }[]>>;
};

const PenaltyTimers: React.FC<PenaltyTimersProps> = ({penaltyTable}) => {

  const penaltyForTeam1 = penaltyTable?.filter(penalty => penalty.teamNumber === 1);
  const penaltyForTeam2 = penaltyTable?.filter(penalty => penalty.teamNumber === 2);
  
  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (!penaltyTable || penaltyTable.length === 0) return (<></>);

  return (
    <div className="penalty-timers w-full flex flex-col justify-center items-center gap-5">
      <h1 className="text-3xl font-bold">Kary:</h1>
      <div className="w-full flex justify-center items-center gap-10">
        <div className="team-1-penalties flex flex-col items-start gap-2">
          {penaltyForTeam1?.map((penalty, index) => (
            <div key={index} className="penalty-item flex items-center gap-2">
              <span className="player-number font-bold">#{penalty.playerNumber}</span>
              <span className="penalty-time">{formatTime(penalty.time)}</span>
            </div>
          ))}
        </div>
        <div className="team-2-penalties flex flex-col items-start gap-2">
          {penaltyForTeam2?.map((penalty, index) => (
            <div key={index} className="penalty-item flex items-center gap-2">
              <span className="player-number font-bold">#{penalty.playerNumber}</span>
              <span className="penalty-time">{formatTime(penalty.time)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PenaltyTimers;
