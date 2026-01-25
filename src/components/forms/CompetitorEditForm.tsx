"use client";

import { Participant } from "@/types";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
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
import { saveNewParticipant } from "@/lib/events.actions";
import { sanitizeStrings } from "@/lib/utils";

interface Props {
  eventId: string;
  cathegories?: string[];
  participant?: Participant;
  participants?: Participant[];
  setItems: React.Dispatch<React.SetStateAction<Participant[]>>;
  onClose: () => void;
}

const FormSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  first_name: z.string().min(2).max(100).optional(),
  second_name: z.string().min(2).max(100).optional(),
  cathegory: z.string().or(z.literal("")).optional(),
  // start_number: z.coerce
  //     .number({ invalid_type_error: "Podaj liczbę" })
  //     .int()
  //     .nonnegative()
  //     .optional(),
  start_number: z.union([
    z.coerce.number().int().nonnegative(),
    z.literal(""),
    z.undefined()
    ]).optional(),
  itemType: z.string().refine(
    (val) => ["zawodnik", "zespół", "inny"].includes(val),
    {
      message: "Wybierz typ uczestnika",
    }
  ),
});

type FormValues = z.infer<typeof FormSchema>;

export default function CompetitorEditForm({eventId, cathegories, setItems, onClose, participant, participants = [],}: Props) {

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: participant?.name,
      first_name: participant?.first_name,
      second_name: participant?.second_name,
      start_number: participant?.start_number,
      cathegory: participant?.cathegory,
      itemType: participant?.itemType,
    },
  });

  const itemType = form.watch("itemType");
  
  const [buttonSubmitting, setButtonSubmitting] = useState(false);
    
  const handleSubmit: SubmitHandler<FormValues> =  async (data) => {
    setButtonSubmitting(true);
    
    const cleanedData = sanitizeStrings(data);
    data = {...cleanedData};

    const submissionData = {
      ...participant,
      ...data,

    };

    if (participant) {
      const isUnchanged =
        (participant.name || "") === (submissionData.name || "") &&
        (participant.first_name || "") === (submissionData.first_name || "") &&
        (participant.second_name || "") === (submissionData.second_name || "") &&
        (participant.cathegory || "") === (submissionData.cathegory || "") &&
        (participant.start_number ?? "") === (submissionData.start_number ?? "") &&
        (participant.itemType || "") === (submissionData.itemType || "");
      if (isUnchanged) {
        onClose();
        setButtonSubmitting(false);
        return;
      }
    }

    const newParticipants = participants.map((ci) =>
      ci.id === submissionData.id ? submissionData : ci
    );

    setItems(newParticipants);
    await saveNewParticipant(eventId, newParticipants);

    onClose();
    setButtonSubmitting(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-full mb-2"
      >
        <div className="w-full flex flex-row flex-wrap p-4 gap-2 items-center rounded-xl shadow-xl bg-slate-100 border-2 justify-between">
          <FormField
            control={form.control}
            name="start_number"
            render={({ field }) => (
              <FormItem className="w-24">
                <FormControl>
                  <Input
                    placeholder="nr startowy"
                    className="shadow-xl"
                    {...field}
                  />
                </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
          {(itemType === "zespół" || itemType === "inny") &&  
            <div className="w-full lg:w-2/5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="">
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
              />
            </div>}

            {itemType === "zawodnik" &&
            <div className="flex flex-row gap-2 w-full lg:w-2/5">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem className="w-full lg:w-3/5">
                  <FormControl>
                    <Input
                      placeholder="Imię zawodnika"
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
              name="second_name"
              render={({ field }) => (
                <FormItem className="w-full lg:w-3/5">
                  <FormControl>
                    <Input
                      placeholder="Nazwisko zawodnika"
                      className="shadow-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>}
            <div className="flex flex-row gap-2">
              <FormField
                control={form.control}
                name="cathegory"
                render={({ field }) => (
                  <FormItem>
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
              <FormField
                control={form.control}
                name="itemType"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="shadow-xl">
                          <SelectValue placeholder="Wybierz kategorię" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["zawodnik", "zespół", "inny"].map((opt, idx) => (
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
                <SubmitButton
                  isSubmitting={buttonSubmitting}
                  submittingText="Zapisywanie..."
                  baseText="Zapisz"
                />
            </div>
        </div>
      </form>
    </Form>
  );
}