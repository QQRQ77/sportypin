import TeamCard from "@/components/TeamCard";
import { getTeamById } from "@/lib/teams.actions";
import { createUser } from "@/lib/users.actions";
import { CreateTeam } from "@/types";
import { auth } from "@clerk/nextjs/server";

export default async function AthletePage({ params }: { params: Promise<{ team_Id: string }> }) {

  const { team_Id } = await params;

  const { userId } = await auth();
  if ( userId ) {await createUser()}

  const team: CreateTeam = await getTeamById(team_Id);

  return (
    <div className="flex items-center justify-center flex-col w-11/12 mx-auto mt-20 gap-4 mb-20">
      <TeamCard team={team}/>
    </div>
  );
}