import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import SubmitButton from '@/components/ui/submitButton';
import {
  Form,
  FormControl,
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
  halftimeMinutes: z.coerce
      .number({ invalid_type_error: "Podaj liczbę"})
      .int()
      .nonnegative("Podaj liczbę większą lub równą 0")
});

export type HandballGameSettings = z.infer<typeof HandballGameSettingsSchema>;

const defaultValues: HandballGameSettings = {
  periodMinutes: 15,
  periods: 1,
  breakMinutes: 0,
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
            <p>minut,</p>
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
            <p>minut</p>
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
