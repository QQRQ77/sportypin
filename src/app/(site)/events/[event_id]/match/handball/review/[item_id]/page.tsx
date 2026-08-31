import { getEventBaseInfo, getEventParticipants, getMatchInfo } from "@/lib/events.actions";
import { createUser } from "@/lib/users.actions";
import { HarmonogramItem } from "@/types";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import Image from "next/image";
import { ChevronDoubleLeftIcon } from "@heroicons/react/20/solid";
import { getTeamLogoByTeamId } from "@/lib/teams.actions";
import HandballGameReviewTeamMembers from "@/components/events/Handball/HandballGameReviewTeamMembers";

export default async function HandballMatchPage({ params, searchParams }: { params: Promise<{ event_id: string, item_id: string }>; searchParams: Promise<{ item_LP?: string }> }) {

  const { event_id, item_id } = await params;
  const { item_LP } = await searchParams;

  const { userId } = await auth();
  if ( userId ) {await createUser()}

  const eventInfo = await getEventBaseInfo(event_id);
  // const eventParticipants = await getEventParticipants(event_id);

  let itemInfo: HarmonogramItem | undefined;

  try {itemInfo = await getMatchInfo(event_id, item_id)} 
    catch (error) {
      console.error("Error fetching match info:", error);
    }

  let team_1_logoURL = ""
    let team_2_logoURL = ""
    try {
      if (itemInfo?.team_1_id) {
        team_1_logoURL = await getTeamLogoByTeamId(itemInfo.team_1_id);
      }
      if (itemInfo?.team_2_id) {
        team_2_logoURL = await getTeamLogoByTeamId(itemInfo.team_2_id);
      }
    } catch (error) {
      console.error("Error fetching team logo:", error);
    }

  return (
    <div className="min-h-screen bg-gray-50 w-full flex flex-col items-center mt-5 mb-20 gap-5 text-center">
      <Link href={`/events/${event_id}`} className="text-blue-500 hover:underline w-66 border border-blue-500 rounded flex items-center gap-2 px-4 py-2 transition-colors">
        <ChevronDoubleLeftIcon className="h-5 w-5" />
        Powrót do strony turnieju
      </Link>
      <div className="w-full flex flex-col items-center gap-5">
        <h1 className="text-3xl font-bold">{eventInfo.name}</h1>
        <h1 className="text-3xl font-bold">{eventInfo.city}</h1>
        <h2 className="text-2xl font-semibold">{new Date(eventInfo.start_date).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: '2-digit' })}</h2>
        <h1 className="text-2xl font-normal"> Mecz nr: <span className="font-bold mr-4">{itemInfo ? `${item_LP}` : ""}</span>rozpoczęcie: <span className="font-bold">{itemInfo ? itemInfo.start_time : ""}</span>{"   "}koniec: <span className="font-bold">{itemInfo ? itemInfo.end_time : ""}</span></h1>        
      </div>
      <div className="w-full lg:w-1/2 h-52 flex flex-2 items-start max-h-min">
        <div className="w-full flex flex-col items-center justify-center gap-5 relative">
          {team_2_logoURL && !team_1_logoURL && <div className="h-[165px]"></div>}
          {team_1_logoURL && <Image
            src={team_1_logoURL || "/images/logo_team.png"}
            alt={`${itemInfo?.team_1} logo`}
            width={150}
            height={150}
            className="object-contain rounded "
          />}
          <p className="text-2xl font-bold text-center">{itemInfo ? itemInfo.team_1 : ""}</p>
          <div className="absolute text-3xl font-bold text-gray-400 top-1/2 -right-5 transform -translate-y-1/2">VS</div>
        </div>
        <div className="w-full flex flex-col items-center justify-center gap-5">
          {team_1_logoURL && !team_2_logoURL && <div className="h-[165px]"></div>}
          {team_2_logoURL && <Image
            src={team_2_logoURL || "/images/logo_team.png"}
            alt={`${itemInfo?.team_2} logo`}
            width={150}
            height={150}
            className="object-contain rounded"
          />}
            <p className="text-2xl font-bold text-center">{itemInfo ? itemInfo.team_2 : ""}</p>
        </div>
      </div>
      <div className={"scoreboard w-full md:w-96 flex flex-3 border-1 border-gray-300 rounded-xl pb-4 m-2 items-center justify-center"}>
        <div className="team-1 flex flex-col md:flex-row md:flex-2 md:w-64 items-center gap-4">
          <div className="w-46 lg:w-52 flex flex-col items-center gap-4">
            <h2 className="text-7xl lg:text-9xl font-bold">{itemInfo?.team_1_score}</h2>
          </div>
        </div>
        <div className="flex self-start text-6xl lg:text-9xl font-bold w-8 lg:w-24">:</div>
        <div className="team-2 flex flex-col md:flex-row md:flex-2 md:w-64 items-center gap-4">
          <div className="w-46 lg:w-52 flex flex-col items-center gap-4">
            <h2 className="text-7xl lg:text-9xl font-bold">{itemInfo?.team_2_score}</h2>
          </div>
        </div> 
      </div>
      <HandballGameReviewTeamMembers
        team_1_members={itemInfo?.team_1_players}
        team_2_members={itemInfo?.team_2_players}
      />
    </div>
  )
}