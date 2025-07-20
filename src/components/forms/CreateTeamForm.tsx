'use client'

import { XMarkIcon } from "@heroicons/react/20/solid"
import { ChangeEvent, useRef, useState } from "react";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
import { createTeam } from "@/lib/teams.actions";
import { convertBlobUrlToFile } from "@/lib/file.actions";
import { uploadImage } from "@/lib/supabase.storage";
import { MAX_FILES_UPLOADED, MAX_UPLOADED_FILE_SIZE } from "@/lib/settings";

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

    const imageInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter();

    const [submitButtonDisactive, setSubmitButtonDisactive] = useState(false);
    const [imageUrls, setImageUrls] = useState<string[]>([])
    const [imageError, setImageError] = useState<string>("")
    const [memberInput, setMemberInput] = useState("");
        
    const addTeam: SubmitHandler<InputType> = async (data) => {

        setSubmitButtonDisactive(true);

        if (memberInput != "") {
            const trimmed = memberInput.trim();
            if (trimmed.length >= 3 && !data.members?.includes(trimmed)) {
              data.members = [...(data.members || []), trimmed];
              setMemberInput("");
            } else {
              toast.error("Nazwa zespołu musi mieć co najmniej 3 znaki i nie może być duplikatem.");
              return;
            }
        }

        let urls = [];
        for (const url of imageUrls) {
          const imageFile = await convertBlobUrlToFile(url);

          const { imageUrl, error } = await uploadImage({
            file: imageFile,
            bucket: "sportpin",
            folder: "teams"
          });

          if (error) {
            console.error(error);
            return;
          }

          urls.push(imageUrl);
        }


        try {
            const team = await createTeam({...data, imageUrls: urls}) 

            if(team) {router.push(`/teams/${team.id}`)} else {router.push("/")}

        } catch (error) {
            setSubmitButtonDisactive(false);
            toast.error("Upps!. Coś poszło nie tak...")
            console.error(error)
        }
    } 

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
          const files = e.target.files;
          if (!files) return;
    
          const remainingSlots = MAX_FILES_UPLOADED - imageUrls.length;
          if (remainingSlots <= 0) return;
    
          const validFiles = Array.from(files)
            .filter((f) => {
              const ok = f.size <= MAX_UPLOADED_FILE_SIZE
              if (!ok) setImageError(`${f.name} przekracza 1 MB i zostanie pominięte.`);
              return ok;
            })
            .slice(0, remainingSlots);
    
          validFiles.forEach((file) => {
            const url = URL.createObjectURL(file);
            setImageUrls((prev) => [...prev, url]);
          });
    
          e.target.value = ""; // reset inputa   
        }
        
        const removeImage = (index: number) => {
          setImageUrls((prev) => prev.filter((_, i) => i !== index));
        };

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

                  <div className="w-full flex flex-col gap-2 justify-center">
                    <input type="file" hidden multiple ref={imageInputRef} onChange={handleImageChange}/>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 place-items-center">
                      {imageUrls.map((url, index)=> 
                        <div key={index} className="relative">
                          <Image
                            src={url}
                            alt={`image-${index}`}
                            width={300}
                            height={300}
                            className="object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={(e) => {e.preventDefault(); removeImage(index)}}
                            className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/80 cursor-pointer"
                            aria-label="Usuń zdjęcie"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-red-700 text-center">{imageError}</p>
                    <Button className="mx-auto cursor-pointer" onClick={(e) => {e.preventDefault(); imageInputRef.current?.click()}}>Dodaj zdjęcia</Button>
                    <p className="text-center">( Max. ilość zdjęć: 5<span className="ml-4">Max. rozmiar pliku: 1MB )</span></p>
                  </div>

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
                            Dodaj jednego lub więcej zawodników, którzy należą do klubu.
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
                          disabled={form.formState.isSubmitting || submitButtonDisactive} 
                          className="font-semibold text-lg text-white hover:-translate-y-1 cursor-pointer">
                          {(form.formState.isSubmitting || submitButtonDisactive) ? "Zapisywanie..." : "Dodaj zespół"}
                      </Button>
                  </div>
              </form>
          </Form>
        </>
    )
}