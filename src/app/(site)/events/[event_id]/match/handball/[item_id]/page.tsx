import { getEventBaseInfo, getMatchInfo } from "@/lib/events.actions";
import { HarmonogramItem } from "@/types";
import { ChevronDoubleLeftIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

export default async function HandballMatchPage({ params }: { params: Promise<{ event_id: string, item_id: string }> }) {

  const { event_id, item_id } = await params;

  const eventInfo = await getEventBaseInfo(event_id);
  
  let itemInfo: HarmonogramItem | null = null
  try {
    itemInfo = await getMatchInfo(event_id, item_id);
  } catch (error) {
    console.error("Error fetching match info:", error);
  }

  console.log("Event info:", eventInfo);
  console.log("Item info:", itemInfo);

  return (
    <div className="min-h-screen bg-gray-50 w-full flex flex-col items-center mb-20 gap-5">
      <Link href={`/events/${event_id}`} className="text-blue-500 hover:underline w-66 border border-blue-500 rounded flex items-center gap-2 px-4 py-2 transition-colors">
        <ChevronDoubleLeftIcon className="h-5 w-5" />
        Powrót do strony turnieju
      </Link>
      <div className="w-full flex flex-col items-center gap-5">
        <h1 className="text-3xl font-bold">{eventInfo.name}</h1>
        <h1 className="text-3xl font-bold">{eventInfo.city}</h1>
        <h2 className="text-2xl font-semibold">{new Date(eventInfo.start_date).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: '2-digit' })}</h2>
        <h1 className="text-4xl font-bold"> Mecz: {itemInfo ? `${itemInfo.team_1} vs ${itemInfo.team_2}` : ''}</h1>
      
      </div>
    </div>
  );
}