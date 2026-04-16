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
    <div className="flex flex-col items-center gap-4 p-6">
      <div className="text-6xl font-bold font-mono">{formatTime(seconds)}</div>
      
      <div className="flex gap-2">
        <button
          onClick={handleToggle}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Reset
        </button>
        
        <button
          onClick={handleAddSecond}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          +1s
        </button>
        
        <button
          onClick={handleSubtractSecond}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          -1s
        </button>
      </div>
    </div>
  );
};