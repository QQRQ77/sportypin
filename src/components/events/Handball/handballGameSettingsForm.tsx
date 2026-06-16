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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Schema for handball game settings
const HandballGameSettingsSchema = z.object({
  periodMinutes: z
    .number({ invalid_type_error: 'Czas gry musi być liczbą' })
    .int()
    .positive(),
  periods: z.number().int().positive().max(10),
  halftimeMinutes: z.number().int().nonnegative().max(30),
});

export type HandballGameSettings = z.infer<typeof HandballGameSettingsSchema>;

const defaultValues: HandballGameSettings = {
  periodMinutes: 15,
  periods: 1,
  halftimeMinutes: 0,
};

interface HandballGameSettingsFormProps {
  eventId: string;
}

export default function HandballGameSettingsForm({eventId}: HandballGameSettingsFormProps) {

  const [buttonSubmitting, setButtonSubmitting] = useState(false);

  const form  = useForm<HandballGameSettings>({
    resolver: zodResolver(HandballGameSettingsSchema),
    defaultValues,
    mode: 'onBlur',
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
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        
          <div className="flex gap-4">
            <h2 className="text-lg">Podział czasu gry:</h2>
            <FormField
              control={form.control}
              name="periods"
              render={({ field }) => (
                <FormItem className="w-32">
                  <FormControl>
                    <Input
                      placeholder="np. 1 część, 2 połowy"
                      className="shadow-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
              </FormItem>
            )}
            />
            <p>{numOfPeriod === 1 ? 'część' : ''}{numOfPeriod === 2 ? 'połowy' : ''}{numOfPeriod === 3 ? 'tercje' : ''}{numOfPeriod === 4 ? 'kwarty' : ''}{numOfPeriod > 4 ? 'części' : ''}</p>
          </div>
        

        <div>
          <label>Period Minutes</label>
          <input type="number" {...form.register('periodMinutes', { valueAsNumber: true })} />
          {form.formState.errors.periodMinutes && <span>{String(form.formState.errors.periodMinutes.message)}</span>}
        </div>

        <div>
          <label>Periods</label>
          <input type="number" {...form.register('periods', { valueAsNumber: true })} />
          {form.formState.errors.periods && <span>{String(form.formState.errors.periods.message)}</span>}
        </div>

        <div>
          <label>Halftime Minutes</label>
          <input type="number" {...form.register('halftimeMinutes', { valueAsNumber: true })} />
          {form.formState.errors.halftimeMinutes && <span>{String(form.formState.errors.halftimeMinutes.message)}</span>}
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
