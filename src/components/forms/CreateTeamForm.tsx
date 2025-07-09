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
  name: z.string().min(3, "Nazwa zespołu jest zbyt krótka (minimum 3 znaki).").max(50, "Nazwa zespołu jest zbyt długa (maksymalnie 50 znaków)."),
  host_city: z.string().min(3, "Nazwa miasta jest zbyt krótka (minimum 3 znaki).").max(50, "Nazwa miasta jest zbyt długa (maksymalnie 50 znaków).").optional(),
  members: z.array(
    z.string()
    .min(3, "Dane zawodnika są jest zbyt krótkie (minimum 3 znaki).")
    .max(99, "Dane zawodnika są zbyt długie (maksymalnie 99 znaków).")
  ).optional(),
  zip_code: z.string()
    .regex(/^\d{2}-\d{3}$/, "Kod pocztowy musi być w formacie XX-XXX, gdzie X to cyfry.")
    .optional()
})

type InputType = z.infer<typeof FormSchema>

export default function CreateTeamForm() {

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

    const addTeam: SubmitHandler<InputType> = async (data) => {
        console.log("Form data: ", data)
        // setButtonSpinnerVis(true)
        try {
            const team = await createTeam({...data}) 

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
              <form onSubmit={form.handleSubmit(addTeam)} className="space-y-8">
                  <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Nazwa zespołu</FormLabel>
                              <FormControl>
                                  <Input placeholder="Wpisz nazwę zespołu" {...field} />
                              </FormControl>
                              <FormDescription>
                                  To jest nazwa zespołu, który dodajesz do bazy.
                              </FormDescription>
                              <FormMessage />
                          </FormItem>
                  )}
                  />
                  <FormField
                      control={form.control}
                      name="host_city"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Miasto - siedziba zespołu</FormLabel>
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
                  <FormField
                    control={form.control}
                    name="members"
                    render={({ field }) => {
                      const [memberInput, setMemberInput] = useState("");
                      const members = field.value || [];

                      const addMember = () => {
                        const trimmed = memberInput.trim();
                        if (trimmed.length >= 3 && !members.includes(trimmed)) {
                          field.onChange([...members, trimmed]);
                          setMemberInput("");
                        }
                      };

                      const removeMember = (memberToRemove: string) => {
                        field.onChange(members.filter((member: string) => member !== memberToRemove));
                      };

                      return (
                        <FormItem>
                          <FormLabel>Zawodnicy</FormLabel>
                          <FormControl>
                            <div>
                              <div className="flex gap-2 mb-2">
                                <Input
                                  value={memberInput}
                                  onChange={e => setMemberInput(e.target.value)}
                                  placeholder="Dodaj zawodnika"
                                  onKeyDown={e => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      addMember();
                                    }
                                  }}
                                />
                                <Button type="button" onClick={addMember} disabled={memberInput.trim().length < 3}>
                                  Dodaj
                                </Button>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {members.map((member: string, idx: number) => (
                                  <span key={idx} className="flex items-center bg-gray-200 px-2 py-1 rounded">
                                    {member}
                                    <button
                                      type="button"
                                      className="ml-1 text-red-500 hover:text-red-700"
                                      onClick={() => removeMember(member)}
                                      aria-label={`Usuń ${member}`}
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