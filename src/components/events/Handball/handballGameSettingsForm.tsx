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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

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
  draw_rules: z.string().optional(),
});

export type HandballGameSettings = z.infer<typeof HandballGameSettingsSchema>;

const defaultValues: HandballGameSettings = {
  periodMinutes: 15,
  periods: 1,
  breakMinutes: 0,
  winPoints: 2,
  drawPoints: 1,
  lossPoints: 0,
  draw_rules: "",
};

interface HandballGameSettingsFormProps {
  eventId: string;
}

export default function HandballGameSettingsForm({eventId}: HandballGameSettingsFormProps) {

  const [buttonSubmitting, setButtonSubmitting] = useState(false);

  const form  = useForm<HandballGameSettings>({
    resolver: zodResolver(HandballGameSettingsSchema),
    defaultValues,
  });

  const numOfPeriod = form.watch("periods")
  const drawPoint = form.watch("drawPoints")

  const onSubmit = async (data: HandballGameSettings) => {
    setButtonSubmitting(true);
    console.log('Submitting handball game settings:', data);
    console.log("Event ID:", eventId);
    setButtonSubmitting(false);
  }

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
        
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
            {drawPoint == 0 && 
              <FormField
                  control={form.control}
                  name="draw_rules"
                  render={({ field }) => (
                      <FormItem>
                          <FormControl>
                              <Input placeholder="Wpisz regułę rozczygającą mecz" {...field} />
                          </FormControl>
                          <FormDescription>
                              W przypadku braku możliwości remisu (0 pkt.), podaj regułę rozczygającą mecz.
                          </FormDescription>
                          <FormMessage />
                      </FormItem>
                    )}
              />} 
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
