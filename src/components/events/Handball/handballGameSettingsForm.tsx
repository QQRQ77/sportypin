import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import SubmitButton from '@/components/ui/submitButton';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EventRulesType } from '@/types';
import { createId } from '@paralleldrive/cuid2';
import { saveEventRule } from '@/lib/events.actions';

const HandballGameSettingsSchema = z.object({
  periodMinutes: z.coerce
    .number({ invalid_type_error: 'Czas gry musi być liczbą' })
    .int()
    .nonnegative("Podaj liczbę większą od 0"),
  periods: z.coerce
    .number({ invalid_type_error: "Podaj liczbę od 1 do 10" })
    .int()
    .nonnegative("Podaj liczbę od 1 do 10")
    .max(10, "Maksymalnie 10 części gry"),
  breakMinutes: z.coerce
    .number({ invalid_type_error: "Podaj liczbę"})
    .int()
    .nonnegative("Podaj liczbę większą lub równą 0"),
  winPoints: z.coerce
    .number({ invalid_type_error: "Podaj liczbę"})
    .int()
    .nonnegative("Podaj liczbę większą lub równą 0"),
  drawPoints: z.coerce
    .number({ invalid_type_error: "Podaj liczbę"})
    .int()
    .nonnegative("Podaj liczbę większą lub równą 0"),
  lossPoints: z.coerce
    .number({ invalid_type_error: "Podaj liczbę"})
    .int()
    .nonnegative("Podaj liczbę większą lub równą 0"),
  penaltyTimeSeconds: z.coerce
    .number({ invalid_type_error: "Podaj liczbę sekund"})
    .int()
    .nonnegative("Podaj liczbę większą lub równą 0"),        
  draw_rules: z.string().optional(),
  penalties: z.array(
    z.string()
    .min(1, "Opis kary są jest zbyt krótki (minimum 1 znak).")
    .max(100, "Opis kary są zbyt długi (maksymalnie 100 znaków).")
  ).optional(),
  extraRules: z.array(
    z.string()
    .min(1, "Opis reguły są jest zbyt krótki (minimum 1 znak).")
    .max(100, "Opis reguły są zbyt długi (maksymalnie 100 znaków).")
  ).optional(),
  cathegory: z.string().or(z.literal("")).optional(),
  numOfTeamBreaks: z.coerce
    .number({ invalid_type_error: "Podaj liczbę"})
    .int()
    .nonnegative("Podaj liczbę większą lub równą 0"),
  teamBreaksSeconds: z.coerce
    .number({ invalid_type_error: "Podaj liczbę"})
    .int()
    .nonnegative("Podaj liczbę większą lub równą 0")
    .optional(),
  selectedPeriodForTeamBreak: z.string().or(z.literal("")).optional(),

});

export type HandballGameSettings = z.infer<typeof HandballGameSettingsSchema>;

interface HandballGameSettingsFormProps {
  eventId: string;
  cathegories?: string[];
  setEventRules: React.Dispatch<React.SetStateAction<EventRulesType[]>>;
  setCloseForm: React.Dispatch<React.SetStateAction<boolean>>;
  scrollToTop: () => void;
  rule?: EventRulesType
}

export default function HandballGameSettingsForm({eventId, cathegories, setEventRules, setCloseForm, scrollToTop, rule}: HandballGameSettingsFormProps) {

  const [buttonSubmitting, setButtonSubmitting] = useState(false);
  const [penaltyInput, setPenaltyInput] = useState("");
  const [extraRuleInput, setExtraRuleInput] = useState("");
  const [gameTimeActive, setGameTimeActive] = useState(true);  
  const [pointsActive, setPointsActive] = useState(true);
  const [penaltiesActive, setPenaltiesActive] = useState(true);
  const [teamBreakActive, setTeamBreakActive] = useState(true);
  const [extraRulesActive, setExtraRulesActive] = useState(true);

  const defaultValues: HandballGameSettings = {
    periodMinutes: rule?.periodMinutes || 15,
    periods: rule?.periods || 1,
    breakMinutes: rule?.breakMinutes || 0,
    winPoints: rule?.winPoints || 2,
    drawPoints: rule?.drawPoints || 1,
    lossPoints: rule?.lossPoints || 0,
    penaltyTimeSeconds: rule?.penaltyTimeSeconds || 120,
    draw_rules: rule?.draw_rules || "",
    penalties: rule?.penalties || [],
    extraRules: rule?.extraRules || [],
    cathegory: rule?.cathegory || "wszystkie",
    numOfTeamBreaks: rule?.numOfTeamBreaks || 1,
    teamBreaksSeconds: rule?.teamBreaksSeconds || 60,
    selectedPeriodForTeamBreak: rule?.selectedPeriodForTeamBreak || "mecz",
  };
  
  
  const form  = useForm<HandballGameSettings>({
    resolver: zodResolver(HandballGameSettingsSchema),
    defaultValues,
  });

  const numOfPeriod = form.watch("periods")
  const numOfBreaks = form.watch("numOfTeamBreaks")

  const onSubmit = async (data: HandballGameSettings) => {
    setButtonSubmitting(true);

    const isDataEmpty = !gameTimeActive && !pointsActive && !penaltiesActive && !extraRulesActive && !teamBreakActive && (data.penalties && data.penalties.length === 0) && (data.extraRules && data.extraRules.length === 0) 

    if (isDataEmpty) {
      scrollToTop();
      setCloseForm(false); 
      return
    }

    const newRule: EventRulesType = {
      id: rule?.id ? rule.id : createId(),
      periodMinutes: gameTimeActive ? data.periodMinutes : 0,
      periods: gameTimeActive ? data.periods : 0,
      breakMinutes: gameTimeActive ? data.breakMinutes : 0,
      winPoints: pointsActive ? data.winPoints : 0,
      drawPoints: pointsActive ? data.drawPoints : 0,
      lossPoints: pointsActive ? data.lossPoints : 0,
      penaltyTimeSeconds: penaltiesActive ? data.penaltyTimeSeconds : 0,
      draw_rules: pointsActive ? data.draw_rules : "",
      penalties: penaltiesActive ? data.penalties : [],
      extraRules: extraRulesActive ? data.extraRules : [],
      cathegory: data.cathegory,
      numOfTeamBreaks: teamBreakActive ? data.numOfTeamBreaks : 0,
      teamBreaksSeconds: teamBreakActive ? data.teamBreaksSeconds : 0,
      selectedPeriodForTeamBreak: teamBreakActive ? data.selectedPeriodForTeamBreak : "",
      saveAction: rule?.id ? "update" : "create"
    };

    const result = await saveEventRule(eventId, newRule);
    
    if (result === "success") {
      setEventRules(prevRules => {
        if (rule?.saveAction === "update") {
          return prevRules.map(r => r.id === rule.id ? newRule : r);
        } else {  return [...prevRules, newRule];}}
      );
      scrollToTop();
      setButtonSubmitting(false);
      setCloseForm(false);    
    }
  }

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full p-4 rounded-lg shadow-lg bg-gray-100 border-1 border-gray-200">
          <div className="text-lg w-full text-center font-bold mb-4">Dodaj zasady gry:</div>
          <FormField
              control={form.control}
              name="cathegory"
              render={({ field }) => (
                <FormItem className="flex gap-4 items-center">
                  <FormLabel className='text-lg font-normal'>Zasady dla kategorii:</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="shadow-xl">
                        <SelectValue placeholder="Wybierz kategorię" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cathegories && ["wszystkie", ...cathegories].map((opt, idx) => (
                        <SelectItem key={idx} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
        
          <div className={`flex items-center gap-4 ${gameTimeActive ? "" : "opacity-50"}`}>
            <h2 className="text-lg">Podział czasu gry:</h2>
            <FormField
              control={form.control}
              name="periods"             
              render={({ field }) => (
                <FormItem className="w-16">
                  <FormControl>
                    <Input
                      disabled={!gameTimeActive}
                      type="number"
                      className="shadow-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
              </FormItem>
            )}
            />
            <p>{numOfPeriod == 1 ? 'część' : ''}{numOfPeriod == 2 ? 'połowy' : ''}{numOfPeriod == 3 ? 'tercje' : ''}{numOfPeriod == 4 ? 'kwarty' : ''}{numOfPeriod > 4 ? 'części' : ''}</p>
            <p>x</p>
            <FormField
              control={form.control}
              name="periodMinutes"
              render={({ field }) => (
                <FormItem className="w-16">
                  <FormControl>
                    <Input
                      disabled={!gameTimeActive}
                      type="number"
                      className="shadow-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
              </FormItem>
            )}
            />
            <p>min.</p>

            {numOfPeriod > 1 && 
              <>
                <p>przerwa:</p>
                <FormField
                  control={form.control}
                  name="breakMinutes"
                  render={({ field }) => (
                    <FormItem className="w-16">
                      <FormControl>
                        <Input
                          disabled={!gameTimeActive}
                          type="number"
                          className="shadow-xl"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <p>min.</p>
              </>}
              <Switch
                className="data-[state=checked]:bg-emerald-300 data-[state=unchecked]:bg-slate-600 [&>span]:data-[state=checked]:bg-emerald-700"
                aria-label="Aktywuj/Dezaktywuj podział czasu gry"
                checked={gameTimeActive}
                onCheckedChange={setGameTimeActive}
              />
          </div>

        <div className={`flex flex-col items-left gap-4 mt-4 ${pointsActive ? "" : "opacity-50"}`}>
          <div className={`flex items-center gap-4`}>
            <h2 className="text-lg">Punktacja:</h2>
            <Switch
              className="data-[state=checked]:bg-emerald-300 data-[state=unchecked]:bg-slate-600 [&>span]:data-[state=checked]:bg-emerald-700"
              aria-label="Aktywuj/Dezaktywuj punktację"
              checked={pointsActive}
              onCheckedChange={setPointsActive}
            />
          </div>
          <div className="flex flex-col items-left gap-4 ml-8">
            <div className="flex items-center gap-4">
              <p>wygrana:</p>
              <FormField
              control={form.control}
              name="winPoints"
              render={({ field }) => (
                <FormItem className="w-16">
                  <FormControl>
                    <Input
                      disabled={!pointsActive}
                      type="number"
                      className="shadow-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                )}
              />
              <p>pkt</p>
            </div>
            <div className="flex items-center gap-4">
              <p>remis:</p>
              <FormField
              control={form.control}
              name="drawPoints"
              render={({ field }) => (
                <FormItem className="w-16">
                  <FormControl>
                    <Input
                      disabled={!pointsActive}
                      type="number"
                      className="shadow-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                )}
              />
              <p>pkt</p>
            </div> 
            <FormField
                control={form.control}
                name="draw_rules"
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <Input
                                disabled={!pointsActive}
                                placeholder="Wpisz regułę dla remisu (opcja)." {...field} />
                        </FormControl>
                        <FormDescription>
                            Podaj opcjonalną regułę rozstrzygającą mecz w przypadku remisu.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                  )}
            />
            <div className="flex items-center gap-4">
              <p>przegrana:</p>
              <FormField
              control={form.control}
              name="lossPoints"
              render={({ field }) => (
                <FormItem className="w-16">
                  <FormControl>
                    <Input
                      disabled={!pointsActive}
                      type="number"
                      className="shadow-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                )}
              />
              <p>pkt</p>
            </div>   
          </div>
        </div>

        <div className={`flex flex-col items-left gap-4 mt-4 ${!teamBreakActive ? 'opacity-50' : ''}`}>
          <div className={`flex items-center gap-4`}>
            <h2 className="text-lg">Kary:</h2>
            <Switch
              className="data-[state=checked]:bg-emerald-300 data-[state=unchecked]:bg-slate-600 [&>span]:data-[state=checked]:bg-emerald-700"
              aria-label="Aktywuj/Dezaktywuj kary"
              checked={penaltiesActive}
              onCheckedChange={setPenaltiesActive}
            />
          </div>
          <div className="flex flex-col items-left gap-4 ml-8">
            <div className="flex items-center gap-4">
              <p>Wykluczenie czasowe:</p>
              <FormField
                control={form.control}
                name="penaltyTimeSeconds"
                render={({ field }) => (
                  <FormItem className="w-16">
                    <FormControl>
                      <Input
                        disabled={!penaltiesActive} 
                        type="number"
                        className="shadow-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
              />
              <p>sekund</p>
            </div>
            <FormField
              control={form.control}
              name="penalties"
              render={({ field }) => {
                const penalties = field.value || [];

                const addPenalty = () => {
                  const trimmed = penaltyInput.trim();
                  if (trimmed.length >= 3 && !penalties.includes(trimmed)) {
                    field.onChange([...penalties, trimmed]);
                    setPenaltyInput("");
                  }
                };

                const removePenalty = (penaltyToRemove: string) => {
                  field.onChange(penalties.filter((sport: string) => sport !== penaltyToRemove));
                };

                return (
                  <FormItem>
                    <FormDescription className="text-black">
                      Dodaj jedną lub więcej obowiązujących kar.
                    </FormDescription>
                    <FormControl>
                      <div>
                        <div className="flex gap-2 mb-2">
                          <Input
                            disabled={!penaltiesActive}
                            value={penaltyInput}
                            onChange={e => setPenaltyInput(e.target.value)}
                            placeholder="np. czerwona kartka - wykluczenie z meczu"
                            onKeyDown={e => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addPenalty();
                              }
                            }}
                          />
                          <Button type="button" onClick={addPenalty} disabled={penaltyInput.trim().length < 3}>
                            Dodaj
                          </Button>
                        </div>
                        <div className="flex flex-col gap-2">
                          {penalties.map((penalty: string, idx: number) => (
                            <span key={idx} className="">
                              {penalty}
                              <button
                                type="button"
                                className="ml-1 text-red-500 hover:text-red-700"
                                onClick={() => removePenalty(penalty)}
                                aria-label={`Usuń karę`}
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />  
          </div>
        </div>

        <div className={`flex items-center gap-4 ${!teamBreakActive ? 'opacity-50' : ''}`}>
            <h2 className="text-lg">Czas dla drużyny (przerwa w grze):</h2>
            <FormField
              control={form.control}
              name="numOfTeamBreaks"
              render={({ field }) => (
                <FormItem className="w-16">
                  <FormControl>
                    <Input
                      disabled={!teamBreakActive}
                      type="number"
                      className="shadow-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
              </FormItem>
            )}
            />
            {numOfBreaks > 0 &&
              <>
                <p>na</p>
                <FormField
                  control={form.control}
                  name="selectedPeriodForTeamBreak"
                  render={({ field }) => (
                    <FormItem className="flex gap-4 items-center">
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!teamBreakActive}>
                        <FormControl>
                          <SelectTrigger className="shadow-xl">
                            <SelectValue placeholder="Wybierz kategorię" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {["mecz", "połowę", "tercję", "kwartę", "część"].map((opt, idx) => (
                            <SelectItem key={idx} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <p> x </p>
                <FormField
                  control={form.control}
                  name="teamBreaksSeconds"
                  render={({ field }) => (
                    <FormItem className="w-16">
                      <FormControl>
                        <Input
                          disabled={!teamBreakActive}
                          type="number"
                          className="shadow-xl"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <p>sek.</p>
              </>}
              <Switch
                className="data-[state=checked]:bg-emerald-300 data-[state=unchecked]:bg-slate-600 [&>span]:data-[state=checked]:bg-emerald-700"
                aria-label="Aktywuj/Dezaktywuj czas dla drużyny"
                checked={teamBreakActive}
                onCheckedChange={setTeamBreakActive}
              />
          </div>

        <div className={`flex flex-col items-left gap-4 mt-4 ${!extraRulesActive ? 'opacity-50' : ''}`}>
          <div className={`flex items-center gap-4`}>
            <h2 className="text-lg">Dodatkowe zasady:</h2>
            <Switch
              className="data-[state=checked]:bg-emerald-300 data-[state=unchecked]:bg-slate-600 [&>span]:data-[state=checked]:bg-emerald-700"
              aria-label="Aktywuj/Dezaktywuj dodatkowe zasady"
              checked={extraRulesActive}
              onCheckedChange={setExtraRulesActive}
            />
          </div>
          <div className="flex flex-col items-left gap-4 ml-8">
            <FormField
              control={form.control}
              name="extraRules"
              render={({ field }) => {
                const extraRules = field.value || [];

                const addExtraRule = () => {
                  const trimmed = extraRuleInput.trim();
                  if (trimmed.length >= 3 && !extraRules.includes(trimmed)) {
                    field.onChange([...extraRules, trimmed]);
                    setExtraRuleInput("");
                  }
                };

                const removeExtraRule = (ruleToRemove: string) => {
                  field.onChange(extraRules.filter((rule: string) => rule !== ruleToRemove));
                };

                return (
                  <FormItem>
                    <FormDescription className="text-black">
                      Dodaj jedną lub więcej obowiązujących zasad.
                    </FormDescription>
                    <FormControl>
                      <div>
                        <div className="flex gap-2 mb-2">
                          <Input
                            disabled={!extraRulesActive}
                            value={extraRuleInput}
                            onChange={e => setExtraRuleInput(e.target.value)}
                            placeholder="np. Mecz rozgrywany jest na boisku o wymiarach 40x20 metrów"
                            onKeyDown={e => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addExtraRule();
                              }
                            }}
                          />
                          <Button type="button" onClick={addExtraRule} disabled={extraRuleInput.trim().length < 3}>
                            Dodaj
                          </Button>
                        </div>
                        <div className="flex flex-col gap-2">
                          {extraRules.map((rule: string, idx: number) => (
                            <span key={idx} className="">
                              {rule}
                              <button
                                type="button"
                                className="ml-1 text-red-500 hover:text-red-700"
                                onClick={() => removeExtraRule(rule)}
                                aria-label={`Usuń zasadę`}
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />  
          </div>
        </div>

        <div className="w-full flex justify-center mt-10">
          <SubmitButton
            isSubmitting={buttonSubmitting}
            submittingText="Zapisywanie..."
            baseText="Zapisz"
          />
        </div>

      </form>
    </Form>
    
  );
}


