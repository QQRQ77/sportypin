'use client'

import { EnvelopeIcon, EyeIcon, EyeSlashIcon, KeyIcon, UserIcon } from "@heroicons/react/20/solid"
import { useEffect, useState } from "react";
import { z } from "zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordStrength } from "check-password-strength";
// import { registerUser } from "@/lib/actions/authActions";
import { toast } from "react-toastify";
import { redirect, useRouter } from "next/navigation";
import PassStrengthBar from "../PassStrengthBar";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Tooltip } from "@heroui/tooltip";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import Link from "next/link";
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
    birth_day: z.number().min(1, "Dzień musi być większy niż 0.").max(31, "Dzień musi być mniejszy lub równy 31."),
    birth_month: z.number().min(1, "Miesiąc musi być większy niż 0.").max(12, "Miesiąc musi być mniejszy lub równy 12."),
    birth_year: z.number().min(1900, "Rok musi być większy niż 1900.").max(new Date().getFullYear(), `Rok musi być mniejszy lub równy ${new Date().getFullYear()}.`),
  })

type InputType = z.infer<typeof FormSchema>

export default function CreateAthleteForm() {

    const form = useForm<InputType>({
        resolver: zodResolver(FormSchema)
    });

    const router = useRouter();
    const [visiblePass, setVisiblePass] = useState(false);
    const [buttonsVis, setButtonsVis] = useState(true)
    
    const [isPasswordVisible, setIsPassVisible] = useState(false)
    const [passStrength, setPassStrength] = useState(0)
    const [buttonSpinnerVis, setButtonSpinnerVis] = useState(false)
    const [infoMessageVisible, setInfoMessageVisible] = useState(false)
    const [infoMessage, setInfoMessage] = useState("Link aktywacyjny został wysłany na adres email.")

    const addAthlete: SubmitHandler<InputType> = async (data) => {
        console.log("Form data: ", data)
        // setButtonSpinnerVis(true)
        try {
            // const result = await registerUser(user)
            const athlete = await createAthlete({...data}) 

            if(athlete) {console.log("PROFIL DODANY: ", athlete)} else {redirect("/")}
                       
            // if (result === "success") {
            //     setInfoMessageVisible(true)
            //     setInfoMessage("Konto użytkownika zostało pomyślnie zarejestrowane. Link aktywacyjny został wysłany na adres email.")
            //     toast.success("Konto użytkownika zostało pomyślnie zarejestrowane.")
            //     toast.success("Link aktywacyjny został wysłany na adres email.")
            //     form.reset()
            //     router.push("/login")}
            // if (result === "errorUserExist") {
            //     setInfoMessageVisible(true)
            //     setInfoMessage("Konto użytkownika o tej nazwie już istnieje.")
            //     toast.error("Konto użytkownika o tej nazwie już istnieje.")
            //     setButtonSpinnerVis(false)
            // }
            // if (result === "errorEmailExist") {
            //     setInfoMessageVisible(true)
            //     setInfoMessage("Konto z tym adresem email już istnieje.")
            //     toast.error("Konto z tym adresem email już istnieje.")
            //     setButtonSpinnerVis(false)
            // }
            // if (result === "sendError") {
            //     setInfoMessageVisible(true)
            //     setInfoMessage("Wystąpił błąd podczas wysyłania wiadomości email.")
            //     toast.error("Wystąpił błąd podczas wysyłania wiadomości email.")
            //     setButtonSpinnerVis(false)
            // }
        } catch (error) {
            toast.error("Upps!. Coś poszło nie tak...")
            setButtonSpinnerVis(false)
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
                      const [teamInput, setTeamInput] = useState("");
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
                            Dodaj jeden lub więcej zespołów, do których należy zawodnik.
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
                  <FormField
                    control={form.control}
                    name="birth_day"
                    render={({ field: dayField }) => (
                      <FormField
                        control={form.control}
                        name="birth_month"
                        render={({ field: monthField }) => (
                          <FormField
                            control={form.control}
                            name="birth_year"
                            render={({ field: yearField }) => {
                              // Helper to get days in selected month/year
                              const getDaysInMonth = (month: number, year: number) => {
                                if (!month || !year) return 31;
                                return new Date(year, month, 0).getDate();
                              };

                              const selectedMonth = monthField.value || 1;
                              const selectedYear = yearField.value || new Date().getFullYear();
                              const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);

                              // Generate options
                              const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
                              const months = Array.from({ length: 12 }, (_, i) => i + 1);
                              const currentYear = new Date().getFullYear();
                              const years = Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i);

                              return (
                                <FormItem>
                                  <FormLabel>Data urodzenia</FormLabel>
                                  <FormControl>
                                    <div className="flex gap-2">
                                      <select
                                        className="border rounded px-2 py-1"
                                        value={dayField.value || ""}
                                        onChange={e => dayField.onChange(Number(e.target.value))}
                                      >
                                        <option value="">Dzień</option>
                                        {days.map(day => (
                                          <option key={day} value={day}>{day}</option>
                                        ))}
                                      </select>
                                      <select
                                        className="border rounded px-2 py-1"
                                        value={monthField.value || ""}
                                        onChange={e => {
                                          monthField.onChange(Number(e.target.value));
                                          // Reset day if out of range
                                          if (dayField.value > getDaysInMonth(Number(e.target.value), yearField.value)) {
                                            dayField.onChange("");
                                          }
                                        }}
                                      >
                                        <option value="">Miesiąc</option>
                                        {months.map(month => (
                                          <option key={month} value={month}>{month}</option>
                                        ))}
                                      </select>
                                      <select
                                        className="border rounded px-2 py-1"
                                        value={yearField.value || ""}
                                        onChange={e => {
                                          yearField.onChange(Number(e.target.value));
                                          // Reset day if out of range
                                          if (dayField.value > getDaysInMonth(monthField.value, Number(e.target.value))) {
                                            dayField.onChange("");
                                          }
                                        }}
                                      >
                                        <option value="">Rok</option>
                                        {years.map(year => (
                                          <option key={year} value={year}>{year}</option>
                                        ))}
                                      </select>
                                    </div>
                                  </FormControl>
                                  <FormDescription>
                                    Wybierz dzień, miesiąc i rok urodzenia zawodnika.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              );
                            }}
                          />
                        )}
                      />
                    )}
                  />
                  <div className="flex items-center justify-center gap-2">
                      <Button 
                          color="warning" 
                          type="submit" 
                          disabled={form.formState.isSubmitting} 
                          className="font-semibold text-lg text-white hover:-translate-y-1 cursor-pointer">
                          {form.formState.isSubmitting ? "Zapisywanie..." : "Dodaj zawodnika"}
                      </Button>
                  </div>
              </form>
          </Form>
        </>
    )
}