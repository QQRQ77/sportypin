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
import { useState } from "react"
import { Input } from "../ui/input"
import SearchButton from "../ui/submitButton"
import { searchVenuesRanked } from "@/lib/venue.actions"
import VenueList from "../VenueList"
import MultipleMarkersMap from "../GoogleMapsComponent"

const FormSchema = z.object({
  name: z.string().min(3, "Nazwa obiektu jest zbyt krótka (minimum 3 znaki).").max(200, "Nazwa obiektu jest zbyt długa (maksymalnie 200 znaków).").optional(),
})

type InputType = z.infer<typeof FormSchema>

interface VenueSearchProps {
  userId?: string | null;
}

export default function VenueSearchFormAndCards({ userId }: VenueSearchProps) {
    const form = useForm<InputType>({
          resolver: zodResolver(FormSchema)
      });
    
    const [submitButtonDisactive, setSubmitButtonDisactive] = useState(false);
    const [venueData, setVenueData] = useState([])

    const searchVenues: SubmitHandler<InputType> = async (data) => {
      setSubmitButtonDisactive(true);

      const result = await searchVenuesRanked(data.name)

      if (result) setVenueData(result)

      console.log(result)

      setSubmitButtonDisactive(false);


    }
  
  return (
    <div className="w-full flex justify-center flex-col gap-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(searchVenues)} className="space-y-8 w-full">
            <div className="w-full flex flex-row flex-wrap justify-center gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem className="w-full">
                        <FormControl>
                          <div className="relative w-full">
                            <Input placeholder="Wpisz nazwę obiektu, rodzaj sportu, adres ..." {...field} className="w-full h-10 rounded-full shadow-xl text-xl border-2"/>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                              <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </FormControl>
                        <FormDescription className="pl-5">
                            Podaj nazwę lub rodzaj obiektu sportowego, sport jakiego szukasz, lokalizację, adres itp.
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
      <div className='w-full flex justify-center'>
        <MultipleMarkersMap events={venueData}/>
      </div>
      <VenueList venues={venueData} userId={userId}/>
    </div>
    
  )
}