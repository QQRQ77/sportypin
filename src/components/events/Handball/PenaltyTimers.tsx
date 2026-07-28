import React from 'react';
import SinglePenaltyTimer from './SinglePenaltyTimer';
import { Button } from '@/components/ui/button';
import { FaRegTimesCircle } from "react-icons/fa";

type PenaltyTimersProps = {
  penaltyTimeSeconds?: number;
  isTimerRunning?: boolean;
  penaltyTable?: { penaltyId: string; playerId: string; playerNumber: string | number; time: number; teamNumber: number }[];
  setPenaltyTable?: React.Dispatch<React.SetStateAction<{ penaltyId: string; playerId: string; playerNumber: string | number; time: number; teamNumber: number }[]>>;
};

const PenaltyTimers: React.FC<PenaltyTimersProps> = ({penaltyTable, penaltyTimeSeconds = 0, isTimerRunning = false, setPenaltyTable}) => {

  const penaltyForTeam1 = penaltyTable?.filter(penalty => penalty.teamNumber === 1);
  const penaltyForTeam2 = penaltyTable?.filter(penalty => penalty.teamNumber === 2);

  if (!penaltyTable || penaltyTable.length === 0) return (<></>);

  return (
    <div className="penalty-timers w-full flex flex-col justify-center items-center gap-10">
      <h1 className="text-3xl font-bold">Kary:</h1>
      <div className="w-full flex justify-center items-center gap-20">
        <div className="team-1-penalties w-40 flex flex-col items-start justify-start gap-2">
          {penaltyForTeam1?.map((penalty, index) => (
            <div className="flex gap-2 justify-center items-center" key={index}>            
              <SinglePenaltyTimer penalty={penalty} penaltyTimeSeconds={penaltyTimeSeconds} setPenaltyTable={setPenaltyTable} />
              <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700 transition-colors duration-300 cursor-pointer"
                onClick={() => {
                  if (setPenaltyTable) {
                    setPenaltyTable(prev => prev?.filter((item) => item.penaltyId !== penalty.penaltyId));
                  }
                }}
              >
                <FaRegTimesCircle />
              </Button>
            </div>
          ))}
        </div>
        <div className="team-2-penalties w-40 flex flex-col items-start justify-start gap-2">
          {penaltyForTeam2?.map((penalty, index) => (
            <div className="flex gap-2 justify-center items-center" key={index}>            
              <SinglePenaltyTimer penalty={penalty} penaltyTimeSeconds={penaltyTimeSeconds} setPenaltyTable={setPenaltyTable} />
              <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700 transition-colors duration-300 cursor-pointer"
                onClick={() => {
                  if (setPenaltyTable) {
                    setPenaltyTable(prev => prev?.filter((item) => item.penaltyId !== penalty.penaltyId));
                  }
                }}
              >
                <FaRegTimesCircle />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PenaltyTimers;
