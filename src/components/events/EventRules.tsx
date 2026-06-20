import React from 'react';
import { EventRulesType } from '@/types';
interface EventRulesProps {
  rules: EventRulesType[];
}

const EventRules: React.FC<EventRulesProps> = ({ rules }) => {
  
  return (
    <section>
      <div className="w-full mb-2 flex flex-col justify-center items-right">
        {rules.map((rule, index) => (
          <div key={index} className="mb-6 border-b border-gray-300 pb-4">
            {(rule.cathegory && rule.cathegory !== "wszystkie") ? <h1 className="text-lg mb-4 font-normal">Zasady dla kategorii: <span className="font-bold">{rule.cathegory}</span></h1> : <h1 className="text-lg mb-4 font-normal">Zasady wspólne dla <span className="font-bold">wszystkich</span> kategorii</h1>}
            <h2 className="text-lg">Czas gry: <span className="font-bold">{rule.periods || 2} </span><span>{rule.periods == 1 ? 'część' : ''}{rule.periods == 2 ? 'połowy' : ''}{rule.periods == 3 ? 'tercje' : ''}{rule.periods == 4 ? 'kwarty' : ''}{rule.periods && rule.periods > 4 ? 'części' : ''}</span>
            {" "}x <span className="font-bold">{rule.periodMinutes} min. </span>{rule.periods && rule.periods > 1 && <>{"- przerwa: "}<span className="font-bold">{rule.breakMinutes || 10} min.</span></>}</h2>
            <h2 className="text-lg">Punktacja: <span className="font-bold">{rule.winPoints || 3} pkt.</span> za zwycięstwo, <span className="font-bold">{rule.drawPoints || 1} pkt.</span> za remis, <span className="font-bold">{rule.lossPoints || 0} pkt.</span> za porażkę</h2>
            <h2 className="text-lg">{rule.draw_rules || ""}</h2>
            {((rule.penaltyTimeSeconds && rule.penaltyTimeSeconds > 0) || (rule.penalties && rule.penalties.length > 0)) && <>
              <h2 className="text-lg">Kary: </h2>
              <div className="w-full ml-10 gap-2 flex flex-col justify-center items-left">
                {rule.penaltyTimeSeconds && (
                  <div><span className="text-lg">wykluczenie czasowe</span> - <span className="font-bold">{rule.penaltyTimeSeconds ? (rule.penaltyTimeSeconds / 60).toFixed(0) : 2} min.</span>,</div>
                )}
                {rule.penalties && 
                  rule.penalties.map((penalty, index) => (
                    <div key={index}><span className="text-lg">{penalty}</span></div>
                  ))
                }
              </div>
            </>}
            <>
              <h2 className="text-lg">Czas dla drużyny (przerwa w grze): <span className="font-bold">{rule.numOfTeamBreaks || 0}</span>{(rule.numOfTeamBreaks && rule.numOfTeamBreaks > 0) ? <> na <span className="font-bold">{rule.selectedPeriodForTeamBreak}</span> x <span className="font-bold">{rule.teamBreaksSeconds}</span> sek.</> : ""}</h2>
            </>
            {rule.extraRules && rule.extraRules.length > 0 && <>
              <h2 className="text-lg">Dodatkowe zasady:</h2>
              <div className="w-full ml-10 gap-2 flex flex-col justify-center items-left">
                {rule.extraRules && 
                  rule.extraRules.map((rule, index) => (
                    <div key={index}><span className="text-lg">{rule}</span></div>
                  ))
                }
              </div>
            </>}
          </div>
        ))}
      </div>
    </section>
  );
};

export default EventRules;
