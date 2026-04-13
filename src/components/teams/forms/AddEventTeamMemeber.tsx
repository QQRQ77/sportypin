import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createId } from "@paralleldrive/cuid2";

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
import { sanitizeStrings } from "@/lib/utils";
import { Participant } from "@/types";
import { saveNewParticipant } from "@/lib/events.actions";
import ComboInputTeamMember from "../ComboInputTeamMember";

const FormSchema = z.object({
  firstName: z.string().min(1, 'Imię jest wymagane'),
  lastName: z.string().optional(),
  startNumber: z.string().min(1, 'Numer startowy jest wymagany'),
});

type FormValues = z.infer<typeof FormSchema>;

interface Props {
    eventId: string;
    participant?: Participant;
    participants?: Participant[];
    setItems: React.Dispatch<React.SetStateAction<Participant[]>>;
  }

export function AddEventTeamMember({participant, participants = [], setItems, eventId}: Props) {
  
  const form = useForm<FormValues>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
      },
    });

  const [buttonSubmitting, setButtonSubmitting] = useState(false);
  
  const handleSubmit: SubmitHandler<FormValues> =  async (data) => {
    setButtonSubmitting(true);

    const memberData = {
      id: createId(),
      athlete_id: "",
      first_name: data.firstName,
      second_name: data.lastName,
      start_number: data.startNumber,
    };

    const cleanedData = sanitizeStrings(memberData);

    const newParticipants = participants.map((ci) =>
      ci.id === participant?.id ? {...participant, eventTeamMembers: [...(participant?.eventTeamMembers || []), cleanedData] } : ci
    );

    setItems(newParticipants);

    await saveNewParticipant(eventId, newParticipants);

    form.reset({
      firstName: "",
      lastName: "",
      startNumber: "",
    });
        
    setButtonSubmitting(false);
  }

  return (
    <Form {...form}>
      <form
        // onSubmit={form.handleSubmit(handleSubmit)}
        onSubmit={form.handleSubmit(handleSubmit, (errors) => console.log("Błędy walidacji:", errors))}
        className="space-y-6 w-full mx-auto my-4 p-4 rounded-xl shadow-2xl"
      >
        <div className="flex flex-col lg:flex-row gap-2">
          <FormField
              control={form.control}
              name="startNumber"
              render={({ field }) => (
                <FormItem className="w-16">
                  <FormLabel>Numer</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="np. 23"
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

            <ComboInputTeamMember
              control={form.control}
              name="firstName"
              label="Wybierz/dodaj zespół"
              placeholder="Wpisz imię…"
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="w-60">
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
            baseText="Dodaj zawodnika"
          />
        </div>
      </form>
    </Form>
  );
}