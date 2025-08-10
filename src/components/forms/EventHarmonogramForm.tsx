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
import { addMinutesToTime, minutesBetween } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HarmonogramItem } from "@/types";
import { createId } from "@paralleldrive/cuid2";
import { useEffect } from "react";
import { saveHarmonogram } from "@/lib/events.actions";

const timeRegex = /^([0-1]\d|2[0-3]):([0-5]\d)$/;

const FormSchema = z.object({
  description: z.string().min(3).max(200),
  date: z.string().min(1, "Wybierz datę").or(z.literal("")),
  pause: z.coerce
    .number({ invalid_type_error: "Podaj liczbę" })
    .int()
    .nonnegative(),
  defaultItemTime: z.coerce
    .number({ invalid_type_error: "Podaj liczbę" })
    .int()
    .nonnegative(),

  start_time: z
    .string()
    .regex(timeRegex, "HH:MM")
    .or(z.literal("")),
  end_time: z
    .string()
    .regex(timeRegex, "HH:MM")
    .or(z.literal("")),
}).superRefine((val, ctx) => {
  if (val.start_time && val.end_time) {
    const diff = minutesBetween(val.start_time, val.end_time);
    if (diff <= 0) {
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
  setItems: React.Dispatch<React.SetStateAction<HarmonogramItem[]>>;
}

/* -------------------------------------------------- */
/* formatowanie daty oraz generowanie opcji */
/* -------------------------------------------------- */
const formatDate = (date: Date) => {
  const fmt = new Intl.DateTimeFormat("pl-PL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const parts = fmt.formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value || "";
  return `${get("weekday")} - ${get("day")} ${get("month")} ${get("year")}`;
};

const generateDateOptions = (start?: string, end?: string) => {
  if (!start) return [];
  const s = new Date(start);
  if (isNaN(s.getTime())) return [];
  const e = end ? new Date(end) : s;
  if (isNaN(e.getTime())) return [{ value: s.toISOString().split("T")[0], label: formatDate(s) }];
  const out = [];
  for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
    out.push({
      value: d.toISOString().split("T")[0],
      label: formatDate(new Date(d)),
    });
  }
  return out;
};

export default function HarmonogramForm({
  eventId,
  start_date,
  end_date,
  setItems,
}: HarmonogramFormProps) {
  
  const dateOptions = generateDateOptions(start_date, end_date);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      description: "",
      date: dateOptions[0]?.value ?? "",
      pause: 0,
      defaultItemTime: 15,
      start_time: "",
      end_time: "",
    },
  });

const startTime = form.watch("start_time");
const duration  = form.watch("defaultItemTime");

useEffect(() => {
  if (startTime && duration && duration > 0) {
    const newEnd = addMinutesToTime(startTime, duration);
    form.setValue("end_time", newEnd, { shouldValidate: true });
  }
}, [startTime, duration, form.setValue]);

  const handleSubmit: SubmitHandler<FormValues> =  async (data) => {

    const submissionData = {
      ...data,
      id: createId(),
      // end_time: computedEnd,
    };

    setItems((prev) => {
      const newItems = [...prev, submissionData];
      // Save harmonogram as a side effect
      saveHarmonogram(eventId, newItems);
      return newItems;
    });

    /* następny domyślny start = koniec + przerwa */
    const nextStart = addMinutesToTime(data.end_time, data.pause);
    form.reset({
      description: "",
      date: data.date,
      pause: data.pause,
      defaultItemTime: data.defaultItemTime,
      start_time: nextStart,
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
        <div className="w-full flex gap-4 flex-col lg:flex-row justify-between">
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
                      {dateOptions.map((opt) => (
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

          <div className="flex gap-4">
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
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
          

        {/* OPIS + START/END – bez zmian */}
        <div className="flex flex-col lg:flex-row gap-2">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full lg:w-3/5">
                <FormLabel>Opis punktu</FormLabel>
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

          <div className="flex gap-4 w-full lg:w-2/5">
            <FormField
              control={form.control}
              name="start_time"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>Godzina rozpoczęcia</FormLabel>
                  <FormControl>
                    <Input type="time" className="shadow-xl" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="end_time"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>Godzina zakończenia</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      className="shadow-xl"
                      {...field}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="w-full flex justify-center">
          <Button
            type="submit"
            className="w-42 bg-sky-500 hover:bg-sky-600 text-white font-semibold"
          >
            Dodaj
          </Button>
        </div>
      </form>
    </Form>
  );
}