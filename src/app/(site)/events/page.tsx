// import MultipleMarkersMap from "@/components/GoogleMapsComponent";
// import { getPastEvents, getUpcomingEvents } from "@/lib/events.actions";
import { auth } from "@clerk/nextjs/server";
// import EventsTab from "@/components/EventsTab";
import { createUser } from "@/lib/users.actions";

export default async function Page() {

  const { userId } = await auth();
  if ( userId ) {await createUser()}
    
  // const upcomingEvents = await getUpcomingEvents();
  // const pastEvents = await getPastEvents();
  // const usersEvents = userId ? await getUserEvents() : [];
  // const likedEvents = userId ?  await getObservedEvents() : [];

  // if (!upcomingEvents || upcomingEvents.length === 0 || !pastEvents || pastEvents.length === 0) {
  //   return (
  //     <div className="flex items-center justify-center flex-col w-11/12 mx-auto mt-10 gap-4 mb-20">
  //       <h1 className="text-2xl font-bold">Brak wydarzeń</h1>
  //       <p className="text-lg">Nie znaleziono żadnych wydarzeń sportowych.</p>
  //     </div>
  //   );
  // } else {
      return (
        <div className="flex flex-col lg:flex-row items-start justify-center w-11/12 mx-auto my-10 gap-4 mb-20">
          {/* {upcomingEvents && upcomingEvents.length > 0 && <div className='w-full lg:w-1/3 h-96 lg:h-[600px] mx-2 flex justify-center'>
            <MultipleMarkersMap events={upcomingEvents}/>
          </div>}
          {(upcomingEvents && upcomingEvents.length === 0) && pastEvents && pastEvents.length > 0 && <div className='w-full lg:w-1/3 h-96 lg:h-[600px] mx-2 flex justify-center'>
            <MultipleMarkersMap events={pastEvents}/>
          </div>} */}
          <div className="flex flex-col justify-center items-start gap-2 w-full h-96 lg:h-fit">
            Welcome user: {userId}
            {/* <EventsTab
              likedEvents={likedEvents}
              usersEvents={usersEvents}
              upcomingEvents={upcomingEvents}
              pastEvents={pastEvents}
              userId={userId}
            /> */}
          </div>
        </div>
      )
}