'use client';

import { Participant } from "@/types";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SubmitButton from "../ui/submitButton";
import { useState } from "react";
import { createId } from "@paralleldrive/cuid2";
import { saveNewParticipant } from "@/lib/events.actions";
import { sanitizeStrings } from "@/lib/utils";


interface CompetitorFormProps {
  eventId: string;
  cathegories?: string[];
  participants?: Participant[];
  setItems: React.Dispatch<React.SetStateAction<Participant[]>>;
}

const FormSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  start_number: z.coerce
      .number({ invalid_type_error: "Podaj liczbę" })
      .int()
      .nonnegative()
      .optional(),
  first_name: z.string().max(100).optional(),
  second_name: z.string().max(100).optional(),
  cathegory: z.string().or(z.literal("")).optional(),
  itemType: z.string().refine(
    (val) => ["zawodnik", "zespół", "inny"].includes(val),
    {
      message: "Wybierz typ uczestnika",
    }
  ),
});

type FormValues = z.infer<typeof FormSchema>;

export default function AddParticipantForm({cathegories, eventId, participants = [], setItems}: CompetitorFormProps) {

   const form = useForm<FormValues>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
      },
    });

    const itemType = form.watch("itemType");

    const [buttonSubmitting, setButtonSubmitting] = useState(false);
      
    const handleSubmit: SubmitHandler<FormValues> =  async (data) => {
      setButtonSubmitting(true);

      const cleanedData = sanitizeStrings(data);
      data = {...cleanedData};

      const submissionData = {
        ...data,
        id: createId(),
      };

      if (submissionData.name === "" && submissionData.first_name === "" && submissionData.second_name === "") {
        setButtonSubmitting(false);
        return;
      }

      const newParticipants = [...participants, submissionData];
      setItems(newParticipants);
      await saveNewParticipant(eventId, newParticipants);
  
      form.reset({
        name: "",
        start_number: undefined,
        first_name: "",
        second_name: "",
        cathegory: data.cathegory || "",
        itemType: data.itemType,
      });

      setButtonSubmitting(false);
    }

  return (
    <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6 w-full mx-auto my-4 p-4 rounded-xl shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-sky-600 text-center">
              Dodaj uczestnika
            </h2>
                
            <div className="w-full flex gap-4 flex-col lg:flex-row justify-between">
                <FormField
                  control={form.control}
                  name="itemType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Typ uczestnika</FormLabel>
                      <FormControl>
                        <div className="flex gap-4">
                          {["zespół", "zawodnik", "inny"].map((option) => (
                            <label key={option} className="flex items-center gap-1 text-sm">
                              <input
                                type="radio"
                                value={option}
                                checked={field.value === option}
                                onChange={() => field.onChange(option)}
                                className="accent-sky-600"
                              />
                              {option.charAt(0).toUpperCase() + option.slice(1)}
                            </label>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cathegory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategoria</FormLabel>
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
    
              <div className="flex gap-4">
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-2">
              <FormField
                control={form.control}
                name="start_number"
                render={({ field }) => (
                  <FormItem className="w-32">
                    <FormLabel>Numer startowy</FormLabel>
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
            {(itemType === "zespół" || itemType === "inny") &&  
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full lg:w-3/5">
                    <FormLabel>Nazwa uczestnika</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="np. GKS, Chicago Bulls "
                        className="shadow-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />}
              {itemType === "zawodnik" &&
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem className="w-full lg:w-3/5">
                    <FormLabel>Imię zawodnika</FormLabel>
                    <FormControl>
                      <Input
                        className="shadow-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />}
              {itemType === "zawodnik" &&
              <FormField
                control={form.control}
                name="second_name"
                render={({ field }) => (
                  <FormItem className="w-full lg:w-3/5">
                    <FormLabel>Nazwisko zawodnika</FormLabel>
                    <FormControl>
                      <Input
                        className="shadow-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />}
    
              <div className="flex gap-4 w-full lg:w-2/5">
    
              </div>
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
  )
}