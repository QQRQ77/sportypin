import AutoSlider from "@/components/ui/autoslider";
import JsonViewer from "@/components/utils/JSONviewer";
import { getEventById } from "@/lib/events.actions";
import Image from "next/image";

export default async function EventPage(
  { params }: { params: { event_id: string } }
) {
  // params.eventId zawiera aktualny fragment URL
  const { event_id } = await params;

  const event = await getEventById(event_id);

  console.log(event.imageUrls && event.imageUrls.length === 1)

  return (
    <div className="w-11/12 flex flex-col justify-center items-center mx-auto">
      <div>ID wydarzenia: {event_id}</div>
      <JsonViewer data={event}/>
        {(event.imageUrls && event.imageUrls.length === 1) ?
          <div className="relative w-full h-96 lg:w-1/4"> {/* lub dowolne w/h */}
            <h1>IMAGE</h1>
            <Image
              src={event.imageUrls[0]}
              alt={`Image ${event.name}`}
              fill
              className="object-cover"
            />
          </div> :
          <div className="w-full h-96">
            <AutoSlider imageUrls={event.imageUrls} altBase={event.name} navBullets={true} time={5000}/>
          </div>
        }
    </div>
  )
}