import { Event } from "@/types";
import EventCard from "./EventCard";

interface EventsListProps {
  events?: Array<Event>;
  userId?: string | null;
}

export default function EventsList({ events, userId }: EventsListProps) {

  if (!events || events.length === 0) {
    return <div className="text-center text-2xl text-black-500 mt-20">Brak wydarzeń do wyświetlenia</div>;
  }

  return (
    <div className="w-full flex flex-col gap-2">
      {events.map((event) => {
        return (
          <EventCard event={event} eventKey={event.id} userId={userId} key={event.id} />
        );
      })}
    </div>
  )}