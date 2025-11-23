import { z } from "zod";
import { useForm } from "react-hook-form";
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
import { useEffect, useState } from "react";
import { Participant } from "@/types";
import { transformationParticipants } from "./forms/EventHarmonogramForm";

interface HarmonogramSearchAndFiltersProps {
      setSearchString?: (value: string) => void;
      types?: string[];
      cathegories?: string[];
      participants?: Participant[];
      setFilterType?: (value: string) => void;
      setFilterCathegory?: (value: string) => void;
      setFilterParticipant?: (value: string) => void;
}

const FormSchema = z.object({
  cathegory: z.string().or(z.literal("")).optional(),
  participant: z.string().max(100).or(z.literal("")).optional(),
})

type FormValues = z.infer<typeof FormSchema>;

// export default function HarmonogramSearchAndFilters({types, cathegories, teams, setSearchString, setFilterType, setFilterCathegory, setFilterTeam}: HarmonogramSearchAndFiltersProps ) {
export default function HarmonogramSearchAndFilters({cathegories, setFilterCathegory, participants, setFilterParticipant}: HarmonogramSearchAndFiltersProps) {

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      cathegory: "wszystkie",
    },
  });

  const [participantsToSelect, setParticipantsToSelect] = useState<string[]>([]);

  const cathegorySelected = form.watch("cathegory");
  const participantSelected = form.watch("participant");

  useEffect(() => {
    if (cathegorySelected) {
      setFilterCathegory?.(cathegorySelected);
    } 
    if(participantSelected) {
      setFilterParticipant?.(participantSelected);
    }
  }, [cathegorySelected, participantSelected, setFilterCathegory, setFilterParticipant]);

  useEffect(() => {
      if (cathegorySelected && cathegorySelected !== "wszystkie") {
        const filtered = participants ? participants.filter(p => p.cathegory === cathegorySelected) : [];
        setParticipantsToSelect(transformationParticipants(filtered));
      } else {
        setParticipantsToSelect(transformationParticipants(participants));
      }
    }, [participants, cathegorySelected]);

  return (
    <div className="w-full flex flex-wrap gap-2 mb-2 p-4 rounded-xl shadow-xl border-2">
      <p>Filtruj: </p> 
          <Form {...form}>
            <form
              className="flex flex-col sm:flex-row flex-wrap w-full mx-auto my-4 p-4 rounded-xl shadow-2xl border-2 gap-4"
            >
            <FormField
              control={form.control}
              name="cathegory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategoria:</FormLabel>
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
              name="participant"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Uczestnik:</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="shadow-xl">
                        <SelectValue placeholder="Wybierz uczestnika" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {participants && ["wszyscy", ...participantsToSelect].map((opt, idx) => (
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
            </form>
          </Form>
      {/* Tutaj dodaj komponenty do wyszukiwania i filtrowania */}
    </div>
  );
}