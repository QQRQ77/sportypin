'use client'

import { ArrowPathRoundedSquareIcon, PauseIcon, PlayIcon } from '@heroicons/react/20/solid';
import React, { useState, useEffect, Dispatch, SetStateAction, useRef } from 'react';
import { SiTvtime } from 'react-icons/si';

interface TimerProps {
  isUserCreator?: boolean;
  onTimeChange: (seconds: number) => void;
  setEndTimeVis: Dispatch<SetStateAction<number>>;
  teamBreaks?: number;
  teamBreaksSeconds?: number;
  timerRunning?: boolean;
  setTimerRunning: Dispatch<SetStateAction<boolean>>; 
  periodMinutes?: number;
  periods?: number;
  breakMinutes?: number;
}

export const Timer: React.FC<TimerProps> = ({ isUserCreator = false, 
  onTimeChange, setEndTimeVis, teamBreaks = 0, teamBreaksSeconds = 0, timerRunning = false, setTimerRunning,
  periodMinutes = 0, periods = 0, breakMinutes = 0
  }) => {

  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(timerRunning);
  const [teamBreakSeconds, setTeamBreakSeconds] = useState(teamBreaksSeconds);
  const [isTeamBreakRunning, setIsTeamBreakRunning] = useState(false);
  const [gameBreakSeconds, setGameBreakSeconds] = useState(breakMinutes * 60);
  const [isGameBreakRunning, setIsGameBreakRunning] = useState(false);
  
  // STATYSTYKA STICKY: Tutaj przechowujemy informację, czy element się przykleił
  const [isStuck, setIsStuck] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Jeśli nasz niewidzialny "strażnik" NIE jest widoczny na ekranie,
        // to znaczy, że przewinęliśmy stronę w dół i timer stał się sticky.
        setIsStuck(!entry.isIntersecting);
      },
      { 
        // próg czułości: reaguj dokładnie na linii top-0
        rootMargin: '-1px 0px 0px 0px', 
        threshold: [0] 
      }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) observer.unobserve(sentinelRef.current);
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    for (let i = 1; i <= periods; i++) {

    }
    if (isRunning && seconds < periodMinutes * 60 * periods) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          const nextSecond = prev + 1;
          onTimeChange(nextSecond);
          for (let i = 1; i < periods; i++) {
            if (nextSecond === periodMinutes * 60 * i) {
              setIsRunning(false);
              setTimerRunning(false);
              setIsGameBreakRunning(true);
              setEndTimeVis(i);
            }
          }
          if (nextSecond >= periodMinutes * 60 * periods) {
            setIsRunning(false);
            setTimerRunning(false);
            setEndTimeVis(periods);
          }
          return nextSecond;
        });
      }, 1000);
    } else if (seconds === periodMinutes * 60 * periods) {
      setIsRunning(false);
      setTimerRunning(false);
    }

    return () => clearInterval(interval);
  }, [isRunning, seconds, onTimeChange, periodMinutes, periods, setEndTimeVis, setTimerRunning]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTeamBreakRunning && teamBreakSeconds > 0) {
      interval = setInterval(() => {
        setTeamBreakSeconds((prev) => {
          const nextSecond = prev - 1;
          if (nextSecond === 0) {
            setIsTeamBreakRunning(false);
          }
          return nextSecond;
        });
      }, 1000);
    } else if (teamBreakSeconds === 0) {
      setIsRunning(false);
      setTeamBreakSeconds(teamBreaksSeconds); // Reset break time after it ends
    }

    return () => clearInterval(interval);
  }, [ isTeamBreakRunning, teamBreakSeconds ]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isGameBreakRunning && gameBreakSeconds > 0) {
      interval = setInterval(() => {
        setGameBreakSeconds((prev) => {
          const nextSecond = prev - 1;
          if (nextSecond === 0) {
            setIsGameBreakRunning(false);
          }
          return nextSecond;
        });
      }, 1000);
    } else if (gameBreakSeconds === 0) {
      setIsRunning(false);
      setGameBreakSeconds(gameBreakSeconds); // Reset break time after it ends
    }

    return () => clearInterval(interval);
  }, [ isGameBreakRunning, gameBreakSeconds ]);

  useEffect(() => {
    if (isRunning) {
      setIsTeamBreakRunning(false); 
      setTeamBreakSeconds(teamBreaksSeconds);
      setIsGameBreakRunning(false);
      setGameBreakSeconds(breakMinutes * 60);
    };
  }, [teamBreaksSeconds, isRunning, breakMinutes, gameBreakSeconds]);

  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleToggle = () => {
    setIsRunning(!isRunning); 
    setTimerRunning(!isRunning);
  };
  
  const handleReset = () => {
    setIsRunning(false);
    setTimerRunning(false);
    setTeamBreakSeconds(teamBreaksSeconds);
    setIsTeamBreakRunning(false);
    setSeconds(0);
  };
  const handleAddSecond = () => setSeconds((prev) => prev + 1);
  const handleSubtractSecond = () => setSeconds((prev) => (prev > 0 ? prev - 1 : 0));

  return (
    <>
      <div ref={sentinelRef} className="h-px w-full bg-transparent" />
      <div className={isStuck ? "sticky top-0 self-end right-0 z-50 flex flex-col items-center gap-4 p-6 border-1 border-gray-300 bg-white rounded-xl" : "flex flex-col items-center gap-4 p-6 border-1 border-gray-300 rounded-xl"}>
        <div className='text-xl font-mono'>Czas gry: <span className="font-bold">{periods} x {formatTime(periodMinutes * 60)}</span></div>
        <div className="text-6xl font-bold font-mono">{formatTime(seconds)}</div>
        {isGameBreakRunning && (
            <div className="flex items-center gap-2 mt-2">
              <h2>Przerwa:</h2>
              <div className="text-3xl font-bold font-mono">{formatTime(gameBreakSeconds)}</div>
            </div>
          )}
        
        {isUserCreator && 
        <div className="flex flex-col items-center gap-2">
          {!isRunning ?
          <PlayIcon onClick={handleToggle} className='w-14 h-14 cursor-pointer'/> : <PauseIcon onClick={handleToggle} className='w-14 h-14 cursor-pointer'/>}
                  
          <div className='flex gap-2'>

            <button
              onClick={() => setSeconds((prev) => (prev > 60 ? prev - 60 : 0))}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
            >
              -1m
            </button>
            
            <button
              onClick={() => setSeconds((prev) => prev + 60)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer mr-5"
            >
              +1m
            </button>

            <button
              onClick={handleSubtractSecond}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
            >
              -1s
            </button>
            <button
              onClick={handleAddSecond}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer"
            >
              +1s
            </button>
          </div>
          <ArrowPathRoundedSquareIcon onClick={handleReset} className="m-2 h-10 w-10 cursor-pointer border border-gray-300 rounded-full"/>
          {teamBreaks > 0 && (
            <div className="flex items-center gap-1 mt-2 cursor-pointer" onClick={() => {setIsTeamBreakRunning(true); setIsRunning(false); setTimerRunning(false);}}>
              <SiTvtime size={32} className="text-gray-600" />
              <div className="text-2xl font-bold font-mono">{formatTime(teamBreakSeconds)}</div>
            </div>
          )}
        </div>}
      </div>
    </>
  );
};