// import AthleteCard from "@/components/AthleteCard";
import { getAthleteById } from "@/lib/athletes.actions";
import { createUser } from "@/lib/users.actions";
import { CreateAthlete } from "@/types";
import { auth } from "@clerk/nextjs/server";

export default async function AthletePage({ params }: { params: Promise<{ athlete_id: string }> }) {

  const { athlete_id } = await params;

  const { userId } = await auth();
  if ( userId ) {await createUser()}

  console.log("Athlete id: ", athlete_id);

  // const athlete: CreateAthlete = await getAthleteById(athlete_id);

  // console.log("Athlete data in AthletePage:", athlete);

  return (
    <div className="flex items-center justify-center flex-col w-11/12 mx-auto mt-20 gap-4 mb-20">
      Hello
      {/* <AthleteCard {...athlete} /> */}
    </div>
  );
}