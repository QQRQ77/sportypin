import JsonViewer from "@/components/utils/JSONviewer";
import { getEventById } from "@/lib/events.actions";

export default async function EventPage(
  { params }: { params: { event_id: string } }
) {
  // params.eventId zawiera aktualny fragment URL
  const { event_id } = params;

  const event = await getEventById(event_id);

  return (
  <div>
  <div>ID wydarzenia: {event_id}</div>
  <JsonViewer data={event}/>
  </div>
  )
}