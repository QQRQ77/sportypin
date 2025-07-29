import { Venue } from "@/types";
import VenueCard from "./VenueCard";
import MultipleMarkersMap from "./GoogleMapsComponent";

interface VenuesListProps {
  venues?: Array<Venue>;
  userId?: string | null;
}

export default function EventsList({ venues, userId }: VenuesListProps) {

  if (!venues || venues.length === 0) {
    return <div className="text-center text-2xl text-black-500 mt-20">Brak obiektów do wyświetlenia</div>;
  }

  return (
      <div className="w-full flex flex-col gap-2">
        {venues.map((venue) => {
          return (
            <VenueCard venue={venue} userId={userId} key={venue.id} />
          );
        })}
      </div>
  )}