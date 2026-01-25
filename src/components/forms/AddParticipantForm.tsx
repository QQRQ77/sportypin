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
import ComboInputTeams from "../ComboInputTeams";


interface CompetitorFormProps {
  eventId: string;
  cathegories?: string[];
  participants?: Participant[];
  setItems: React.Dispatch<React.SetStateAction<Participant[]>>;
}

const teamSchema = z.object({
  id: z.string().or(z.literal("")).optional(),
  name: z.string().max(100, "Nazwa drużyny domowej jest zbyt długa (maksymalnie 100 znaków).")
});

const FormSchema = z.object({
  name: z.string().max(100).optional(),
  team: teamSchema.optional(),
  team_id: z.string().or(z.literal("")).optional(),
  team_name: z.string().optional(),
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
  first_name: z.string().max(100).optional(),
  second_name: z.string().max(100).optional(),
  cathegory: z.string().or(z.literal("")).optional(),
  itemType: z.string().refine(
    (val) => ["zawodnik", "zespół", "inny"].includes(val),
    {
      message: "Wybierz typ uczestnika",
    }
  ).optional(),
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

    const handleSubmit: SubmitHandler<FormValues> = async (data) => {
      try {
        console.log("handleSubmit data:", data);
        setButtonSubmitting(true);

        const cleanedData = sanitizeStrings(data);
        data = {...cleanedData};

        // Tworzymy kopię, aby nie mutować oryginału z formularza
        const submissionData = { ...data, id: createId() };

        if (data.team) {
          submissionData.team_id = data.team.id;
          submissionData.team_name = data.team.name;
          delete submissionData.team;
        }

        // Walidacja pustych danych
        if (!submissionData.name && !submissionData.first_name && !submissionData.second_name) {
          setButtonSubmitting(false);
          return;
        }

        const newParticipants = [...participants, submissionData];
        setItems(newParticipants as Participant[]);
        await saveNewParticipant(eventId, newParticipants as Participant[]);

        // Resetuj do wartości domyślnych zdefiniowanych w useForm
        form.reset({
          name: "",
          start_number: "",
          first_name: "",
          second_name: "",
          team_name: "",
          team_id: "",
          cathegory: data.cathegory || "",
          itemType: "zespół",
        });
        
      } catch (error) {
        console.error("Błąd podczas dodawania:", error);
      } finally {
        setButtonSubmitting(false);
      }
    };
      
    // const handleSubmit: SubmitHandler<FormValues> =  async (data) => {
    //   setButtonSubmitting(true);

    //   if (data.team) {
    //     const { id: home_team_id, name: home_team_name } = data.team;
    //     data.team_id = home_team_id;
    //     data.team_name = home_team_name;
    //     delete data.team;
    //   }

    //   const cleanedData = sanitizeStrings(data);
    //   data = {...cleanedData};

    //   const submissionData = {
    //     ...data,
    //     id: createId(),
    //   };

    //   if (submissionData.name === "" && submissionData.first_name === "" && submissionData.second_name === "") {
    //     setButtonSubmitting(false);
    //     return;
    //   }

    //   const newParticipants = [...participants, submissionData];
    //   setItems(newParticipants);
    //   await saveNewParticipant(eventId, newParticipants);
  
    //   form.reset({
    //     name: "",
    //     start_number: "",
    //     first_name: "",
    //     second_name: "",
    //     team_name: "",
    //     team_id: "",
    //     cathegory: data.cathegory || "",
    //     itemType: "zespół",
    //   });

    //   setButtonSubmitting(false);
    // }

  return (
    <Form {...form}>
          <form
            // onSubmit={form.handleSubmit(handleSubmit)}
            onSubmit={form.handleSubmit(handleSubmit, (errors) => console.log("Błędy walidacji:", errors))}
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
              {itemType === "zawodnik" && 
                <FormField
                  control={form.control}
                  name="start_number"
                  render={({ field }) => (
                    <FormItem className="w-32">
                      <FormLabel>Numer</FormLabel>
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
                />}

            {itemType === "inny" &&  
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

              {
              itemType === "zespół" && 
                <ComboInputTeams
                  control={form.control}
                  name="team"
                  label="Wybierz/dodaj zespół"
                  placeholder="Wpisz nazwę…"
                />
              }  

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
            </div>

            <div className="p-4 bg-gray-100 rounded-lg">
              <p className="text-sm font-semibold mb-2">Aktualny stan formularza:</p>
              <pre className="text-xs overflow-auto max-h-48 bg-white p-2 rounded border border-gray-300">
                {JSON.stringify(form.getValues(), null, 2)}
                  {form.formState.errors && (
                  <div className="text-red-500 text-sm">
                    {Object.values(form.formState.errors).map((error) => (
                    <p key={error.message}>{error.message}</p>
                    ))}
                  </div>
                  )}
              </pre>
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