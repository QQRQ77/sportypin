'use client'

import { EnvelopeIcon, EyeIcon, EyeSlashIcon, KeyIcon, UserIcon } from "@heroicons/react/20/solid"
import { useEffect, useState } from "react";
import { z } from "zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordStrength } from "check-password-strength";
// import { registerUser } from "@/lib/actions/authActions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
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

const FormSchema = z.object({
    name: z.string().min(3, "Nazwa użytkownika jest zbyt krótka (minimum 3 znaki).").max(50, "Nazwa użytkownika jest zbyt długa (maksymalnie 50 znaków)."),
    email: z.string().email("Proszę podać poprawny adres email!"),
    password: z.string().min(6, "Hasło jest zbyt krótkie (minimum 6 znaków).").max(50, "Hasło jest zbyt długie (max. 50 znaków)."),
    confirmPassword: z.string().min(6, "Hasło jest zbyt krótkie (minimum 6 znaków).").max(50, "Hasło jest zbyt długie (max. 50 znaków)."),
    accepted: z.literal(true, {
        errorMap: () => ({ message: "Proszę zaakceptować warunki regulaminu." }) 
    })  
}).refine(data=>data.password === data.confirmPassword, {
    message: "Hasło i potwierdzenie hasła muszą być takie same!",
    path: ["confirmPassword"]
})

type InputType = z.infer<typeof FormSchema>

export default function SignUpForm() {

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

    const password = form.watch("password")

    useEffect(() => {
        setPassStrength(passwordStrength(password || "").id);
        }, [password]);

    // useEffect(() => {
    //     setPassStrength(watch()?.password?.length ? passwordStrength(watch().password || "").id : 0);
    // }, [watch().password, watch]);

    const togglePasswordVisibility = () => {setIsPassVisible(prev=>!prev)}

    const saveUser: SubmitHandler<InputType> = async (data) => {
        console.log("Form data: ", data)
        const {confirmPassword, accepted, ...user} = data
        setButtonSpinnerVis(true)
        try {
            // const result = await registerUser(user)
            const result = "success"

            
            if (result === "success") {
                setInfoMessageVisible(true)
                setInfoMessage("Konto użytkownika zostało pomyślnie zarejestrowane. Link aktywacyjny został wysłany na adres email.")
                toast.success("Konto użytkownika zostało pomyślnie zarejestrowane.")
                toast.success("Link aktywacyjny został wysłany na adres email.")
                form.reset()
                router.push("/login")}
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
            <form onSubmit={form.handleSubmit(saveUser)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nazwa użytkownika</FormLabel>
                            <FormControl>
                                <Input placeholder="Wpisz swoją nazwę użytkownika" {...field} />
                            </FormControl>
                            <FormDescription>
                                To jest nazwa użytkownika, której będziesz używał w aplikacji.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Adres email</FormLabel>
                            <FormControl>
                                <Input placeholder="Wpisz swój adres email" {...field} />
                            </FormControl>
                            <FormDescription>
                                To jest adres email, którego będziesz używał do logowania się w aplikacji.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Hasło</FormLabel>
                        <FormControl>
                            <div className="w-full flex items-center juistify-between gap-2">
                            <Input type={visiblePass ? "text" : "password"} placeholder="Wpisz hasło" {...field} />
                            <Tooltip
                                showArrow={true}
                                placement="bottom"
                                content={<span className="text-black text-sm">
                                        {visiblePass ? "Ukryj hasło" : "Pokaż hasło"}
                                        </span>}
                            >
                                <button type="button" onClick={() => setVisiblePass((prev) => !prev)}>
                                {visiblePass ? <EyeSlashIcon className="w-6 cursor-pointer" /> : <EyeIcon className="w-6 cursor-pointer" />}
                                </button>
                            </Tooltip> 
                            </div>
                        </FormControl>
                        <FormDescription>
                            To jest twoje hasło do logowania.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <PassStrengthBar passStrength={passStrength}/>
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Potwierdź hasło</FormLabel>
                            <FormControl>
                                <div className="w-full flex items-center juistify-between gap-2">
                                    <Input type={visiblePass ? "text" : "password"} placeholder="Potwiedź hasło" {...field} />
                                    <Tooltip
                                        showArrow={true}
                                        placement="top"
                                        content={<span className="text-black text-sm">
                                                {visiblePass ? "Ukryj hasło" : "Pokaż hasło"}
                                                </span>}
                                    >
                                        <button type="button" onClick={() => setVisiblePass((prev) => !prev)}>
                                        {visiblePass ? <EyeSlashIcon className="w-6 cursor-pointer" /> : <EyeIcon className="w-6 cursor-pointer" />}
                                        </button>
                                    </Tooltip> 
                                </div>
                            </FormControl>
                            <FormDescription>
                                Potwierdź swoje hasło, aby upewnić się, że jest poprawne.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="accepted"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center gap-2">
                            <FormControl>
                                <Checkbox
                                    className="w-6 h-6 border-2 border-gray-500 rounded-md focus:ring-2 focus:ring-black"
                                    onCheckedChange={field.onChange}
                                    checked={field.value}
                                />
                            </FormControl>
                            <FormLabel className="text-base font-normal">
                                <span className="w-full">Akceptuje warunki</span><Link href="/regulations" className="hover:text-blue-500 text-gray-700 underline">regulaminu</Link>
                            </FormLabel>
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
                        {form.formState.isSubmitting ? "Rejestrowanie..." : "Zarejestruj się"}
                    </Button>
                </div>
                <div className="w-full flex justify-center items-center gap-2">
                <p className="text-gray-500">Masz już konto?</p>
                <Link href="/login">
                    <p className="underline text-blue-500 hover:text-blue-700 cursor-pointer">Zaloguj się</p>
                </Link>
                </div>
            </form>
        </Form>
        </>
        
    )
}