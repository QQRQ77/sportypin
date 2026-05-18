import { GameTransmissionItem } from '@/types';
import React from 'react';
import TransmissionSingleItem from './TransmissionSingleItem';

interface HandballGameTransmissionProps {
  gameTransmissionItems?: GameTransmissionItem[];
}

const HandballGameTransmission: React.FC<HandballGameTransmissionProps> = ({
  gameTransmissionItems,
}) => {

  return (
    <section className='w-full flex flex-col items-center justify-center'>
      <div className='w-full flex flex-col'>
        {gameTransmissionItems && gameTransmissionItems.length > 0 ? (
          gameTransmissionItems.slice().reverse().map((item) => (
            <TransmissionSingleItem key={item.id} transmissionItem={item} />
          ))
        ) : (
          <div className='text-gray-500'>Brak transmisji</div>
        )}
      </div>
      <div className='bg-orange-600 text-white text-xl p-2 rounded-full border-2 border-orange-900'>Start meczu</div>
    </section>
  );
};

export default HandballGameTransmission;
