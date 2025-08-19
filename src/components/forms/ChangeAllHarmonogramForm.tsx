'use client'

import { Event } from "@/types";

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

const timeRegex = /^([0-1]\d|2[0-3]):([0-5]\d)$/;

const FormSchema = z.object({
  pause: z.coerce
    .number({ invalid_type_error: "Podaj liczbę" })
    .int()
    .nonnegative()
    .optional(),
  defaultItemTime: z.coerce
    .number({ invalid_type_error: "Podaj liczbę" })
    .int()
    .nonnegative()
    .optional(),
  cathegory: z.string().or(z.literal("")).optional(),
  itemType: z.string().refine(
    (val) => ["wszystkie", "mecz", "pojedynek", "wyścig", "konkurs", "inny"].includes(val),
    {
      message: "Wybierz typ punktu",
    }
  ),
})

type FormValues = z.infer<typeof FormSchema>;

export default function ChangeAllHarmonogramForm({ cathegories }: { cathegories?: string[] }) {
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pause: 0,
      defaultItemTime: 15,
      itemType: "wszystkie",
      cathegory: "wszystkie",
    },
  });

  const [buttonSubmitting, setButtonSubmitting] = useState(false);
  
  const handleSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log("Form data:", data);
    const { pause, defaultItemTime, cathegory, itemType } = data;
    //TODO: Implement the logic to change all harmonogram items
    setButtonSubmitting(true);
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
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
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
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
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