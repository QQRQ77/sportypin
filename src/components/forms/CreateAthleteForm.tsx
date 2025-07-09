'use client'

import { useState } from "react";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { createAthlete } from "@/lib/athletes.actions";

const FormSchema = z.object({
    first_name: z.string().min(3, "Imię zawodnika jest zbyt krótkie (minimum 3 znaki).").max(50, "Imię zawodnika jest zbyt długie (maksymalnie 50 znaków)."),
    last_name: z.string().min(3, "Nazwisko zawodnika jest zbyt krótkie (minimum 3 znaki).").max(50, "Imię zawodnika jest zbyt długie (maksymalnie 50 znaków).").optional(),
    teams: z.array(
      z.string()
        .min(3, "Nazwa zespołu jest zbyt krótka (minimum 3 znaki).")
        .max(50, "Nazwa zespołu jest zbyt długa (maksymalnie 50 znaków).")
    ).optional(),
    home_team: z.string().min(3, "Nazwa drużyny domowej jest zbyt krótka (minimum 3 znaki).").max(50, "Nazwa drużyny domowej jest zbyt długa (maksymalnie 50 znaków).").optional(),
    birth_day: z.number().min(1, "Dzień musi być większy niż 0.").max(31, "Dzień musi być mniejszy lub równy 31.").optional(),
    birth_month: z.string().optional().refine(value => {
        const months = ["styczeń", "luty", "marzec", "kwiecień", "maj", "czerwiec", "lipiec", "sierpień", "wrzesień", "październik", "listopad", "grudzień"];
        return value ? months.includes(value) : true;},
       "Miesiąc musi być jednym z: styczeń, luty, marzec, kwiecień, maj, czerwiec, lipiec, sierpień, wrzesień, październik, listopad, grudzień."),
    birth_year: z.number().min(1900, "Rok musi być większy niż 1900.").max(new Date().getFullYear(), `Rok musi być mniejszy lub równy ${new Date().getFullYear()}.`).optional(),
  })

type InputType = z.infer<typeof FormSchema>

export default function CreateAthleteForm() {

    const form = useForm<InputType>({
        resolver: zodResolver(FormSchema)
    });

    const router = useRouter()

    const [teamInput, setTeamInput] = useState("");
    const [submitButtonDisactive, setSubmitButtonDisactive] = useState(false);

    const addAthlete: SubmitHandler<InputType> = async (data) => {

      setSubmitButtonDisactive(true);

      if (teamInput != "") {
          const trimmed = teamInput.trim();
          if (trimmed.length >= 3 && !data.teams?.includes(trimmed)) {
            data.teams = [...(data.teams || []), trimmed];
            setTeamInput("");
          } else {
            toast.error("Nazwa zespołu musi mieć co najmniej 3 znaki i nie może być duplikatem.");
            return;
          }
      }
          
        try {
            const athlete = await createAthlete({...data}) 

            if(athlete) {router.push(`/athlete/${athlete.id}`)} else {router.push("/")}
                       
        } catch (error) {
            setSubmitButtonDisactive(false);
            toast.error("Upps!. Coś poszło nie tak...")
            console.error(error)
        }
    } 

    return (
        <>
          <Form {...form}>
              <form onSubmit={form.handleSubmit(addAthlete)} className="space-y-8">
                  <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Imię zawodnika</FormLabel>
                              <FormControl>
                                  <Input placeholder="Wpisz imię zawodnika" {...field} />
                              </FormControl>
                              <FormDescription>
                                  To jest imię zawodnika, którego dodajesz do bazy.
                              </FormDescription>
                              <FormMessage />
                          </FormItem>
                        )}
                  />
                  <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Nazwisko zawodnika</FormLabel>
                              <FormControl>
                                  <Input placeholder="Wpisz nazwisko zawodnika" {...field} />
                              </FormControl>
                              <FormDescription>
                                  To jest nazwisko zawodnika, którego dodajesz do bazy.
                              </FormDescription>
                              <FormMessage />
                          </FormItem>
                  )}
                  />
                  <FormField
                    control={form.control}
                    name="teams"
                    render={({ field }) => {
                      const teams = field.value || [];

                      const addTeam = () => {
                        const trimmed = teamInput.trim();
                        if (trimmed.length >= 3 && !teams.includes(trimmed)) {
                          field.onChange([...teams, trimmed]);
                          setTeamInput("");
                        }
                      };

                      const removeTeam = (teamToRemove: string) => {
                        field.onChange(teams.filter((team: string) => team !== teamToRemove));
                      };

                      return (
                        <FormItem>
                          <FormLabel>Zespoły</FormLabel>
                          <FormControl>
                            <div>
                              <div className="flex gap-2 mb-2">
                                <Input
                                  value={teamInput}
                                  onChange={e => setTeamInput(e.target.value)}
                                  placeholder="Dodaj nazwę zespołu"
                                  onKeyDown={e => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      addTeam();
                                    }
                                  }}
                                />
                                <Button type="button" onClick={addTeam} disabled={teamInput.trim().length < 3}>
                                  Dodaj
                                </Button>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {teams.map((team: string, idx: number) => (
                                  <span key={idx} className="flex items-center bg-gray-200 px-2 py-1 rounded">
                                    {team}
                                    <button
                                      type="button"
                                      className="ml-1 text-red-500 hover:text-red-700"
                                      onClick={() => removeTeam(team)}
                                      aria-label={`Usuń ${team}`}
                                    >
                                      ×
                                    </button>
                                  </span>
                                ))}
                              </div>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Dodaj jeden lub więcej zespołów, w których występuje zawodnik.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <FormField
                      control={form.control}
                      name="home_team"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Drużyna domowa</FormLabel>
                              <FormControl>
                                  <Input placeholder="Wpisz nazwę drużyny domowej" {...field} />
                              </FormControl>
                              <FormDescription>
                                  To jest nazwa drużyny, w której zawodnik gra na co dzień.
                              </FormDescription>
                              <FormMessage />
                          </FormItem>
                       )}
                  />
                  <FormLabel>Data urodzenia zawodnika</FormLabel>
                  <div className="flex justify-start gap-3">
                  <FormField
                      control={form.control}
                      name="birth_day"
                      render={({ field }) => (
                          <FormItem>
                              <FormControl>
                                <select
                                  value={field.value ?? ""}
                                  onChange={e => field.onChange(Number(e.target.value))}
                                  className="w-20 border rounded px-2 py-1 mr-2"
                                >
                                  <option value="">Dzień</option>
                                  {Array.from({ length: 31 }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                      {i + 1}
                                    </option>
                                  ))}
                                </select>
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}/>
                  <FormField
                      control={form.control}
                      name="birth_month"
                      render={({ field }) => (
                          <FormItem>
                              <FormControl>
                                <select
                                  value={field.value ?? ""}
                                  onChange={e => field.onChange(e.target.value)}
                                  className="w-32 border rounded px-2 py-1 mr-2"
                                >
                                  <option value="">Miesiąc</option>
                                  {["styczeń", "luty", "marzec", "kwiecień", "maj", "czerwiec", "lipiec", "sierpień", "wrzesień", "październik", "listopad", "grudzień"].map((month, index) => (
                                    <option key={index} value={month}>
                                      {month.charAt(0).toUpperCase() + month.slice(1)}
                                    </option>
                                  ))}
                                </select>
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}/>
                    <FormField
                      control={form.control}
                      name="birth_year"
                      render={({ field }) => (
                          <FormItem>
                              <FormControl>
                                <select
                                  value={field.value ?? ""}
                                  onChange={e => field.onChange(Number(e.target.value))}
                                  className="w-22 border rounded px-2 py-1 mr-2"
                                >
                                  <option value="">Rok</option>
                                    {Array.from({ length: new Date().getFullYear() - 1899 }, (_, i) => (
                                    <option key={new Date().getFullYear() - i} value={new Date().getFullYear() - i}>
                                      {new Date().getFullYear() - i}
                                    </option>
                                    ))}
                                </select>
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}/>
                      </div>

                  <div className="flex items-center justify-center gap-2">
                      <Button 
                          color="warning" 
                          type="submit" 
                          disabled={form.formState.isSubmitting || submitButtonDisactive} 
                          className="font-semibold text-lg text-white hover:-translate-y-1 cursor-pointer">
                          {form.formState.isSubmitting ? "Zapisywanie..." : "Dodaj zawodnika"}
                      </Button>
                  </div>
              </form>
          </Form>
        </>
    )
}