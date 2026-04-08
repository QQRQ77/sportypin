import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/ui/submitButton";
import { useState } from "react";

const FormSchema = z.object({
  firstName: z.string().min(1, 'Imię jest wymagane'),
  lastName: z.string().optional(),
  startNumber: z.string().min(1, 'Numer startowy jest wymagany'),
});

type FormValues = z.infer<typeof FormSchema>;

export function AddEventTeamMember() {
  
  const form = useForm<FormValues>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
      },
    });

  const [buttonSubmitting, setButtonSubmitting] = useState(false);
  
  const handleSubmit: SubmitHandler<FormValues> =  async (data) => {
    setButtonSubmitting(true);
    
    setButtonSubmitting(false);
  }

  return (
    <Form {...form}>
      <form
        // onSubmit={form.handleSubmit(handleSubmit)}
        onSubmit={form.handleSubmit(handleSubmit, (errors) => console.log("Błędy walidacji:", errors))}
        className="space-y-6 w-full mx-auto my-4 p-4 rounded-xl shadow-2xl"
      >
        <h2 className="text-2xl font-bold text-sky-600 text-center">
          Dodaj uczestnika
        </h2>
            
        <div className="flex flex-col lg:flex-row gap-2">
          <FormField
              control={form.control}
              name="startNumber"
              render={({ field }) => (
                <FormItem className="w-32">
                  <FormLabel>Numer</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="np. 23 (opcjonalne)"
                      className="shadow-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="w-32">
                  <FormLabel>Imię</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="np. imię lub ksywka"
                      className="shadow-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="w-32">
                  <FormLabel>Nazwisko</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="np. Kowalski (opcjonalne)"
                      className="shadow-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

        <div className="w-full flex justify-center">
          <SubmitButton
            isSubmitting={buttonSubmitting}
            submittingText="Dodawanie..."
            baseText="Dodaj"
          />
        </div>
      </form>
    </Form>
  );
}