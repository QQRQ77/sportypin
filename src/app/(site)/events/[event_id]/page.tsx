import EventFullCard from "@/components/EventFullCard";
import { findEventCreatorId, getEventById } from "@/lib/events.actions";
import { createUser, isUserFollowingEvent } from "@/lib/users.actions";
import { auth } from "@clerk/nextjs/server";

export default async function EventPage(
  { params }: { params: { event_id: string } }
) {

  const { event_id } = await params;

  const { userId } = await auth();
  if ( userId ) {await createUser()}

  const event = await getEventById(event_id);
  const isUserFollowing = event && userId ? await isUserFollowingEvent(event_id) : false;
  const isUserCreator = event && userId ? await findEventCreatorId(event_id) === userId : false;

  return (
    <>
      <EventFullCard event={event} userId={userId} isUserCreator={isUserCreator} isUserFollowing={isUserFollowing}/>
    </>
  )
}