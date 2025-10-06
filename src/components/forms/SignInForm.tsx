"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Spinner } from "@heroui/spinner";
import { Tooltip } from "@heroui/tooltip";


import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import Link from "next/link"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";

  const formSchema = z.object({
      email: z.string().email("Proszę podać poprawny adres email."),
      password: z.string({
        required_error: "Proszę podać hasło.",
      }),
    });


  export default function LoginForm() {

    const [visiblePass, setVisiblePass] = useState(false);
    const buttonsVis = true;
    
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        email: "",
        password: ""
      },
    })
  
    function onSubmit(values: z.infer<typeof formSchema>) {
      // Do something with the form values.
      // ✅ This will be type-safe and validated.
      console.log(values)
    }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adres email</FormLabel>
              <FormControl>
                <Input placeholder="Wpisz swój email" {...field} />
              </FormControl>
              <FormDescription>
                To jest adres email, którego używasz do logowania.
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
        <div className="flex items-center justify-center gap-2">
          {buttonsVis ? 
            <>
              <Button 
                color="warning" 
                type="submit" 
                disabled={form.formState.isSubmitting} 
                className="font-semibold text-lg text-white hover:-translate-y-1 cursor-pointer">
                  {form.formState.isSubmitting ? "Logowanie..." : "Zaloguj się"}
              </Button>
            </> :
            <Spinner
              color="warning"
              size="lg"
            />}
        </div>
        <div className="w-full flex justify-center items-center gap-2">
          <p className="text-gray-500">Nie masz jeszcze konta?</p>
          <Link href="/register">
            <p className="underline text-blue-500 hover:text-blue-700 cursor-pointer">Zarejestruj się</p>
          </Link>
        </div>
      </form>
    </Form>
  )
}
