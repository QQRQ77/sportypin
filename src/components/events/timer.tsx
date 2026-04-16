'use client'

import { ArrowPathRoundedSquareIcon, PauseIcon, PlayIcon } from '@heroicons/react/20/solid';
import React, { useState, useEffect } from 'react';

interface TimerProps {
  initialSeconds?: number;
}

export const Timer: React.FC<TimerProps> = ({ initialSeconds = 300 }) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (seconds === 0) {
      setIsRunning(false);
    }

    return () => clearInterval(interval);
  }, [isRunning, seconds]);

  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleToggle = () => setIsRunning(!isRunning);
  const handleReset = () => {
    setIsRunning(false);
    setSeconds(initialSeconds);
  };
  const handleAddSecond = () => setSeconds((prev) => prev + 1);
  const handleSubtractSecond = () => setSeconds((prev) => (prev > 0 ? prev - 1 : 0));

  return (
    <div className="flex flex-col items-center gap-4 p-6 border-1 border-gray-300 rounded-xl">
      <div className="text-6xl font-bold font-mono">{formatTime(seconds)}</div>
      
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
        <ArrowPathRoundedSquareIcon onClick={handleReset} className="h-10 w-10 cursor-pointer"/>
      </div>
    </div>
  );
};