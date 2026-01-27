'use client';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SubmitButton from "../ui/submitButton";
import { Input } from "@/components/ui/input";
import { ClassificationItem, Participant } from "@/types";
import { useEffect, useState } from "react";
import { createId } from "@paralleldrive/cuid2";
import { saveClassification } from "@/lib/events.actions";
import { sanitizeStrings } from "@/lib/utils";


interface Props {
  eventId: string;
  cathegories?: string[];
  classification: ClassificationItem[];
  participants?: Participant[];  
  setItems: React.Dispatch<React.SetStateAction<ClassificationItem[]>>;
}

const FormSchema = z.object({
  description: z.string().min(3).max(200),
  place: z.coerce
      .number({ invalid_type_error: "Podaj liczbę" })
      .int()
      .nonnegative(),
  score: z
    .string()
    .or(z.literal(""))
    .optional(),
  cathegory: z.string().or(z.literal("")).optional(),
})

type FormValues = z.infer<typeof FormSchema>;

export const transformationClassificationItems = (participants?: Participant[]) => {
  if (!participants) return [];
  return participants.map(p => {
  if (p.itemType === "zawodnik") return {name: `${p.start_number} - ${p.first_name} ${p.second_name || ""}`.trim() || "", id: "", itemType: ""};
  if (p.itemType === "drużyna" || p.itemType === "zespół"){
    return {name: p.team_name || "", id: p.team_id || "", itemType: p.itemType || ""};};
  return {name: p.name || p.team_name || "", id: "", itemType: ""};
  });
}

export default function ClassificationForm({ eventId, cathegories = [], setItems, classification, participants }: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {  
      description: "",
      score: "",
      place: undefined,
      cathegory: "wszystkie",
    },
  });

  const [buttonSubmitting, setButtonSubmitting] = useState(false);
  const [participantsToSelect, setParticipantsToSelect] = useState<{name: string, id: string, itemType: string}[]>([]);

  const cathegorySelected = form.watch("cathegory");

  useEffect(() => {
    if (cathegorySelected && cathegorySelected !== "wszystkie") {
      const filtered = participants ? participants.filter(p => p.cathegory === cathegorySelected) : [];
      setParticipantsToSelect(transformationClassificationItems(filtered));
    } else {
      setParticipantsToSelect(transformationClassificationItems(participants));
    }
  }, [participants, cathegorySelected]);

  const handleSubmit: SubmitHandler<FormValues> = async (data) => {
    setButtonSubmitting(true);

    const cleanedData = sanitizeStrings(data);
    data = {...cleanedData};
    
    const submissionData: ClassificationItem = {
      ...data,
      id: createId(),
    };

    //sprawdzenie w participantToSelect czy uczestnik o takim "name" posiada team_id lub athlete_id i przypisanie ich do submissionData  
    const participant = participants ? participantsToSelect.find(p => p.name === data.description) : {name: "", id: "", itemType: ""};
    if (participant?.itemType === "drużyna" || participant?.itemType === "zespół") {
      submissionData.team_id = participant?.id;
    }
    if (participant?.itemType === "zawodnik") {
      submissionData.athlete_id = participant?.id;
    }

    const newClassification = [...classification, submissionData].sort((a, b) => (a.place ?? 0) - (b.place ?? 0));

    setItems(newClassification);
    await saveClassification(eventId, newClassification);
        
    form.reset({
      description: "",
      place: undefined,
      score: "",
      cathegory: data.cathegory || "",
    });
    
    setButtonSubmitting(false);
    }
  
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-full mb-2"
      >
        <div className="w-full flex flex-wrap p-4 gap-2 items-center rounded-xl shadow-xl bg-slate-100 border-2">
          <div className="w-[100px]">
            <FormField
              control={form.control}
              name="place"
              render={({ field }) => (
                <FormItem className="">
                  <FormControl>
                    <Input
                      placeholder="pozycja"
                      className="shadow-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex-1">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="shadow-xl">
                        <SelectValue placeholder="zespół" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {participants && participantsToSelect.map((opt, idx) => (
                        <SelectItem key={idx} value={opt.name}>
                          {opt.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
                )}
              />
          </div>
          <div className="w-[150px]">
            <FormField
              control={form.control}
              name="score"
              render={({ field }) => (
                <FormItem className="">
                  <FormControl>
                    <Input
                      placeholder="podaj wynik"
                      className="shadow-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="cathegory"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="shadow-xl">
                      <SelectValue placeholder="kategoria..." />
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