import React from 'react';
import { Form, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Schema for handball game settings
const HandballGameSettingsSchema = z.object({
  periodMinutes: z
    .number({ invalid_type_error: 'Period minutes must be a number' })
    .int()
    .positive()
    .max(60, 'Too long'),
  periods: z.number().int().positive().max(10),
  halftimeMinutes: z.number().int().nonnegative().max(30),
});

export type HandballGameSettings = z.infer<typeof HandballGameSettingsSchema>;

const defaultValues: HandballGameSettings = {
  periodMinutes: 30,
  periods: 2,
  halftimeMinutes: 10,
};

interface HandballGameSettingsFormProps {
  eventId: string;
}

export default function HandballGameSettingsForm({eventId}: HandballGameSettingsFormProps) {

  const form  = useForm<HandballGameSettings>({
    resolver: zodResolver(HandballGameSettingsSchema),
    defaultValues,
    mode: 'onBlur',
  });

  const onSubmit = async (data: HandballGameSettings) => {
    console.log('Submitting handball game settings:', data);
    console.log("Event ID:", eventId);
  }

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        
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

        <button type="submit" disabled={form.formState.isSubmitting}>
          Save
        </button>
        {form.formState.isDirty && <span>Unsaved changes</span>}
      </form>
    </Form>
    
  );
}
