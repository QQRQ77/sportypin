import { findEventCreatorId, getEventBaseInfo, getMatchInfo, getTeamMembers, saveHarmonogramItemTeamPlayers } from "@/lib/events.actions";
import { getTeamLogoByTeamId } from "@/lib/teams.actions";
import { EventTeamMemberType, HarmonogramItem } from "@/types";
import { ChevronDoubleLeftIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import { createUser } from "@/lib/users.actions";
import HandballGame from "@/components/events/HandBallGame";

export default async function HandballMatchPage({ params }: { params: Promise<{ event_id: string, item_id: string }> }) {

  const { event_id, item_id } = await params;

  const { userId } = await auth();
  if ( userId ) {await createUser()}
  const isUserCreator = userId ? await findEventCreatorId(event_id) === userId : false;

  const eventInfo = await getEventBaseInfo(event_id);
  
  let itemInfo: HarmonogramItem | undefined;
  let team_1_members: EventTeamMemberType[] = [];
  let team_2_members: EventTeamMemberType[] = [];
  
  try {itemInfo = await getMatchInfo(event_id, item_id); console.log("itemInfo:", itemInfo);} 
  catch (error) {
    console.error("Error fetching match info:", error);
  }

  try {
    if (itemInfo && !itemInfo.team_1_players) {
      try {
        team_1_members = await getTeamMembers(event_id, itemInfo.team_1 || "") || [];
        const teamOnePlayersClean = team_1_members.map(member => ({
          ...member,
          goals: 0,
          yellowCards: 0,
          redCards: 0,
          penalties: 0,
        }));
        team_1_members = teamOnePlayersClean;
        await saveHarmonogramItemTeamPlayers(event_id, item_id, 1, teamOnePlayersClean);

      } catch (error) {
        console.error("Error fetching team 1 members:", error);
      }
    } else if (itemInfo && itemInfo.team_1_players) {
      team_1_members = itemInfo.team_1_players as EventTeamMemberType[];
    }

    if (itemInfo && !itemInfo.team_2_players) {
      try {
        team_2_members = await getTeamMembers(event_id, itemInfo.team_2 || "") || [];
        const teamTwoPlayersClean = team_2_members.map(member => ({
          ...member,
          goals: 0,
          yellowCards: 0,
          redCards: 0,
          penalties: 0,
        }));
        team_2_members = teamTwoPlayersClean;
        await saveHarmonogramItemTeamPlayers(event_id, item_id, 2, teamTwoPlayersClean);
      } catch (error) {
        console.error("Error fetching team 2 members:", error);
      }
    } else if (itemInfo && itemInfo.team_2_players) {
      team_2_members = itemInfo.team_2_players as EventTeamMemberType[];
    }

  } catch (error) {
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

  const matchTime 
  = itemInfo ? Math.floor((new Date(`1970-01-01 ${itemInfo.end_time}`).getTime() - new Date(`1970-01-01 ${itemInfo.start_time}`).getTime()) / 1000) : 0;

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
        <h1 className="text-2xl font-normal"> Mecz nr: <span className="font-bold">{itemInfo ? `${itemInfo.LP}` : ""}</span>{"   "}rozpoczęcie: <span className="font-bold">{itemInfo ? itemInfo.start_time : ""}</span>{"   "}koniec: <span className="font-bold">{itemInfo ? itemInfo.end_time : ""}</span></h1>        
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
            className="object-contain rounded "
          />}
            <p className="text-2xl font-bold text-center">{itemInfo ? itemInfo.team_2 : ""}</p>
        </div>
      </div>
      <HandballGame
        eventId={event_id}
        team_1_name={itemInfo?.team_1 || ""}
        team_2_name={itemInfo?.team_2 || ""}
        matchTime={matchTime}
        isUserCreator={isUserCreator} 
        team_1_members={team_1_members}
        team_2_members={team_2_members}
      />      
    </div>
  );
}

