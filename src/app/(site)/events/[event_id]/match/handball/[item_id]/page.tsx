import { getEventBaseInfo, getMatchInfo } from "@/lib/events.actions";
import Link from "next/link";

export default async function HandballMatchPage({ params }: { params: Promise<{ event_id: string, item_id: string }> }) {

  const { event_id, item_id } = await params;

  const eventInfo = await getEventBaseInfo(event_id);
  
  let itemInfo = null;
  try {
    itemInfo = await getMatchInfo(event_id, item_id);
  } catch (error) {
    console.error("Error fetching match info:", error);
  }

  console.log("Event info:", eventInfo);
  console.log("Item info:", itemInfo);

  return (
    <div className="min-h-screen bg-gray-50 p-8 w-full flex flex-col justify-center">
      <Link href={`/events/${event_id}`} className="text-blue-500 hover:underline w-42 border border-blue-500 rounded px-4 py-2 mb-6">
        Powrót do strony turnieju
      </Link>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">{eventInfo.name}</h1>
        <h1 className="text-3xl font-bold mb-8">{eventInfo.city}</h1>
        <h2>{new Date(eventInfo.start_date).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: '2-digit' })}</h2>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Event ID</h2>
              <p className="text-2xl font-mono text-blue-600">{event_id}</p>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Item ID</h2>
              <p className="text-2xl font-mono text-blue-600">{item_id}</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-gray-600">
            Event: <strong>{event_id}</strong>
          </p>
          <p className="text-gray-600">
            Match: <strong>{item_id}</strong>
          </p>
          {!itemInfo && (
            <p className="text-red-600 mt-4">Could not load match information. Invalid match ID.</p>
          )}
        </div>
      </div>
    </div>
  );
}