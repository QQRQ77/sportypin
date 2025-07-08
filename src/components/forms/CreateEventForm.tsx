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
import { createTeam } from "@/lib/teams.actions";

const FormSchema = z.object({
  name: z.string().min(3, "Nazwa wydarzenia jest zbyt krótka (minimum 3 znaki).").max(500, "Nazwa wydarzenia jest zbyt długa (maksymalnie 500 znaków)."),
  description: z.string().min(3, "Opis wydarzenia jest zbyt krótki (minimum 3 znaki).").max(5000, "Opis Wydarzenia jest zbyt długi (maksymalnie 5000 znaków).").optional(),
  sports: z.array(
    z.string()
    .min(2, "Nazwa sportu są jest zbyt krótka (minimum 2 znaki).")
    .max(100, "Nazwa sportu są zbyt długa (maksymalnie 100 znaków).")
  ).optional(),
  cathegories: z.array(
    z.string()
    .min(1, "Nazwa kategorii są jest zbyt krótka (minimum 1 znak).")
    .max(100, "Nazwa sportu są zbyt długa (maksymalnie 100 znaków).")
  ).optional(),
  start_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Data rozpoczęcia jest nieprawidłowa."}),
  end_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Data zakończenia jest nieprawidłowa."}).optional(),
  contact_email: z.string().email("Podaj poprawny adres email.").optional(),
  contact_phone: z.string()
    .regex(/^\+?\d{9,15}$/, "Numer telefonu musi zawierać od 9 do 15 cyfr i może zaczynać się od znaku +.")
    .optional(),
  city: z.string().min(3, "Nazwa miasta jest zbyt krótka (minimum 3 znaki).").max(100, "Nazwa miasta jest zbyt długa (maksymalnie 100 znaków)."),
  zip_code: z.string()
    .regex(/^\d{2}-\d{3}$/, "Kod pocztowy musi być w formacie XX-XXX, gdzie X to cyfry.")
    .optional(),
  address: z.string().min(3, "Adres jest zbyt krótki (minimum 3 znaki).").max(200, "Adres jest zbyt długi (maksymalnie 200 znaków).").optional(),
})

type InputType = z.infer<typeof FormSchema>

export default function CreateEventForm() {

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

    const addEvent: SubmitHandler<InputType> = async (data) => {

      try {
            const team = await createEvent({...data}) 

            if(team) {console.log("ZESPÓŁ DODANY: ", team)} else {redirect("/")}
                       
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
              <form onSubmit={form.handleSubmit(addEvent)} className="space-y-8">
                  <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Nazwa wydarzenia</FormLabel>
                              <FormControl>
                                  <Input placeholder="Wpisz nazwę wydarzenia" {...field} />
                              </FormControl>
                              <FormDescription>
                                  To jest nazwa wydarzenia sportowego, które dodajesz do bazy.
                              </FormDescription>
                              <FormMessage />
                          </FormItem>
                        )}
                  />

                  <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Opis wydarzenia</FormLabel>
                              <FormControl>
                                  <Input placeholder="Wpisz opis wydarzenia" {...field} />
                              </FormControl>
                              <FormDescription>
                                  To jest krótki opis wydarzenia, które dodajesz do bazy.
                              </FormDescription>
                              <FormMessage />
                          </FormItem>
                        )}
                  />

                  <FormField
                    control={form.control}
                    name="sports"
                    render={({ field }) => {
                      const [sportInput, setSportInput] = useState("");
                      const sports = field.value || [];

                      const addSport = () => {
                        const trimmed = sportInput.trim();
                        if (trimmed.length >= 3 && !sports.includes(trimmed)) {
                          field.onChange([...sports, trimmed]);
                          setSportInput("");
                        }
                      };

                      const removeSport = (sportToRemove: string) => {
                        field.onChange(sports.filter((sport: string) => sport !== sportToRemove));
                      };

                      return (
                        <FormItem>
                          <FormLabel>Rodzaj sportu na zawodach</FormLabel>
                          <FormControl>
                            <div>
                              <div className="flex gap-2 mb-2">
                                <Input
                                  value={sportInput}
                                  onChange={e => setSportInput(e.target.value)}
                                  placeholder="Dodaj zawodnika"
                                  onKeyDown={e => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      addSport();
                                    }
                                  }}
                                />
                                <Button type="button" onClick={addSport} disabled={sportInput.trim().length < 3}>
                                  Dodaj
                                </Button>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {sports.map((sport: string, idx: number) => (
                                  <span key={idx} className="flex items-center bg-gray-200 px-2 py-1 rounded">
                                    {sport}
                                    <button
                                      type="button"
                                      className="ml-1 text-red-500 hover:text-red-700"
                                      onClick={() => removeSport(sport)}
                                      aria-label={`Usuń ${sport}`}
                                    >
                                      ×
                                    </button>
                                  </span>
                                ))}
                              </div>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Dodaj jeden lub więcej sportów na zawodach.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />

                  <FormField
                    control={form.control}
                    name="cathegories"
                    render={({ field }) => {
                      const [cathegoryInput, setCathegoryInput] = useState("");
                      const cathegories = field.value || [];

                      const addCathegory = () => {
                        const trimmed = cathegoryInput.trim();
                        if (trimmed.length >= 3 && !cathegories.includes(trimmed)) {
                          field.onChange([...cathegories, trimmed]);
                          setCathegoryInput("");
                        }
                      };

                      const removeCathegory = (cathegoryToRemove: string) => {
                        field.onChange(cathegories.filter((sport: string) => sport !== cathegoryToRemove));
                      };

                      return (
                        <FormItem>
                          <FormLabel>Kategoria sportu na zawodach</FormLabel>
                          <FormControl>
                            <div>
                              <div className="flex gap-2 mb-2">
                                <Input
                                  value={cathegoryInput}
                                  onChange={e => setCathegoryInput(e.target.value)}
                                  placeholder="Dodaj kategorie"
                                  onKeyDown={e => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      addCathegory();
                                    }
                                  }}
                                />
                                <Button type="button" onClick={addCathegory} disabled={cathegoryInput.trim().length < 3}>
                                  Dodaj
                                </Button>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {cathegories.map((cathegory: string, idx: number) => (
                                  <span key={idx} className="flex items-center bg-gray-200 px-2 py-1 rounded">
                                    {cathegory}
                                    <button
                                      type="button"
                                      className="ml-1 text-red-500 hover:text-red-700"
                                      onClick={() => removeCathegory(cathegory)}
                                      aria-label={`Usuń ${cathegory}`}
                                    >
                                      ×
                                    </button>
                                  </span>
                                ))}
                              </div>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Dodaj jeden lub więcej kategorii sportu na zawodach.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />

                  <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Miasto - </FormLabel>
                              <FormControl>
                                  <Input placeholder="Wpisz miasto" {...field} />
                              </FormControl>
                              <FormDescription>
                                  To jest miasto, w którym zespół ma swoją siedzibę.
                              </FormDescription>
                              <FormMessage />
                          </FormItem>
                  )}
                  />
                  <FormField
                      control={form.control}
                      name="zip_code"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Kod pocztowy miasta - siedziby</FormLabel>
                              <FormControl>
                                  <Input placeholder="Wpisz kod pocztowy: XX-XXX" {...field} />
                              </FormControl>
                              <FormDescription>
                                  To jest kod pocztowy miasta, w którym zespół ma swoją siedzibę.
                              </FormDescription>
                              <FormMessage />
                          </FormItem>
                       )}
                  />
                  
                  <div className="flex items-center justify-center gap-2">
                      <Button 
                          color="warning" 
                          type="submit" 
                          disabled={form.formState.isSubmitting} 
                          className="font-semibold text-lg text-white hover:-translate-y-1 cursor-pointer">
                          {form.formState.isSubmitting ? "Zapisywanie..." : "Dodaj zespół"}
                      </Button>
                  </div>
              </form>
          </Form>
        </>
    )
}