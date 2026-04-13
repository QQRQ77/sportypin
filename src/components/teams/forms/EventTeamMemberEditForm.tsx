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
import { Participant, EventTeamMemberType } from "@/types";
import { sanitizeStrings } from "@/lib/utils";
import { saveNewParticipant } from "@/lib/events.actions";

const FormSchema = z.object({
  name: z.string().min(1, 'Imię/ksywka/nazwisko jest wymagane'),
  startNumber: z.string().min(1, 'Numer startowy jest wymagany'),
});

type FormValues = z.infer<typeof FormSchema>;

interface Props {
    eventId: string;
    member: EventTeamMemberType;
    participant: Participant;
    participants: Participant[];
    onClose?: (show: boolean) => void;
    setItems: React.Dispatch<React.SetStateAction<Participant[]>>;
  }

export function EventTeamMemberEditForm({member, participants, participant, eventId, onClose = () => {}, setItems}: Props) {
  
  const form = useForm<FormValues>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
        name: member.name,
        startNumber: String(member.start_number || ""),
      },
    });

  const [buttonSubmitting, setButtonSubmitting] = useState(false);
  
  const handleSubmit: SubmitHandler<FormValues> =  async (data) => {
    setButtonSubmitting(true);

    const cleanData = sanitizeStrings(data);

    if (member) {
      const unchangedFields = (member.name === cleanData.name) && (String(member.start_number) === cleanData.startNumber);

      if (unchangedFields) {
        onClose(false);
        setButtonSubmitting(false);
        return;
      }
    }

    const submissionData = {
      ...member,
      //TODO: w przypadku zmiany na zawodnika wybranego z bazy danych, trzeba będzie dodać nowe athlete_id do submissionData
      name: cleanData.name,
      start_number: cleanData.startNumber,
    };

        const newParticipants = participants.map((ci) =>
              ci.id === participant.id ? 
                {...participant, eventTeamMembers: participant.eventTeamMembers?.map((tm) =>
                  tm.id === member.id ? submissionData : tm
                ) || []} 
                : ci
            );
    
        setItems(newParticipants);
    
        await saveNewParticipant(eventId, newParticipants);

        onClose(false);
      
    setButtonSubmitting(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit, (errors) => console.log("Błędy walidacji:", errors))}
        className="space-y-6 w-full mx-auto my-4 p-4 rounded-xl shadow-2xl"
      >
        <div className="flex flex-col lg:flex-row gap-2 items-center">
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
              name="name"
              render={({ field }) => (
                <FormItem className="w-32">
                  <FormLabel>Imię</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="np. imię lub ksywka lub nazwisko"
                      className="shadow-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          <div className="w-full flex justify-center">
            <SubmitButton
              isSubmitting={buttonSubmitting}
              submittingText="Zapisywanie..."
              baseText="Zapisz zmiany"
            />
          </div>
        </div>
      </form>
    </Form>
  );
}