import EventFullCard from "@/components/EventFullCard";
import JsonViewer from "@/components/utils/JSONviewer";
import { getEventById } from "@/lib/events.actions";
import { createUser } from "@/lib/users.actions";
import { auth } from "@clerk/nextjs/server";

export default async function EventPage(
  { params }: { params: { event_id: string } }
) {

  const { event_id } = await params;

  const { userId } = await auth();
  if ( userId ) {await createUser()}

  const event = await getEventById(event_id);

  return (
    <>
        <EventFullCard event={event} userId={userId}/>
    </>
  )
}