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
    <section>
      <JSONviewer data={gameTransmissionItems} />
    </section>
  );
};

export default HandballGameTransmission;
