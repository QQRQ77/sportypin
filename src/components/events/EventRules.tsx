import React from 'react';
import { EventRulesType } from '@/types';
import EventRule from './EventRule';
interface EventRulesProps {
  rules: EventRulesType[];
  eventId: string;
  cathegories?: string[];
  setEventRules: React.Dispatch<React.SetStateAction<EventRulesType[]>>;
  scrollToTop: () => void;
}

const EventRules: React.FC<EventRulesProps> = ({ rules, eventId, cathegories, setEventRules, scrollToTop }) => {
  
  return (
    <section>
      <div className="w-full mb-2 flex flex-col justify-center items-right">
        {rules.map((rule, index) => (
          <div key={index} className={`mb-6 ${index < rules.length - 1 ? 'border-b border-gray-300' : ''} pb-4`}>
            <EventRule 
              rule={rule}
              eventId={eventId}
              cathegories={cathegories} 
              setEventRules={setEventRules}
              scrollToTop={scrollToTop}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default EventRules;
