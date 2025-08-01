"use client";
import { Calendar, Mail, Phone } from "lucide-react";
import { Event } from "@/types";
import AutoSliderAndModal from "./AutosliderAndModal";
import { monthNameToColorClass } from "@/lib/utils";
import { toggleObserveEvent } from "@/lib/users.actions";
import StarSolidIcon from "../../public/icons/star-solid";
import StarOutlineIcon from "../../public/icons/star-outline";
import MultipleMarkersMap from "./GoogleMapsComponent";
import { Button } from "./ui/button";


interface Props {
  event: Event;
  userId?: string | null;
}

export default function EventCard({ event, userId = "" }: Props) {
  const start = new Date(event.start_date);
  const day = start.toLocaleDateString("pl-PL", { day: "2-digit" });
  const month = start.toLocaleDateString("pl-PL", { month: "long" });
  const weekDay = start.toLocaleDateString("pl-PL", { weekday: "long" });

           const year = new Date(event.start_date).getFullYear();
          const startTime = event.start_date ? new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""
            
            const now = new Date();
            const end = event.end_date ? new Date(event.end_date) : null;
  
            const isPast = end
              ? end < now
              : start < new Date(now.getFullYear(), now.getMonth(), now.getDate()); // start <= yesterday
  
            const monthName = isPast ? "" : new Date(event.start_date).toLocaleString('default', { month: 'long' });
            const monthColor = monthNameToColorClass(monthName);
           
          const isEventObserved = event.followers?.includes(userId || "")

  return (
    <article className="relative max-w-5xl mx-auto my-2 bg-white rounded-2xl overflow-hidden shadow-2xl">
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
          <div className="absolute bottom-0 right-0 p-1 flex flex-row cursor-pointer"
              onClick={async (e) => {
                  e.preventDefault();     
                  e.stopPropagation();     
                  await toggleObserveEvent({ eventId: event.id });
                }}>
              {isEventObserved ? <div className="text-pink-500 hover:text-pink-800"><StarSolidIcon/></div> : <div className="hover:text-pink-500"><StarOutlineIcon/></div>}
          </div>
          {userId === event.creator &&
          <div className="w-full flex justify-center">
            <Button className="cursor-pointer">Edycja zaawansowana</Button>
          </div>}
        </header>

        <div className="flex flex-col gap-4 lg:flex-row items-center lg:h-42 border-t border-slate-300 mt-4">
          <div className="w-full lg:w-1/2">
            <div className="">
              <p className="mt-2 text-lg font-semibold">
                {event.place_name}
              </p>
              <p className="mt-2 text-lg">
                {event.city} • {event.zip_code} • {event.address}
              </p>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <Calendar size={24} />
              <div>
                <span className="font-semibold">{weekDay}, {day} {month} {year}</span>
                <span className="ml-2">{startTime}</span>
                {event.end_date && (
                  <span className="ml-2">– {new Date(event.end_date).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })}</span>
                )}
              </div>
            </div>
          </div>
          <div className="w-full h-38 lg:w-1/2">
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
        <section className="pt-4 border-t border-slate-300">
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
        </section>
      </div>
      <div className="absolute bottom-0 right-5 p-1 flex flex-row cursor-pointer">
        <p><span className="text-sky-600 mr-2">Dodane przez:</span>{event.creator_name}</p>
      </div>
    </article>
  );
}