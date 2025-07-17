'use client'

import { monthNameToColorClass } from "@/lib/utils";
import Link from "next/link";
import StarSolidIcon from "../../public/icons/star-solid";
import StarOutlineIcon from "../../public/icons/star-outline";
import { Event } from "./EventsTab";
import { toggleObserveEvent } from "@/lib/users.actions";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

interface EventCardProps {
  event: Event;
  eventKey: string;
  userId?: string | null;
}


export default function EventCard({ event, eventKey, userId }: EventCardProps) {

        const [closeModal, setCloseModal] = useState(false)
        const [modalBgVis, setModalBgVis] = useState(false)

        const month = new Date(event.start_date).toLocaleString('default', { month: 'long' });
        const day = new Date(event.start_date).getDate();
        const year = new Date(event.start_date).getFullYear();
        const fullDate = `${day} ${month} ${year}`;
        const startTime = event.start_date ? new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""
        const endTime = event.end_date ? new Date(event.end_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "";
          
          const now = new Date();
          const start = new Date(event.start_date);
          const end = event.end_date ? new Date(event.end_date) : null;

          const isPast = end
            ? end < now
            : start < new Date(now.getFullYear(), now.getMonth(), now.getDate()); // start <= yesterday

          const monthName = isPast ? "" : new Date(event.start_date).toLocaleString('default', { month: 'long' });
          const monthColor = monthNameToColorClass(monthName);
        
        const weekDay = new Date(event.start_date).toLocaleDateString('default', { weekday: 'long' });

        const isEventObserved = event.followers?.includes(userId || "")

        return (
          <Link href={`/events/${event.id}`}
            key={eventKey}
            className={`relative w-full min-h-fit lg:min-h-[144px] rounded-lg shadow-md flex flex-col md:flex-row hover:shadow-lg hover:border-2 border-1 border-gray-900 transition-shadow ${monthColor.bg100}`}
          >
            <div className={`w-full lg:w-1/5 py-2 text-white flex flex-col gap-2 items-center justify-center font-bold border-b-1 lg:border-b-0 lg:border-r-1 border-gray-400 rounded-t-lg lg:rounded-t-none lg:rounded-l-lg  ${monthColor.bg500}`}>
              <p className="text-2xl">{weekDay}</p>
              <p className="text-xl">{fullDate}</p>
              {endTime && <p className="text-lg font-normal">w godzinach: {startTime} - {endTime}</p>}
              {!endTime && startTime && <p className="text-lg font-normal">rozpoczęcie o godz. {startTime}</p>}
            </div>

            <div className={`w-full lg:w-1/5 flex flex-col justify-between items-center border-b-1 lg:border-b-0 lg:border-r-1 border-gray-400 ${monthColor.bg200}`}>
              <h2 className="text-xl font-semibold text-gray-800 mt-1 mx-auto text-center break-words w-full">{event.name}</h2>
              <h2 className="text-gray-700 mx-auto text-xl font-semibold mt-4 lg:my-3">{event.city}</h2>
              <p className="md:hidden text-gray-600 text-base mx-auto">{event.address}</p>
              <p className="md:hidden text-gray-600 text-base mx-auto">{event.place_name}</p>
            </div>

            <div className="w-full lg:w-3/5 flex flex-col justify-between items-start pl-2">
              <div className="lg:h-10 my-2 ml-2 lg:ml-0">
                {event.description && (
                  <div className="w-full text-gray-700 text-sm">
                    {event.description.length > 200
                    ? event.description.slice(0, 200) + "..."
                    : event.description}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap flex-row gap-2 my-2 ml-2 lg:ml-0">
                  {event.sports && event.sports.map((sport, index) => (
                    <span key={index} className="bg-gray-700 text-white px-2 py-1 rounded-full text-sm">
                      {sport}
                    </span>
                  ))}
                  {event.cathegories && event.cathegories.map((cathegory, index) => (
                    <span key={index} className="bg-gray-300 text-gray-800 px-2 py-1 rounded-full text-sm">
                      {cathegory}
                    </span>
                  ))}
              </div>
              <div className="hidden lg:flex flex-wrap gap-2 mt-2 ml-2 lg:ml-0 mb-3">
                <p className=" text-gray-600 text-base">{event.address}</p>
                <p className=" text-gray-600 text-base font-medium">{event.place_name}</p>
              </div>
            </div>
                <div className="absolute top-0 right-0 p-1 flex flex-row"
                  onClick={async (e) => {
                      e.preventDefault();     
                      e.stopPropagation();     
                      await toggleObserveEvent({ eventId: event.id });
                    }}>
                  {isEventObserved ? <div className="text-pink-500 hover:text-pink-800"><StarSolidIcon/></div> : <div className="hover:text-pink-500"><StarOutlineIcon/></div>}
                </div>
              {!closeModal && 
                <div className={`absolute bottom-0 right-0 p-1 text-xs text-gray-700 flex flex-col ${modalBgVis ? 'bg-gray-100 rounded-lg' : ""} `}>
                  <button
                    onClick={(e)=> {
                      e.preventDefault();
                      e.stopPropagation();
                      setCloseModal(!closeModal)}}
                    onMouseEnter={() => setModalBgVis(true)}
                    onMouseLeave={() => setModalBgVis(false)}
                    className="text-gray-500 hover:text-gray-800 cursor-pointer ml-auto mr-1 mb-2"
                    aria-label="Zamknij"
                    >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                  <p>Dodane przez: <span className="font-medium">{event.creator_name}</span></p>
                  {event.contact_email && <p className="">email: <span className="font-medium">{event.contact_email}</span></p>}
                  {event.contact_phone && <p className="">telefon: <span className="font-medium">{event.contact_phone}</span></p>}
                </div>}
            {/* {!closeModal && <div className="absolute top-0 right-0 z-50 flex items-center justify-center bg-black/40">
              <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
                {/* Przycisk zamknięcia 
                <button
                  onClick={()=> setCloseModal(!closeModal)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                  aria-label="Zamknij"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>

                <div className="text-sm text-gray-700 space-y-2">
                  <p>
                    Dodane przez:{" "}
                    <span className="font-medium">{event.creator_name}</span>
                  </p>
                  {event.contact_email && (
                    <p>
                      email:{" "}
                      <span className="font-medium">{event.contact_email}</span>
                    </p>
                  )}
                  {event.contact_phone && (
                    <p>
                      telefon:{" "}
                      <span className="font-medium">{event.contact_phone}</span>
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  className="mt-4 flex items-center gap-1 text-sm"
                  onClick={async () => {
                    await toggleObserveEvent({ eventId: event.id });
                    // opcjonalnie: odśwież kartę lub zamknij
                  }}
                >
                  {isEventObserved ? (
                    <StarSolidIcon />
                  ) : (
                    <StarOutlineIcon />
                  )}
                  <span>{isEventObserved ? "Obserwujesz" : "Obserwuj"}</span>
                </button>
              </div>
            </div>} */}
          </Link>
        )
  }