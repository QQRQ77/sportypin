'use client'

import { Event, HarmonogramItem } from "@/types";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import SubmitButton from "../ui/submitButton";
import { useState } from "react";
import { generateDateOptions } from "./EventHarmonogramForm";
import { addMinutesToTime, minutesBetween } from "@/lib/utils";

const timeRegex = /^([0-1]\d|2[0-3]):([0-5]\d)$/;

const FormSchema = z.object({
  pause: z
    .union([
      z.coerce
        .number({ invalid_type_error: "Podaj liczbę" })
        .int()
        .nonnegative(),
      z.undefined(),
      z.null(),
    ])
    .optional(),
  defaultItemTime: z
    .union([
      z.coerce
        .number({ invalid_type_error: "Podaj liczbę" })
        .int()
        .nonnegative(),
      z.undefined(),
      z.null(),
    ])
    .optional(),
  cathegory: z.string().or(z.literal("")).optional(),
  itemType: z.string().refine(
    (val) => ["wszystkie", "mecz", "pojedynek", "wyścig", "konkurs", "inny"].includes(val),
    {
      message: "Wybierz typ punktu",
    }
  ),
  date: z.string().min(1, "Wybierz datę").or(z.literal("")),
})

type FormValues = z.infer<typeof FormSchema>;

interface ChangeAllHarmonogramFormProps {
  eventId: string;
  start_date?: string;
  end_date?: string;
  items: HarmonogramItem[];
  cathegories?: string[];
  setItems: React.Dispatch<React.SetStateAction<HarmonogramItem[]>>;
}

export default function ChangeAllHarmonogramForm({ cathegories, start_date, end_date, eventId, items, setItems }: ChangeAllHarmonogramFormProps) {
  const dateOptions = generateDateOptions(start_date, end_date);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      itemType: "wszystkie",
      cathegory: "wszystkie",
      date: dateOptions.length === 1 ? dateOptions[0]?.value : "wszystkie",
    },
  });

  const [buttonSubmitting, setButtonSubmitting] = useState(false);
  
  const handleSubmit: SubmitHandler<FormValues> = async (data) => {
    setButtonSubmitting(true);
    const { pause, defaultItemTime, cathegory, itemType } = data;

    //TODO: Implement the logic to change all harmonogram items
    if (pause || pause === 0) {
      for ( let i = 1; i < items.length; i++) {
        const itemTime = minutesBetween(items[i].start_time, items[i].end_time);
        items[i].start_time = addMinutesToTime(items[i-1].end_time, pause);
        items[i].end_time = addMinutesToTime(items[i].start_time, itemTime);
      }
    }

    if (defaultItemTime && defaultItemTime > 0) {
      const lastPause = minutesBetween(items[items.length - 2].end_time, items[items.length - 1].start_time);
      for ( let i = 0; i < items.length; i++) {        
        let pauseBetweenItems = 0
        if (i < items.length - 1) pauseBetweenItems = minutesBetween(items[i].end_time, items[i+1].start_time);
        if (i === items.length - 1 ) pauseBetweenItems = lastPause
        if (i === 0) {
          items[i].end_time = addMinutesToTime(items[i].start_time, defaultItemTime)
        } else {
          items[i].start_time = addMinutesToTime(items[i-1].end_time, pauseBetweenItems)
          items[i].end_time = addMinutesToTime(items[i].start_time, defaultItemTime)
        }
      }
    }

    setItems([...items]);
    setButtonSubmitting(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 w-full mx-auto my-4 p-4 rounded-xl shadow-2xl"
      >
        <h2 className="text-2xl font-bold text-sky-600 text-center">
          Zmień wszystkie punkty harmonogramu
        </h2>
        <div className="w-full flex gap-4 flex-col lg:flex-row justify-center">
            <FormField
              control={form.control}
              name="pause"
              render={({ field }) => (
                <FormItem className="w-1/2 lg:w-32">
                  <FormLabel>Przerwa (min)</FormLabel>
                  <FormControl>
                    <Input
                      className="shadow-xl"
                      type="number"
                      min={0}
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value === "" ? undefined : e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-wrap gap-4">
              <FormField
                control={form.control}
                name="defaultItemTime"
                render={({ field }) => (
                  <FormItem className="w-1/2 lg:w-32">
                    <FormLabel className="">Czas trwania (min)</FormLabel>
                    <FormControl>
                      <Input
                        className="shadow-xl"
                        type="number"
                        min={0}
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value === "" ? undefined : e.target.valueAsNumber)}
                      />
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
              <FormField
                control={form.control}
                name="itemType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Typ</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="shadow-xl">
                          <SelectValue placeholder="Wybierz typ" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cathegories && ["wszystkie", "mecz", "pojedynek", "wyścig", "konkurs", "inny"].map((opt, idx) => (
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
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="shadow-xl">
                          <SelectValue placeholder="Wybierz datę" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[{value: "wszystkie", label: "wszystkie"}, ...dateOptions].map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>          
          </div>
          
        <div className="w-full flex justify-center">
          <SubmitButton
            isSubmitting={buttonSubmitting}
            submittingText="Zapisywanie..."
            baseText="Zmień"
          />
        </div>
      </form>
    </Form>
  );
}