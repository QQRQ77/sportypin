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
import { sanitizeStrings } from "@/lib/utils";

const FormSchema = z.object({
  name: z.string().min(3, "Nazwa zespołu jest zbyt krótka (minimum 3 znaki).").max(50, "Nazwa zespołu jest zbyt długa (maksymalnie 50 znaków)."),
  host_city: z.string().min(3, "Nazwa miasta jest zbyt krótka (minimum 3 znaki).").max(50, "Nazwa miasta jest zbyt długa (maksymalnie 50 znaków).").optional(),
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
  contact_email: z.string().email("Podaj poprawny adres email.").optional(),
  contact_phone: z.string()
    .regex(/^\+?\d{9,15}$/, "Numer telefonu musi zawierać od 9 do 15 cyfr i może zaczynać się od znaku +.").optional(),  
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
    const logoImageInputRef = useRef<HTMLInputElement>(null)

    const router = useRouter();

    const [submitButtonDisactive, setSubmitButtonDisactive] = useState(false);
    const [imageUrls, setImageUrls] = useState<string[]>([])
    const [logoImageUrl, setLogoImageUrl] = useState<string[]>([])
    const [imageError, setImageError] = useState<string>("")
    const [logoImageError, setLogoImageError] = useState<string>("")
    const [memberInput, setMemberInput] = useState("");
    const [sportInput, setSportInput] = useState("");
    const [cathegoryInput, setCathegoryInput] = useState("");
        
    const addTeam: SubmitHandler<InputType> = async (data) => {

        setSubmitButtonDisactive(true);
        const cleanedData = sanitizeStrings(data);
        data = {...cleanedData};

        if (memberInput != "") {
            const trimmed = memberInput.trim();
            if (trimmed.length >= 3 && !data.members?.includes(trimmed)) {
              data.members = [...(data.members || []), trimmed];
              setMemberInput("");
            } else {
              toast.error("Dane zawodnika muszą mieć co najmniej 3 znaki i nie może być duplikatem.");
              return;
            }
        }

        if (sportInput != "") {
            const trimmed = sportInput.trim();
            if (trimmed.length >= 3 && !data.sports?.includes(trimmed)) {
              data.sports = [...(data.sports || []), trimmed];
              setSportInput("");
            } else {
              toast.error("Nazwa sportu musi mieć co najmniej 3 znaki i nie może być duplikatem.");
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

        const urls = [];
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

        const logoUrls = [];
        if (logoImageUrl.length > 0) {
          const logoFile = await convertBlobUrlToFile(logoImageUrl[0]);
          const { imageUrl, error } = await uploadImage({
            file: logoFile,
            bucket: "sportpin",
            folder: "teams/logo"
          });

          if (error) {
            console.error(error);
            return;
          }

          logoUrls.push(imageUrl);}


        try {
            const team = await createTeam({...data, imageUrls: urls, logoUrl: logoUrls.length > 0 ? logoUrls[0] : undefined});
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

    const handleLogoImageChange = (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      const remainingSlots = 1 - imageUrls.length;
      if (remainingSlots <= 0) return;

      const validFiles = Array.from(files)
        .filter((f) => {
          const ok = f.size <= MAX_UPLOADED_FILE_SIZE
          if (!ok) setLogoImageError(`${f.name} przekracza 1 MB i zostanie pominięte.`);
          return ok;
        })
        .slice(0, remainingSlots);

      validFiles.forEach((file) => {
        const url = URL.createObjectURL(file);
        setLogoImageUrl((prev) => [...prev, url]);
      });

      e.target.value = ""; // reset inputa   
    }
        
    const removeImage = (index: number) => {
      setLogoImageUrl((prev) => prev.filter((_, i) => i !== index));
    };

    const removeLogoImage = (index: number) => {
      setLogoImageUrl((prev) => prev.filter((_, i) => i !== index));
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

                  {/* logo zespołu - opcjonalne */}
                  <div className="w-full flex flex-col gap-2 justify-center">
                    <input type="file" hidden multiple ref={logoImageInputRef} onChange={handleLogoImageChange}/>
                    {logoImageUrl.length > 0 && <div className="flex justify-center mx-auto">
                        <div className="relative">
                          <Image
                            src={logoImageUrl[0]}
                            alt={`team-logo`}
                            width={300}
                            height={300}
                            className="object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={(e) => {e.preventDefault(); removeLogoImage(0)}}
                            className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/80 cursor-pointer"
                            aria-label="Usuń logo"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </div>
                    </div>}
                    <p className="text-red-700 text-center">{logoImageError}</p>
                    <Button className="mx-auto cursor-pointer" onClick={(e) => {e.preventDefault(); logoImageInputRef.current?.click()}}>Dodaj logo</Button>
                    <p className="text-center">Max. rozmiar pliku: 1MB</p>
                  </div>

                  {/* zdjęcia zespołu - opcjonalne */}
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
                          <FormLabel>Rodzaj uprawianego sportu</FormLabel>
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
                            Dodaj jeden lub więcej uprawianych sportów.
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
                          <FormLabel>Kategoria sportowa</FormLabel>
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
                  {/* <FormField
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
                  /> */}
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
                                To jest adres email do kontaktu z zespołem.
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
                                To jest numer telefonu do kontaktu z zespołem.
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
                          {(form.formState.isSubmitting || submitButtonDisactive) ? "Zapisywanie..." : "Dodaj zespół"}
                      </Button>
                  </div>
              </form>
          </Form>
        </>
    )
}