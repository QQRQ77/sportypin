'use client';

import { HarmonogramItem } from "@/types";

import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { addMinutesToTime, minutesBetween } from "@/lib/utils";
import { saveHarmonogram } from "@/lib/events.actions";
import { CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useState } from "react";

const timeRegex = /^([0-1]\d|2[0-3]):([0-5]\d)$/;

const FormSchema = z.object({
  description: z.string().min(3).max(200),
  start_time: z
    .string()
    .regex(timeRegex, "HH:MM")
    .or(z.literal("")),
  end_time: z
    .string()
    .regex(timeRegex, "HH:MM")
    .or(z.literal("")),
}).superRefine((val, ctx) => {
  if (val.start_time && val.end_time) {
    const diff = minutesBetween(val.start_time, val.end_time);
    if (diff <= 0) {
      ctx.addIssue({
        code: "custom",
        path: ["end_time"],
        message: "Godzina końca musi być późniejsza niż startu",
      });
    }
  }
});

type FormValues = z.infer<typeof FormSchema>;

interface HarmonogramFormProps {
  items: HarmonogramItem[];
  itemIdx: number;
  eventId: string;
  setItems: React.Dispatch<React.SetStateAction<HarmonogramItem[]>>;
  onClose: () => void;
}

export default function HarmonogramItemEditForm({ items, itemIdx, eventId, setItems, onClose }: HarmonogramFormProps) {
  
  const item = items[itemIdx];

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [showModalPromise, setShowModalPromise] = useState<((value: unknown) => void) | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      description: item.description,
      start_time: item.start_time,
      end_time: item.end_time,
    },
  });

  const confirmAction = () => {
    return new Promise((resolve) => {
      setShowModalPromise(() => resolve);
      setIsModalVisible(true);
    });
  };

  const handleSubmit: SubmitHandler<FormValues> = async (data) => {
    // Update the item with new values
    const updatedItem = {
        ...item,
        ...data,
      };
    
    if (item.start_time === data.start_time && item.end_time === data.end_time && item.description === data.description) return;
    
    if (minutesBetween(data.start_time, item.start_time) != 0 && minutesBetween(data.end_time, item.end_time) === 0) {
      setSubmitMessage("Zmiana czasu rozpoczęcia. Czy poprawić czas zakończenia?");
      const userConfirmed = await confirmAction();
      if (userConfirmed) {
        updatedItem.end_time = addMinutesToTime(data.start_time, item.end_time ? minutesBetween(item.start_time, item.end_time) : 0);
        form.setValue("end_time", updatedItem.end_time);
        setSubmitMessage("Czy chcesz zmienić automatycznie pozostałe punkty harmonogramu?");
        const userConfirmed = await confirmAction();
        if (userConfirmed) {
          const pastItems = items.map((i, idx) => {
            if (idx < itemIdx) {
              i.start_time = addMinutesToTime(i.start_time, minutesBetween(item.start_time, data.start_time));
              i.end_time = addMinutesToTime(i.end_time, minutesBetween(item.start_time, data.start_time));
              return i
            }
          });
          const futureItems = items.map((i, idx) => {
            if (idx > itemIdx) {
              i.start_time = addMinutesToTime(i.start_time, minutesBetween(item.start_time, data.start_time));
              i.end_time = addMinutesToTime(i.end_time, minutesBetween(item.start_time, data.start_time));
              return i
            }
          });
          const newItems = [...pastItems, updatedItem, ...futureItems].filter((i): i is HarmonogramItem => i !== undefined);
          setItems(newItems); 
          saveHarmonogram(eventId, newItems);
          onClose();
          return;
        }
      } else {
          setSubmitMessage("Czy chcesz zmienić automatycznie wcześniejsze punkty harmonogramu?");
          const userConfirmed = await confirmAction();
          if (userConfirmed) {
              for (let i = 0; i < itemIdx; i++) {
                items[i].start_time = addMinutesToTime(items[i].start_time, minutesBetween(item.start_time, data.start_time));
                items[i].end_time = addMinutesToTime(items[i].end_time, minutesBetween(item.start_time, data.start_time));
              }
            };
            items[itemIdx].start_time = data.start_time;
            items[itemIdx].end_time = updatedItem.end_time;
            items[itemIdx].description = data.description;
            setItems(items); 
            saveHarmonogram(eventId, items);
            onClose();
            return;
          } 
    }

    if (minutesBetween(data.start_time, item.start_time) === 0 && minutesBetween(data.end_time, item.end_time) != 0) {
      setSubmitMessage("Zmiana czasu zakończenia. Czy poprawić czas rozpoczęcia?");
      const userConfirmed = await confirmAction();
      if (userConfirmed) {
        updatedItem.start_time = addMinutesToTime(data.end_time, item.end_time ? minutesBetween(item.end_time, item.start_time) : 0);
        form.setValue("start_time", updatedItem.start_time);
        setSubmitMessage("Czy chcesz zmienić automatycznie pozostałe punkty harmonogramu?");
        const userConfirmed = await confirmAction();
        if (userConfirmed) {
          const pastItems = items.map((i, idx) => {
            if (idx < itemIdx) {
              i.start_time = addMinutesToTime(i.start_time, minutesBetween(item.start_time, data.start_time));
              i.end_time = addMinutesToTime(i.end_time, minutesBetween(item.start_time, data.start_time));
              return i
            }
          });
          const futureItems = items.map((i, idx) => {
            if (idx > itemIdx) {
              i.start_time = addMinutesToTime(i.start_time, minutesBetween(item.start_time, data.start_time));
              i.end_time = addMinutesToTime(i.end_time, minutesBetween(item.start_time, data.start_time));
              return i
            }
          });
          const newItems = [...pastItems, updatedItem, ...futureItems].filter((i): i is HarmonogramItem => i !== undefined);
          setItems(newItems); 
          saveHarmonogram(eventId, newItems);
          onClose();
          return;
        }
      } else {
          setSubmitMessage("Czy chcesz zmienić automatycznie późniejsze punkty harmonogramu?");
          const userConfirmed = await confirmAction();
            if (userConfirmed) {
              for (let i = itemIdx + 1; i < items.length; i++) {
                items[i].start_time = addMinutesToTime(items[i].start_time, minutesBetween(item.start_time, data.start_time));
                items[i].end_time = addMinutesToTime(items[i].end_time, minutesBetween(item.start_time, data.start_time));
              }
            };
            items[itemIdx] = updatedItem;
            setItems(items); 
            saveHarmonogram(eventId, items);
            onClose();
            return;
      }
    }
    
    // Save the updated harmonogram
    items[itemIdx] = updatedItem;
    saveHarmonogram(eventId, items);
    onClose();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-full"
      >
        <div className="relative w-full flex flex-col lg:flex-row items-center gap-2">
            {isModalVisible && (
              <div className="absolute w-full top-0 right-0 z-50 flex items-center justify-center bg-gray-300/50 p-4 rounded-xl shadow-xl">
                <div className="bg-white rounded-xl shadow-2xl p-6 w-full relative flex justify-between items-center">
                  <button
                    type="button"
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 cursor-pointer"
                    onClick={() => setIsModalVisible(false)}
                    aria-label="Zamknij modal"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                  <div className="mb-4 text-lg font-semibold text-center">
                    {submitMessage}
                  </div>
                  <div className="flex justify-center gap-4 mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="cursor-pointer hover:bg-gray-200"
                      onClick={() => {
                        if (showModalPromise) showModalPromise(false);
                        setIsModalVisible(false);
                      }}
                    >
                      Nie
                    </Button>
                    <Button
                      type="submit"
                      className="cursor-pointer hover:bg-gray-600"
                      onClick={() => {
                        if (showModalPromise) showModalPromise(true);
                        setIsModalVisible(false);
                      }}
                    >
                      Tak
                    </Button>
                  </div>
                </div>
              </div>
            )}  
            <div className="w-11/12 flex flex-wrap p-4 gap-2 items-center rounded-xl shadow-xl bg-slate-100 border-2">
              <div className="w-[80px] text-center">{itemIdx + 1}.</div>
              <div className="w-[100px]">
                <FormField
                  control={form.control}
                  name="start_time"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormControl>
                        <Input type="time" className="shadow-xl" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-[100px]">
                <FormField
                  control={form.control}
                  name="end_time"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormControl>
                        <Input
                          type="time"
                          className="shadow-xl"
                          {...field}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                    )}
                />
              </div>
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormControl>
                        <Input
                          placeholder="np. mecz: GKS vs. LSZ"
                          className="shadow-xl"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex justify-center items-center gap-4">
              <div className="text-gray-500 hover:text-gray-800">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="submit"
                      aria-label="Zapisz"
                    >
                      <CheckIcon className="w-6 h-6 cursor-pointer" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Zapisz</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="text-gray-500 hover:text-gray-800">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                        onClick={onClose}
                        aria-label="Zamknij"
                      >
                      <XMarkIcon className="w-6 h-6 cursor-pointer" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Zamknij</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
        </div>
      </form>
    </Form>
  );
}