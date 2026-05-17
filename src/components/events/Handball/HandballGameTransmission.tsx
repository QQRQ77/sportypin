import JSONviewer from '@/components/utils/JSONviewer';
import { GameTransmissionItem } from '@/types';
import React from 'react';

interface HandballGameTransmissionProps {
  gameTransmissionItems?: GameTransmissionItem[];
}

const HandballGameTransmission: React.FC<HandballGameTransmissionProps> = ({
  gameTransmissionItems,
}) => {
  return (
    <section className='flex flex-col border rounded-md bg-white shadow-md'>
      <div className='flex flex-col flex-2'></div>
      <div className='bg-orange-600 text-white text-xl p-2 rounded-full border-2 border-white'>Start meczu</div>
      <JSONviewer data={gameTransmissionItems} />
    </section>
  );
};

export default HandballGameTransmission;
