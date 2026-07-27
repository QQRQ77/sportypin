import React from 'react';
import SinglePenaltyTimer from './SinglePenaltyTimer';

type PenaltyTimersProps = {
  penaltyTimeSeconds?: number;
  penaltyTable?: { playerId: string; playerNumber: string | number; time: number; teamNumber: number }[];
  setPenaltyTable?: React.Dispatch<React.SetStateAction<{ playerId: string; playerNumber: string | number; time: number; teamNumber: number }[]>>;
};

const PenaltyTimers: React.FC<PenaltyTimersProps> = ({penaltyTable, penaltyTimeSeconds = 0}) => {

  const penaltyForTeam1 = penaltyTable?.filter(penalty => penalty.teamNumber === 1);
  const penaltyForTeam2 = penaltyTable?.filter(penalty => penalty.teamNumber === 2);

  if (!penaltyTable || penaltyTable.length === 0) return (<></>);

  return (
    <div className="penalty-timers w-full flex flex-col justify-center items-center gap-10 border">
      <h1 className="text-3xl font-bold">Kary:</h1>
      <div className="w-full flex justify-center items-center gap-10">
        <div className="team-1-penalties w-40 flex flex-col items-start justify-center gap-2">
          {penaltyForTeam1?.map((penalty, index) => (
            <SinglePenaltyTimer key={index} penalty={penalty} penaltyTimeSeconds={penaltyTimeSeconds} />
          ))}
        </div>
        <div className="team-2-penalties w-40 flex flex-col items-start justify-center gap-2">
          {penaltyForTeam2?.map((penalty, index) => (
            <SinglePenaltyTimer key={index} penalty={penalty} penaltyTimeSeconds={penaltyTimeSeconds} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PenaltyTimers;
