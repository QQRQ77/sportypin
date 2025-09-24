"use client";
import { Mail, Phone } from "lucide-react";
import { Event, HarmonogramItem, Participant } from "@/types";
import AutoSliderAndModal from "./AutosliderAndModal";
import { monthNameToColorClass } from "@/lib/utils";
import { toggleObserveEvent } from "@/lib/users.actions";
import StarSolidIcon from "../../public/icons/star-solid";
import StarOutlineIcon from "../../public/icons/star-outline";
import MultipleMarkersMap from "./GoogleMapsComponent";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useState } from "react";
import HarmonogramForm from "./forms/EventHarmonogramForm";
import StartAndEndTimeViewer from "./StartAndEndTimeViewer";
import SortableHarmonogram from "./SortableHarmonogram";
import Harmonogram from "./Harmonogram";
import ChangeAllHarmonogramForm from "./forms/ChangeAllHarmonogramForm";
import AddParticipantForm from "./forms/AddParticipantForm";
import CompetitorsList from "./CompetitorsList";
import EventScores from "./EventScores";

interface Props {
  event: Event;
  userId?: string | null;
  isUserFollowing?: boolean;
  isUserCreator?: boolean;
}

export default function EventCard({ event, userId = "", isUserFollowing = false, isUserCreator = false }: Props) {
  const router = useRouter()

  const [openHarmonogramForm, setOpenHarmonogramForm] = useState(false)
  const [openChangeAllForm, setOpenChangeAllForm] = useState(false);
  const [openParticipantsForm, setOpenParticipantsForm] = useState(false)
  const [showClasificationForm, setShowClasificationForm] = useState(false)
  const [harmonogramItems, addHarmonogramItems] = useState<HarmonogramItem[]>(event.harmonogram || []);
  const [participants, setParticipants ] = useState<Participant[]>(event.participants || []);

  const now = new Date();
  const start = new Date(event.start_date);
  const end = event.end_date ? new Date(event.end_date) : null;

  const isPast = end
    ? end < now
    : start < new Date(now.getFullYear(), now.getMonth(), now.getDate()); // start <= yesterday

  const monthName = isPast ? "" : new Date(event.start_date).toLocaleString('default', { month: 'long' });
  const monthColor = monthNameToColorClass(monthName);
  
  const isEventObserved = isUserFollowing

  return (
    <article className="relative w-full mx-5 lg:w-2/3 lg:mx-auto my-2 bg-white rounded-2xl overflow-hidden shadow-2xl">
      {/* GALERIA / SLIDER */}
      {event.imageUrls && event.imageUrls.length > 0 && (
        <div className="relative h-64 md:h-80">
            <AutoSliderAndModal imageUrls={event.imageUrls} altBase={event.name} />
        </div>
      )}

      {/* TREŚĆ */}
      <div className="p-6 md:p-8 space-y-6">
        {/* NAGŁÓWEK */}
        <header className="relative">
          <h1 className="text-3xl md:text-4xl font-extrabold text-sky-600 leading-tight">
            {event.name}
          </h1>
          <p className="mt-2 text-lg">
            {event.event_type}
          </p>
          <div className="absolute bottom-0 right-0 p-1 flex flex-row gap-4 cursor-pointer">
              {isUserCreator && (
                <div className="w-full flex justify-center mt-6">
                  <Button
                    onClick={() => router.push(`/events/${event.id}/edit`)}
                    className="cursor-pointer"
                  >
                    Edytuj
                  </Button>
                </div>
              )}
            <div
              onClick={async (e) => {
                  e.preventDefault();     
                  e.stopPropagation();     
                  await toggleObserveEvent({ eventId: event.id });
                }}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    {isEventObserved ? <div className="text-pink-500 hover:text-pink-800"><StarSolidIcon/></div> : <div className="hover:text-pink-500"><StarOutlineIcon/></div>}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isEventObserved ? "Obserwujesz" : "Nie obserwujesz"}</p>
                  </TooltipContent>
                </Tooltip>
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-4 lg:flex-row items-center lg:h-42 border-t border-slate-300 mt-4">
          <div className="w-full lg:w-1/2">
            <div className="mb-10">
              <p className="mt-2 text-lg font-semibold">
                {event.place_name}
              </p>
              <p className="mt-2 text-lg">
                {event.city} • {event.zip_code} • {event.address}
              </p>
            </div>
            <StartAndEndTimeViewer start_date={event.start_date} end_date={event.end_date} />    
          </div>
          <div className="w-full h-42 lg:w-1/2">
            <MultipleMarkersMap events={[event]}/>    
          </div>      
        </div>        
        
          

        {/* OPIS */}
        {event.description && (
          <section className="pt-4 border-t border-slate-300">
            <h2 className="mb-2 text-xl font-bold text-sky-600">Opis wydarzenia</h2>
            <p className="leading-relaxed">{event.description}</p>
          </section>
        )}


        {/* SPORTY i KATEGORIE */}
        <section className="pt-4 border-t border-slate-300">
          <div className="flex flex-wrap flex-row gap-2 my-2 ml-2 lg:ml-0">
              dyscypliny:{" "}
              {event.sports && event.sports.map((sport, index) => (
                <span key={index} className="bg-gray-700 text-white px-2 py-1 rounded-full text-sm">
                  {sport}
                </span>
              ))}
          </div>
          <div className="flex flex-wrap flex-row gap-2 my-2 ml-2 lg:ml-0">
              kategorie:{" "}
              {event.cathegories && event.cathegories.map((cathegory, index) => (
                <span key={index} className="bg-gray-300 text-gray-800 px-2 py-1 rounded-full text-sm">
                  {cathegory}
                </span>
              ))}
          </div>
        </section>

        {/* DANE KONTAKTOWE */}
        <section className="relative pt-4 border-t border-slate-300">
          <h2 className="mb-2 text-xl font-bold text-sky-600">Organizator</h2>
          <p className="font-semibold">{event.organizator}</p>

          <div className="mt-2 space-y-1 text-sm">
            {event.contact_email && (
              <a
                href={`mailto:${event.contact_email}`}
                className="flex items-center gap-2 hover:text-sky-600"
              >
                <Mail size={16} />
                {event.contact_email}
              </a>
            )}
            {event.contact_phone && (
              <a
                href={`tel:${event.contact_phone}`}
                className="flex items-center gap-2 hover:text-sky-600"
              >
                <Phone size={16} />
                {event.contact_phone}
              </a>
            )}
          </div>
          <div className="absolute bottom-0 right-5 p-1 flex flex-row">
            <p><span className="text-sky-600 mr-2">Dodane przez:</span><span className="cursor-pointer hover:text-slate-500">{event.creator_name}</span></p>
          </div>
        </section>

        {/* Harmonogram */}
        <section className="relative pt-4 border-t border-slate-300">
          <div className="w-full flex justify-between">
            <h2 className="mb-2 text-xl font-bold text-sky-600">Harmonogram</h2>
            {isUserCreator && 
            <div className="flex gap-4">
              <Button className="cursor-pointer" onClick={()=>{setOpenChangeAllForm(false); setOpenHarmonogramForm(prev => !prev)}}>{openHarmonogramForm? "Zamknij" : "Dodaj"}</Button>  
              <Button className="cursor-pointer" onClick={()=>{setOpenHarmonogramForm(false); setOpenChangeAllForm(prev => !prev)}}>{openChangeAllForm? "Zamknij" : "Zmień całość"}</Button>  
            </div>}
          </div>
          {openChangeAllForm && 
            <ChangeAllHarmonogramForm 
              eventId={event.id}
              items={harmonogramItems} 
              start_date={event.start_date} 
              end_date={event.end_date}
              cathegories={event.cathegories}
              setItems={addHarmonogramItems}/>}
          {openHarmonogramForm && 
            <HarmonogramForm 
              eventId={event.id}
              items={harmonogramItems} 
              start_date={event.start_date} 
              end_date={event.end_date}
              cathegories={event.cathegories}
              setItems={addHarmonogramItems}/>}
          {isUserCreator ? 
            <SortableHarmonogram 
              items={harmonogramItems} 
              eventId={event.id} 
              setItems={addHarmonogramItems} 
              cathegories={event.cathegories}/>
            : <Harmonogram items={harmonogramItems}/>}
        </section>

        {/* Uczestnicy     */}
        <section className="relative pt-4 border-t border-slate-300">
          <div className="w-full flex justify-between">
            <h2 className="mb-2 text-xl font-bold text-sky-600">Uczestnicy</h2>
            {isUserCreator && 
              <div className="flex gap-4">
                <Button className="cursor-pointer" onClick={()=>{setOpenParticipantsForm(prev => !prev)}}>{openParticipantsForm? "Zamknij" : "Dodaj"}</Button>  
              </div>}
          </div>
          {openParticipantsForm && 
            <AddParticipantForm
              eventId={event.id} 
              setItems={setParticipants} 
              cathegories={event.cathegories}
              participants={participants}/>}
          <CompetitorsList participants={participants}/>
        </section>

        {/* Wyniki 
        TODO: dodawania wyników do harmonogramu jeśli itemType to mecz itp. i wyświetlanie ich tutaj
        */}
        <section className="relative pt-4 border-t border-slate-300">
          <div className="w-full mb-2 flex justify-between">
            <h2 className="text-xl font-bold text-sky-600">Wyniki</h2>
            <Button className="cursor-pointer">Dodaj/Edytuj</Button>  
          </div>
          <EventScores harmonogramItems={harmonogramItems}/>
        </section>      
      </div>
    </article>
  );
}