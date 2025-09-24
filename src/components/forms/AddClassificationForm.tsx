'use client';

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
import EventScores from "../EventScores";

interface Props {
  eventId: string;
  cathegories?: string[];
  setItems: React.Dispatch<React.SetStateAction<[]>>;
  onClose: () => void;
}

const FormSchema = z.object({
  description: z.string().min(3).max(200),
  place: z
    .string()
    .or(z.literal("")),
  score: z
    .string()
    .or(z.literal(""))
    .optional(),
  cathegory: z.string().or(z.literal("")).optional(),
})

type FormValues = z.infer<typeof FormSchema>;

export default function ClassificationForm({ eventId, cathegories = [], setItems, onClose }: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {  
      description: "",
      place: "",
      score: "",
      cathegory: "",
    },
  });

  const handleSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log(data);
    }
  
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-full"
      >
        <div className="w-11/12 flex flex-wrap p-4 gap-2 items-center rounded-xl shadow-xl bg-slate-100 border-2">
          <div className="w-[100px]">
            <FormField
              control={form.control}
              name="place"
              render={({ field }) => (
                <FormItem className="">
                  <FormControl>
                    <Input
                      placeholder="pozycja np. 4 lub IV"
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
          <div className="w-[100px]">
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
        </div>
      </form>
    </Form>
  );
}