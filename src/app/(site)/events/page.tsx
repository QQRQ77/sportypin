import MultipleMarkersMap from "@/components/GoogleMapsComponent";
import { getPastEvents, getUpcomingEvents, getUserEvents } from "@/lib/events.actions";
import { auth } from "@clerk/nextjs/server";
import EventsTab from "@/components/EventsTab";

export default async function Page() {
  
  const { userId } = await auth();
    
  const upcomingEvents = await getUpcomingEvents();
  const pastEvents = await getPastEvents();
  const usersEvents = userId ? await getUserEvents() : [];
  const likedEvents = userId ?  [] : [];

  if (!upcomingEvents || upcomingEvents.length === 0) {
    return (
      <div className="flex items-center justify-center flex-col w-11/12 mx-auto mt-10 gap-4 mb-20">
        <h1 className="text-2xl font-bold">Brak wydarzeń</h1>
        <p className="text-lg">Nie znaleziono żadnych wydarzeń sportowych.</p>
      </div>
    );
  }

  if (upcomingEvents.length > 0) {
      return (
        <div className="flex flex-col lg:flex-row items-start justify-center w-11/12 mx-auto my-10 gap-4 mb-20">
          <div className='w-full mx-2 lg:w-1/3 flex justify-center'>
            <MultipleMarkersMap events={upcomingEvents}/>
          </div>
          <div className="flex flex-col justify-center items-start gap-2 w-full h-96 lg:h-fit">
            <EventsTab
              likedEvents={likedEvents}
              usersEvents={usersEvents}
              upcomingEvents={upcomingEvents}
              pastEvents={pastEvents}
              userId={userId}
            />
          </div>
        </div>
      )}
}