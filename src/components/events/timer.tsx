'use client'

import { ArrowPathRoundedSquareIcon, PauseIcon, PlayIcon } from '@heroicons/react/20/solid';
import React, { useState, useEffect, Dispatch, SetStateAction, useRef } from 'react';
import { SiTvtime } from 'react-icons/si';

interface TimerProps {
  initialSeconds?: number;
  isUserCreator?: boolean;
  onTimeChange: (seconds: number) => void;
  setEndTimeVis: Dispatch<SetStateAction<boolean>>;
  teamBreaks?: number;
  teamBreaksSeconds?: number; 
}

export const Timer: React.FC<TimerProps> = ({ initialSeconds = 300, isUserCreator = false, onTimeChange, setEndTimeVis, teamBreaks = 0, teamBreaksSeconds = 0 }) => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [breakSeconds, setBreakSeconds] = useState(teamBreaksSeconds);
  const [isBreakRunning, setIsBreakRunning] = useState(false);

  
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

    if (isRunning && seconds < initialSeconds) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          const nextSecond = prev + 1;
          onTimeChange(nextSecond);
          if (nextSecond >= initialSeconds) {
            setIsRunning(false);
            setEndTimeVis(true);
          }
          return nextSecond;
        });
      }, 1000);
    } else if (seconds === initialSeconds) {
      setIsRunning(false);
    }

    return () => clearInterval(interval);
  }, [isRunning, seconds, onTimeChange, initialSeconds]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isBreakRunning && breakSeconds > 0) {
      interval = setInterval(() => {
        setBreakSeconds((prev) => {
          const nextSecond = prev - 1;
          if (nextSecond === 0) {
            setIsBreakRunning(false);
          }
          return nextSecond;
        });
      }, 1000);
    } else if (breakSeconds === 0) {
      setIsRunning(false);
      setBreakSeconds(teamBreaksSeconds); // Reset break time after it ends
    }

    return () => clearInterval(interval);
  }, [ isBreakRunning, breakSeconds ]);

  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleToggle = () => {
    setIsRunning(!isRunning); 
    if (isRunning) {
      setIsBreakRunning(false); 
      setBreakSeconds(teamBreaksSeconds)
    };
  };
  
  const handleReset = () => {
    setIsRunning(false);
    setSeconds(0);
  };
  const handleAddSecond = () => setSeconds((prev) => prev + 1);
  const handleSubtractSecond = () => setSeconds((prev) => (prev > 0 ? prev - 1 : 0));

  return (
    <>
      <div ref={sentinelRef} className="h-px w-full bg-transparent" />
      <div className={isStuck ? "sticky top-0 self-end right-0 z-50 flex flex-col items-center gap-4 p-6 border-1 border-gray-300 bg-white rounded-xl" : "flex flex-col items-center gap-4 p-6 border-1 border-gray-300 rounded-xl"}>
        <div className='text-xl font-mono'>Czas gry: <span className="font-bold">{formatTime(initialSeconds)}</span></div>
        <div className="text-6xl font-bold font-mono">{formatTime(seconds)}</div>
        
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
            <div className="flex items-center gap-1 mt-2 cursor-pointer" onClick={() => {setIsBreakRunning(true); setIsRunning(false);}}>
              <SiTvtime size={32} className="text-gray-600" />
              <div className="text-2xl font-bold font-mono">{formatTime(breakSeconds)}</div>
            </div>
          )}
        </div>}
      </div>
    </>
  );
};