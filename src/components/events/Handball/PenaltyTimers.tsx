import React from 'react';

type PenaltyTimersProps = {
  penaltyTimeSeconds?: number;
  penaltyTable?: { playerId: string; playerNumber: string | number; time: number; teamNumber: number }[];
  setPenaltyTable?: React.Dispatch<React.SetStateAction<{ playerId: string; playerNumber: string | number; time: number; teamNumber: number }[]>>;
};

const PenaltyTimers: React.FC<PenaltyTimersProps> = ({ penaltyTimeSeconds = 0, penaltyTable = [{ playerId: "", playerNumber: "", time: 0, teamNumber: 0 }], setPenaltyTable }) => {

  console.log("penaltyTable in PenaltyTimers:", penaltyTable);
  console.log("penaltyTimeSeconds in PenaltyTimers:", penaltyTimeSeconds);
  
  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="penalty-timers w-full flex justify-center items-center gap-5">
      <h1 className="text-3xl font-bold">Kary:</h1>
      {penaltyTable && penaltyTable.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {penaltyTable.map((penalty, index) => (
            <li key={index} className="flex gap-2 items-center">
              <span className="font-bold">Gracz: {penalty.playerNumber}</span>
              <span className="font-mono">Czas: {formatTime(penalty.time)}</span>
              <span className="font-bold">Drużyna: {penalty.teamNumber}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>Brak kar w tym momencie.</p>
      )}
      <h2 onClick={() => setPenaltyTable && setPenaltyTable([])}>Wyczyść kary</h2>
      <h2 onClick={() => setPenaltyTable && setPenaltyTable(penaltyTable)}>Kary:</h2>
    </div>
  );
};

export default PenaltyTimers;
