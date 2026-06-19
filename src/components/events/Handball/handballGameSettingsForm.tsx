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
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const HandballGameSettingsSchema = z.object({
  periodMinutes: z
    .number({ invalid_type_error: 'Czas gry musi być liczbą' })
    .int()
    .positive(),
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
});

export type HandballGameSettings = z.infer<typeof HandballGameSettingsSchema>;

const defaultValues: HandballGameSettings = {
  periodMinutes: 15,
  periods: 1,
  breakMinutes: 0,
  winPoints: 2,
  drawPoints: 1,
  lossPoints: 0,
  penaltyTimeSeconds: 120,
  draw_rules: "",
  penalties: [],
  extraRules: [],
  cathegory: "wszystkie",
};

interface HandballGameSettingsFormProps {
  eventId: string;
  cathegories?: string[];
}

export default function HandballGameSettingsForm({eventId, cathegories}: HandballGameSettingsFormProps) {

  const [buttonSubmitting, setButtonSubmitting] = useState(false);
  const [penaltyInput, setPenaltyInput] = useState("");
  const [extraRuleInput, setExtraRuleInput] = useState("");  

  const form  = useForm<HandballGameSettings>({
    resolver: zodResolver(HandballGameSettingsSchema),
    defaultValues,
  });

  const numOfPeriod = form.watch("periods")

  const onSubmit = async (data: HandballGameSettings) => {
    setButtonSubmitting(true);
    console.log('Submitting handball game settings:', data);
    console.log("Event ID:", eventId);
    setButtonSubmitting(false);
  }

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>

          <FormField
              control={form.control}
              name="cathegory"
              render={({ field }) => (
                <FormItem className="flex gap-4 items-center">
                  <FormLabel className='text-lg'>Zasady dla kategorii:</FormLabel>
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
        
          <div className="flex items-center gap-4">
            <h2 className="text-lg">Podział czasu gry:</h2>
            <FormField
              control={form.control}
              name="periods"
              render={({ field }) => (
                <FormItem className="w-16">
                  <FormControl>
                    <Input
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
                      type="number"
                      className="shadow-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
              </FormItem>
            )}
            />
            <p>min.,</p>
            <p>przerwa:</p>
            <FormField
              control={form.control}
              name="breakMinutes"
              render={({ field }) => (
                <FormItem className="w-16">
                  <FormControl>
                    <Input
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
          </div>

        <div className="flex flex-col items-left gap-4 mt-4">
          <h2 className="text-lg">Punktacja:</h2>
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
                            <Input placeholder="Wpisz regułę dla remisu (opcja)." {...field} />
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

        <div className="flex flex-col items-left gap-4 mt-4">
          <h2 className="text-lg">Kary:</h2>
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

        <div className="flex flex-col items-left gap-4 mt-4">
          <h2 className="text-lg">Dodatkowe zasady:</h2>
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
                    <FormDescription>
                      Dodaj jedną lub więcej obowiązujących zasad.
                    </FormDescription>
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
        {form.formState.isDirty && <span>Unsaved changes</span>}
      </form>
    </Form>
    
  );
}
