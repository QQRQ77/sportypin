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
import { createEvent } from "@/lib/events.actions";

const FormSchema = z.object({
  name: z.string().min(3, "Nazwa wydarzenia jest zbyt krótka (minimum 3 znaki).").max(500, "Nazwa wydarzenia jest zbyt długa (maksymalnie 200 znaków)."),
  event_type: z.string().min(3, "Typ wydarzenia jest zbyt krótki (minimum 3 znaki).").max(100, "Typ wydarzenia jest zbyt długi (maksymalnie 100 znaków).").optional(),
  description: z.string().min(3, "Opis wydarzenia jest zbyt krótki (minimum 3 znaki).").max(5000, "Opis Wydarzenia jest zbyt długi (maksymalnie 5000 znaków).").optional(),
  organizator: z.string().min(3, "Nazwa organizatora jest zbyt krótka (minimum 3 znaki).").max(100, "Nazwa organizatora jest zbyt długa (maksymalnie 100 znaków).").optional(),
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
  place_name: z.string().min(3, "Nazwa obiektu jest zbyt krótka (minimum 3 znaki).").max(200, "Nazwa obiektu jest zbyt długa (maksymalnie 200 znaków).").optional(),
})

type InputType = z.infer<typeof FormSchema>

export default function CreateEventForm() {

    const form = useForm<InputType>({
        resolver: zodResolver(FormSchema)
    });

    const router = useRouter();

    const [submitButtonDisactive, setSubmitButtonDisactive] = useState(false);
    const [sportInput, setSportInput] = useState("");
    const [cathegoryInput, setCathegoryInput] = useState("");

    const addEvent: SubmitHandler<InputType> = async (data) => {

      setSubmitButtonDisactive(true);

      if (sportInput != "") {
          const trimmed = sportInput.trim();
          if (trimmed.length >= 3 && !data.sports?.includes(trimmed)) {
            data.sports = [...(data.sports || []), trimmed];
            setSportInput("");
          } else {
            toast.error("Nazwa zespołu musi mieć co najmniej 3 znaki i nie może być duplikatem.");
            return;
          }
      }

      if (cathegoryInput != "") {
          const trimmed = cathegoryInput.trim();
          if (trimmed.length >= 3 && !data.cathegories?.includes(trimmed)) {
            data.cathegories = [...(data.cathegories || []), trimmed];
            setCathegoryInput("");
          } else {
            toast.error("Nazwa kategorii musi mieć co najmniej 3 znaki i nie może być duplikatem.");
            return;
          }
      }

      try {
            if (data.start_date) {
                  data.start_date = new Date(data.start_date).toISOString();
                }
                if (data.end_date) {
                  data.end_date = new Date(data.end_date).toISOString();
                }
            
          console.log("dane eventu: ", data);
            const event = await createEvent({...data})
            
            if(event) {router.push(`/events/${event.id}`)} else {router.push("/")}
                       
        } catch (error) {
            setSubmitButtonDisactive(false);
            toast.error("Upps!. Coś poszło nie tak...")
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
                      name="event_type"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Rodzaj wydarzenia</FormLabel>
                              <FormControl>
                                  <Input placeholder="Wpisz rodzaj wydarzenia np. turniej, mecz, wyścig" {...field} />
                              </FormControl>
                              <FormDescription>
                                  To jest rodzaj wydarzenia, które dodajesz do bazy.
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
                                  placeholder="Dodaj sport"
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
                                  placeholder="Dodaj kategorię"
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
                      name="place_name"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Nazwa obiektu</FormLabel>
                              <FormControl>
                                  <Input placeholder="Wpisz nazwę obiektu" {...field} />
                              </FormControl>
                              <FormDescription>
                                  To jest nazwa obiektu, w którym odbywają się zawody.
                              </FormDescription>
                              <FormMessage />
                          </FormItem>
                  )}
                  />

                  <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Miasto</FormLabel>
                              <FormControl>
                                  <Input placeholder="Wpisz miasto" {...field} />
                              </FormControl>
                              <FormDescription>
                                  To jest miasto, w którym odbywają się zawody.
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
                              <FormLabel>Kod pocztowy miasta</FormLabel>
                              <FormControl>
                                  <Input placeholder="Wpisz kod pocztowy: XX-XXX" {...field} />
                              </FormControl>
                              <FormDescription>
                                  To jest kod pocztowy miasta, w którym odbywają się zawody.
                              </FormDescription>
                              <FormMessage />
                          </FormItem>
                       )}
                  />

                  <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Ulica i numer</FormLabel>
                              <FormControl>
                                  <Input placeholder="Wpisz ulicę i numer" {...field} />
                              </FormControl>
                              <FormDescription>
                                  To jest dokładny adres miejsca, gdzie odbędą się zawody.
                              </FormDescription>
                              <FormMessage />
                          </FormItem>
                        )}
                  />

                  <FormField
                      control={form.control}
                      name="start_date"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Data i godzina rozpoczęcia</FormLabel>
                              <FormControl>
                                  <Input type="datetime-local" placeholder="Wybierz datę i godzinę rozpoczęcia" {...field} />
                              </FormControl>
                              <FormDescription>
                                  To jest data i godzina rozpoczęcia wydarzenia.
                              </FormDescription>
                              <FormMessage />
                          </FormItem>
                        )}
                  />

                  <FormField
                      control={form.control}
                      name="end_date"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Data i godzina zakończenia</FormLabel>
                              <FormControl>
                                  <Input type="datetime-local" placeholder="Wybierz datę i godzinę zakończenia" {...field} />
                              </FormControl>
                              <FormDescription>
                                  To jest data i godzina zakończenia wydarzenia.
                              </FormDescription>
                              <FormMessage />
                          </FormItem>
                        )}
                  />
                  
                  <FormLabel>Kontakt z organizatorem</FormLabel>

                    <FormField
                      control={form.control}
                      name="organizator"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Organizator</FormLabel>
                              <FormControl>
                                  <Input placeholder="Wpisz organizatora wydarzenia" {...field} />
                              </FormControl>
                              <FormDescription>
                                  To jest nazwa/dane organizatora.
                              </FormDescription>
                              <FormMessage />
                          </FormItem>
                        )}
                  />

                  <FormField
                      control={form.control}
                      name="contact_email"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Adres email</FormLabel>
                              <FormControl>
                                  <Input type="email" placeholder="Wpisz adres email" {...field} />
                              </FormControl>
                              <FormDescription>
                                  To jest adres email do kontaktu z organizatorem.
                              </FormDescription>
                              <FormMessage />
                          </FormItem>
                        )}
                  />
                  <FormField
                      control={form.control}
                      name="contact_phone"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Numer telefonu</FormLabel>
                              <FormControl>
                                  <Input type="tel" placeholder="Wpisz numer telefonu" {...field} />  
                              </FormControl>
                              <FormDescription>
                                  To jest numer telefonu do kontaktu z organizatorem.
                              </FormDescription>
                              <FormMessage />
                          </FormItem>
                        )}
                  />
                  
                  <div className="flex items-center justify-center gap-2">
                      <Button 
                          color="warning" 
                          type="submit" 
                          disabled={form.formState.isSubmitting || submitButtonDisactive} 
                          className="font-semibold text-lg text-white hover:-translate-y-1 cursor-pointer">
                          {form.formState.isSubmitting ? "Zapisywanie..." : "Dodaj wydarzenie"}
                      </Button>
                  </div>
              </form>
          </Form>
        </>
    )
}