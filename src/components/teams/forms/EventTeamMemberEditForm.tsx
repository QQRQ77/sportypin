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
import { Participant, TeamMember } from "@/types";
import { sanitizeStrings } from "@/lib/utils";

const FormSchema = z.object({
  firstName: z.string().min(1, 'Imię jest wymagane'),
  lastName: z.string().optional(),
  startNumber: z.string().min(1, 'Numer startowy jest wymagany'),
});

type FormValues = z.infer<typeof FormSchema>;

interface Props {
    eventId?: string;
    member: TeamMember;
    participants?: Participant[];
    onClose?: (show: boolean) => void;
    setItems?: React.Dispatch<React.SetStateAction<Participant[]>>;
  }

export function EventTeamMemberEditForm({member, onClose = () => {}}: Props) {
  
  const form = useForm<FormValues>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
        firstName: member.first_name,
        lastName: member.second_name,
        startNumber: String(member.start_number || ""),
      },
    });

  const [buttonSubmitting, setButtonSubmitting] = useState(false);
  
  const handleSubmit: SubmitHandler<FormValues> =  async (data) => {
    setButtonSubmitting(true);

    const cleanData = sanitizeStrings(data);

    if (member) {
      const unchangedFields = (member.first_name === cleanData.firstName) && (member.second_name === cleanData.lastName) && (String(member.start_number) === cleanData.startNumber);

      if (unchangedFields) {
        onClose(false);
        setButtonSubmitting(false);
        return;
      }
    }
      
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