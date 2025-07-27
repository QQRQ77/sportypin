'use client'

import z from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "../ui/button"
import { useState } from "react"
import { Input } from "../ui/input"
import SearchButton from "../ui/submitButton"
import { searchVenuesRanked } from "@/lib/venue.actions"

const FormSchema = z.object({
  name: z.string().min(3, "Nazwa obiektu jest zbyt krótka (minimum 3 znaki).").max(200, "Nazwa obiektu jest zbyt długa (maksymalnie 200 znaków).").optional(),
  address: z.string().min(3, "Adres obiektu jest zbyt krótki (minimum 3 znaki).").max(200, "Adres obiektu jest zbyt długi (maksymalnie 200 znaków).").optional(),
})

type InputType = z.infer<typeof FormSchema>

export default function VenueSearchFormAndCards() {
    const form = useForm<InputType>({
          resolver: zodResolver(FormSchema)
      });
    
    const [submitButtonDisactive, setSubmitButtonDisactive] = useState(false);
    const [venueData, setVenueData] = useState([])

    const searchVenues: SubmitHandler<InputType> = async (data) => {
      setSubmitButtonDisactive(true);

      const result = await searchVenuesRanked(data.name, data.address)

      console.log("Search Data: ", result)

      setSubmitButtonDisactive(false);


    }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(searchVenues)} className="space-y-8">
          <div className="flex flex-row flex-wrap justify-center gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                  <FormItem>
                      <FormLabel>Opis obiektu sportowego</FormLabel>
                      <FormControl>
                          <Input placeholder="Wpisz nazwę obiektu, rodzaj sportu" {...field} />
                      </FormControl>
                      <FormDescription>
                          Podaj nazwę lub rodzaj obiektu sportowego, sport jakiego szukasz itp.
                      </FormDescription>
                      <FormMessage />
                  </FormItem>
                )}
            />

          <FormLabel>i / lub</FormLabel>

          <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                  <FormItem>
                      <FormLabel>Adres obiektu sportowego</FormLabel>
                      <FormControl>
                          <Input placeholder="Wpisz adres obiektu" {...field} />
                      </FormControl>
                      <FormDescription>
                          Podaj adres lub miasto lub kod pocztowy obiektu sportowego.
                      </FormDescription>
                      <FormMessage />
                  </FormItem>
                )}
          />
          </div>

          <div className="flex items-center justify-center">
            <SearchButton 
              isSubmitting={form.formState.isSubmitting || submitButtonDisactive}
              baseText="Wyszukaj obiekt"
              submittingText="Wyszukiwanie..." />
          </div>
      </form>
    </Form>
  )
}