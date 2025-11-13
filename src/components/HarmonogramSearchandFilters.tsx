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
import { useEffect } from "react";

interface HarmonogramSearchAndFiltersProps {
      setSearchString?: (value: string) => void;
      types?: string[];
      cathegories?: string[];
      teams?: string[];
      setFilterType?: (value: string) => void;
      setFilterCathegory?: (value: string) => void;
      setFilterTeam?: (value: string) => void;
}

const FormSchema = z.object({
  cathegory: z.string().or(z.literal("")).optional(),
})

type FormValues = z.infer<typeof FormSchema>;

// export default function HarmonogramSearchAndFilters({types, cathegories, teams, setSearchString, setFilterType, setFilterCathegory, setFilterTeam}: HarmonogramSearchAndFiltersProps ) {
export default function HarmonogramSearchAndFilters({cathegories, setFilterCathegory}: HarmonogramSearchAndFiltersProps) {

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      cathegory: "wszystkie",
    },
  });

  const cathegorySelected = form.watch("cathegory");

  useEffect(() => {
    if (cathegorySelected) {
      setFilterCathegory?.(cathegorySelected);
    } 
  }, [cathegorySelected]);

  return (
    <div className="w-full flex flex-wrap gap-2 mb-2 p-4 rounded-xl shadow-xl border-2">
      <p>Filtruj: </p> 
          <Form {...form}>
            <form
              className="space-y-6 w-full mx-auto my-4 p-4 rounded-xl shadow-2xl"
            >
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
            </form>
          </Form>
      {/* Tutaj dodaj komponenty do wyszukiwania i filtrowania */}
    </div>
  );
}