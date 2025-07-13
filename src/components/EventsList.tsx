import { monthNameToColorClass } from "@/lib/utils";
import Link from "next/link";

interface EventsListProps {
  events?: Array<{
    id: string;
    name: string;
    start_date: string;
    end_date?: string;
    city: string;
    address: string;
    place_name: string;
    description?: string;
    sports?: string[];
    cathegories?: string[];
  }>;
}
export default function EventsList({ events }: EventsListProps) {

  if (!events || events.length === 0) {
    return <div className="text-center text-2xl text-black-500 mt-20">Brak wydarzeń do wyświetlenia</div>;
  }

  return (
    <div className="w-full flex flex-col gap-2">
      {events.map((event) => {

        const month = new Date(event.start_date).toLocaleString('default', { month: 'long' });
        const day = new Date(event.start_date).getDate();
        const year = new Date(event.start_date).getFullYear();
        const fullDate = `${day} ${month} ${year}`;
        const startTime = event.start_date ? new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""
        const endTime = event.end_date ? new Date(event.end_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "";
        const monthColor = monthNameToColorClass(month);
        const weekDay = new Date(event.start_date).toLocaleDateString('default', { weekday: 'long' });

        return (
          <Link href={`/events/${event.id}`}
            key={event.id}
            className={`w-full min-h-fit lg:min-h-[144px] rounded-lg shadow-md flex flex-col md:flex-row hover:shadow-lg hover:border-2 border-1 border-gray-900 transition-shadow ${monthColor.bg100}`}
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
          </Link>
        );
      })}
    </div>
  )}