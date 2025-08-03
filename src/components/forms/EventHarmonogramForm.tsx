"use client";

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
import { Button } from "@/components/ui/button";
import { minutesBetween } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HarmonogramItem } from "@/types";
import { createId } from '@paralleldrive/cuid2';

const timeRegex = /^([0-1]\d|2[0-3]):([0-5]\d)$/;   // HH:MM (00:00–23:59)

const FormSchema = z.object({
  description: z.string().min(3).max(200),
  date: z.string().min(1, "Wybierz datę").or(z.literal("")),
  start_time: z
    .string()
    .regex(timeRegex, "Podaj godzinę w formacie HH:MM")
    .or(z.literal("")),
  end_time: z
    .string()
    .regex(timeRegex, "Podaj godzinę w formacie HH:MM")
    .or(z.literal("")),
}).superRefine((val, ctx) => {
  if (val.start_time && val.end_time) {
    const timeLap = minutesBetween(val.start_time, val.end_time)
    if (!(timeLap > 0)) {
      ctx.addIssue({
        code: "custom",
        path: ["end_time"],
        message: "Godzina końca musi być późniejsza niż startu",
      });
    }
  }
});
 
type FormValues = z.infer<typeof FormSchema>;

interface HarmonogramFormProps {
  eventId: string;
  start_date?: string;
  end_date?: string;
  setItems: React.Dispatch<React.SetStateAction<HarmonogramItem[]>>
}

// Funkcja formatująca datę w formacie: {weekday} - DD {month} YYYY
const formatDate = (date: Date) => {
  const formatter = new Intl.DateTimeFormat('pl-PL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const parts = formatter.formatToParts(date);
  let weekday = '';
  let day = '';
  let month = '';
  let year = '';
  
  for (const part of parts) {
    if (part.type === 'weekday') weekday = part.value;
    if (part.type === 'day') day = part.value;
    if (part.type === 'month') month = part.value;
    if (part.type === 'year') year = part.value;
  }
  
  return `${weekday} - ${day} ${month} ${year}`;
};

// Funkcja generująca opcje dat między start_date a end_date
const generateDateOptions = (startDate?: string, endDate?: string) => {
  // Jeśli nie ma startDate, zwracamy pustą tablicę
  if (!startDate) return [];
  
  const dates = [];
  const start = new Date(startDate);
  
  // Sprawdzenie poprawności daty
  if (isNaN(start.getTime())) return [];
  
  // Jeśli nie ma endDate, dodajemy tylko startDate
  if (!endDate) {
    return [{
      value: start.toISOString().split('T')[0],
      label: formatDate(start),
    }];
  }
  
  const end = new Date(endDate);
  
  // Sprawdzenie poprawności końcowej daty
  if (isNaN(end.getTime())) {
    return [{
      value: start.toISOString().split('T')[0],
      label: formatDate(start),
    }];
  }
  
  const current = new Date(start);
  
  while (current <= end) {
    dates.push({
      value: current.toISOString().split('T')[0], // format YYYY-MM-DD
      label: formatDate(current),
    });
    
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
};

export default function HarmonogramForm({eventId, start_date, end_date, setItems}: HarmonogramFormProps) {
  // Sprawdzenie czy pokazać pole wyboru daty
  const showDateField = !!start_date;
  
  // Generowanie opcji dat
  const dateOptions = generateDateOptions(start_date, end_date);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      description: "",
      date: dateOptions.length > 0 ? dateOptions[0].value : undefined,
      start_time: "",
      end_time: "",
    },
  });

  const handleSubmit: SubmitHandler<FormValues> = (data) => {
    const submissionData = {...data, id: createId()};
    setItems(prev => [...prev, submissionData]);
    form.reset({
      description: "",
      start_time: "",
      end_time: "",
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 w-full mx-auto my-4 p-4 rounded-xl shadow-2xl"
      >
        <h2 className="text-2xl font-bold text-sky-600 text-center">
          Dodaj punkt harmonogramu
        </h2>

        {/* Data - wyświetlana tylko gdy start_date istnieje */}
        {showDateField && (
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-600">Data</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="shadow-xl">
                      <SelectValue placeholder="Wybierz datę" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {dateOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex flex-col lg:flex-row gap-2">
          {/* Opis */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full lg:w-3/5">
                <FormLabel className="text-slate-600">Opis punktu</FormLabel>
                <FormControl>
                  <Input
                    placeholder="np. mecz: GKS vs. LSZ"
                    className="shadow-xl"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Godzina rozpoczęcia */}
          <FormField
            control={form.control}
            name="start_time"
            render={({ field }) => (
              <FormItem className="w-full lg:w-1/5">
                <FormLabel className="text-slate-600">Godzina rozpoczęcia</FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    className="shadow-xl"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Godzina zakończenia */}
          <FormField
            control={form.control}
            name="end_time"
            render={({ field }) => (
              <FormItem className="w-full lg:w-1/5">
                <FormLabel className="text-slate-600">Godzina zakończenia</FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    className="shadow-xl"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-42 bg-sky-500 hover:bg-sky-600 text-white font-semibold mx-auto"
        >
          Dodaj
        </Button>
      </form>
    </Form>
  );
}