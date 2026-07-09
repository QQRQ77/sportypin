import React, { useState } from 'react';
import { EventRulesType } from '@/types';
import { Button } from '../ui/button';
import HandballGameSettingsForm from './Handball/handballGameSettingsForm';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Form } from "@/components/ui/form";
import { deleteEventRule, fetchEventRules } from '@/lib/events.actions';

interface EventRulesProps {
  rule: EventRulesType;
  eventId: string;
  cathegories?: string[];
  setEventRules: React.Dispatch<React.SetStateAction<EventRulesType[]>>;
  scrollToTop: () => void;
}

type FormValues = Record<string, unknown>;

const EventRule: React.FC<EventRulesProps> = ({ rule, eventId, cathegories, setEventRules, scrollToTop }) => {
  
  const [openEventRuleForm, setOpenEventRuleForm] = useState(false)

  const form = useForm<FormValues>();
  
  const handleSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log(data);
    await deleteEventRule(eventId, rule.id);
    const updatedRules = await fetchEventRules(eventId);
    setEventRules(updatedRules);
    scrollToTop();
  }
  
return (
  <>
    {!openEventRuleForm ? 
    <>
      <div className='flex w-full justify-between items-center'>
        {(rule.cathegory && rule.cathegory !== "wszystkie") ? <h1 className="text-lg mb-4 font-normal">Zasady dla kategorii <span className="font-bold">{rule.cathegory}</span>:</h1> : <h1 className="text-lg mb-4 font-normal">Zasady wspólne dla <span className="font-bold">wszystkich</span> kategorii:</h1>}
        <div className='flex gap-4'>
          <Button className="cursor-pointer" onClick={()=> {setOpenEventRuleForm(!openEventRuleForm)}}>Edytuj</Button>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <Button type="submit" className="cursor-pointer">Usuń</Button>
            </form>
          </Form>
        </div>
      </div>
      {rule.periods != 0 && <h2 className="text-lg">Czas gry: <span className="font-bold">{rule.periods} </span><span>{rule.periods == 1 ? 'część' : ''}{rule.periods == 2 ? 'połowy' : ''}{rule.periods == 3 ? 'tercje' : ''}{rule.periods == 4 ? 'kwarty' : ''}{rule.periods && rule.periods > 4 ? 'części' : ''}</span>
      {" "}x <span className="font-bold">{rule.periodMinutes} min. </span>{rule.periods && rule.periods > 1 && <>{"- przerwa: "}<span className="font-bold">{rule.breakMinutes || 10} min.</span></>}</h2>}
      {!(rule.winPoints === 0 && rule.drawPoints === 0 && rule.lossPoints === 0) && 
        <h2 className="text-lg">Punktacja: <span className="font-bold">{rule.winPoints} pkt.</span> za zwycięstwo, <span className="font-bold">{rule.drawPoints} pkt.</span> za remis, <span className="font-bold">{rule.lossPoints} pkt.</span> za porażkę</h2>}
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
        {rule.numOfTeamBreaks != 0 && <h2 className="text-lg">Czas dla drużyny (przerwa w grze): <span className="font-bold">{rule.numOfTeamBreaks}</span>{(rule.numOfTeamBreaks && rule.numOfTeamBreaks > 0) ? <> na <span className="font-bold">{rule.selectedPeriodForTeamBreak}</span> x <span className="font-bold">{rule.teamBreaksSeconds}</span> sek.</> : ""}</h2>}
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
    </> : 
    <HandballGameSettingsForm
      eventId={eventId} 
      cathegories={cathegories} 
      setEventRules={setEventRules}
      setCloseForm={setOpenEventRuleForm}
      scrollToTop={scrollToTop}
      rule={rule}          
    />}
  </>
)}

export default EventRule;