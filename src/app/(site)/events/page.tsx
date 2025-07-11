import { getEventsSmall } from "@/lib/events.actions";
import { monthNameToColorClass } from "@/lib/utils";
import { EventSmall } from "@/types";
import Link from "next/link";

export default async function Page() {
  const events = await getEventsSmall();

  if (!events || events.length === 0) {
    return (
      <div className="flex items-center justify-center flex-col w-11/12 mx-auto mt-10 gap-4 mb-20">
        <h1 className="text-2xl font-bold">Brak wydarzeń</h1>
        <p className="text-lg">Nie znaleziono żadnych wydarzeń sportowych.</p>
      </div>
    );
  }

  if (events.length > 0) {
      return (
    <div className="flex items-center justify-center flex-col w-11/12 mx-auto mt-10 gap-4 mb-20">
      <h1 className="text-2xl font-bold">Wydarzenia</h1>
      <p className="text-lg">Lista wydarzeń sportowych</p>
      {JSON.stringify(events, null, 2)}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
        {events.map((event: EventSmall) => {
          const month = new Date(event.start_date).toLocaleString('default', { month: 'long' });
          const day = new Date(event.start_date).getDate();
          const year = new Date(event.start_date).getFullYear();
          const fullDate = `${day} ${month} ${year}`;
          const startTime = event.start_date ? new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""
          const endTime = event.end_date ? new Date(event.end_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "";
          const monthColor = monthNameToColorClass(month);
          
          return (
            <Link href={`/events/${event.id}`}
              key={event.id}
              className={`w-full bg-${monthColor}-100 rounded-lg shadow-md p-6 flex flex-col gap-2 hover:shadow-lg hover:border-2 border-gray-400 transition-shadow`}
            >
              <h2 className="text-xl font-semibold text-gray-800">{event.name}</h2>
              <p className="text-gray-600">{fullDate}</p>

              {endTime && <p className="text-gray-600">w godzinach: {startTime} - {endTime}</p>}
              {!endTime && startTime && <p className="text-gray-600">rozpoczęcie o godz. {startTime}</p>}
              <p className="text-gray-500">{event.city}</p>
              {event.description && (
                <p className="text-gray-700 text-sm mt-2">{event.description}</p>
              )}
            </Link>
          );
        })}
        </div>
      </div>
  )}
}