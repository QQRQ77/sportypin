import React from 'react';

type PenaltyTimersProps = {
  penaltyTimeSeconds?: number;
  penaltyTable?: { playerId: string; playerNumber: string | number; time: number; teamNumber: number }[];
  setPenaltyTable?: React.Dispatch<React.SetStateAction<{ playerId: string; playerNumber: string | number; time: number; teamNumber: number }[]>>;
};

const PenaltyTimers: React.FC<PenaltyTimersProps> = ({ penaltyTimeSeconds = 0, penaltyTable = [{ playerId: "", playerNumber: "", time: 0, teamNumber: 0 }], setPenaltyTable }) => {

  console.log("penaltyTable in PenaltyTimers:", penaltyTable);
  console.log("penaltyTimeSeconds in PenaltyTimers:", penaltyTimeSeconds);

  return (
    <div className="penalty-timers">
      <h2 onClick={() => setPenaltyTable && setPenaltyTable(penaltyTable)}>Kary:</h2>
    </div>
  );
};

export default PenaltyTimers;
