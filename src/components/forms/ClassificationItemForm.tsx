'use client';

import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClassificationItem } from "@/types";
import { useState } from "react";
import { saveClassification } from "@/lib/events.actions";
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
import { sanitizeStrings } from "@/lib/utils";

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

interface Props {
  item: ClassificationItem;
  eventId: string;
  cathegories?: string[];
  classification: ClassificationItem[];
  setItems: React.Dispatch<React.SetStateAction<ClassificationItem[]>>;
  onClose: () => void;
}

export default function ClassificationItemForm({item, eventId, cathegories = [], setItems, onClose, classification }: Props) {
    const form = useForm<FormValues>({
      resolver: zodResolver(FormSchema),
      defaultValues: {  
        description: item.description,
        score: item.score || "",
        place: item.place,
        cathegory: item.cathegory,
      },
    });
  
    const [buttonSubmitting, setButtonSubmitting] = useState(false);

    const handleSubmit: SubmitHandler<FormValues> = async (data) => {
        setButtonSubmitting(true);

        const cleanedData = sanitizeStrings(data);
        data = {...cleanedData};
        
        const submissionData: ClassificationItem = {
          ...item,
          ...data,
        };

        const newClassification = classification.map((ci) =>
          ci.id === submissionData.id ? submissionData : ci
        );

        const newClassificationOrdered = newClassification.sort((a, b) => (a.place ?? 0) - (b.place ?? 0));

        setItems(newClassificationOrdered);
        await saveClassification(eventId, newClassificationOrdered);
        setButtonSubmitting(false);
        
        onClose();
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
                  <FormItem className="">
                    <FormControl>
                      <Input
                        placeholder="np. nazwa zespołu, imię i nazwisko zawodnika"
                        className="shadow-xl"
                        {...field}
                      />
                    </FormControl>
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

            <div className="w-[150px]">
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
                        {cathegories && cathegories.map((opt, idx) => (
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
            </div>
            <SubmitButton
              isSubmitting={buttonSubmitting}
              submittingText="Zapisywanie..."
              baseText="Zapisz"
            />
          </div>
        </form>
      </Form>
  )
}