import AthleteCardSmall from "@/components/athletes/SmallAthleteCard";
import { getAthletes } from "@/lib/athletes.actions";
import { getTeamLogoByTeamId } from "@/lib/teams.actions";
import { createUser } from "@/lib/users.actions";
import { CreateAthlete } from "@/types";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";


export default async function Page() {
  
  const session = await auth();
  
  if ( session.userId ) {await createUser()}

  const athletes: CreateAthlete[] = await getAthletes();
  for (const athlete of athletes) {
    const teamLogoURL = athlete.home_team_id ? await getTeamLogoByTeamId(athlete.home_team_id) : "";
    athlete.home_team_logo_URL = teamLogoURL;}

  return (
    <main className="flex items-center justify-center flex-col w-11/12 mx-auto gap-4">
      <Image
          src="/images/logo_athlete.png"
          alt="Sport Athlete Logo"
          width={500}
          height={500}
        />      
      <h1 className="text-2xl font-bold">Sportowcy</h1>
      <p className="text-lg">Lista sportowców - zawodników</p>
      <section className="flex justify-center items-center gap-4">
        {athletes && athletes.length > 0 ? (
            athletes.map((athlete) => (
              <AthleteCardSmall key={athlete.id} athlete={athlete} />
            ))
        ) : (
          <p className="text-lg">Brak zespołów do wyświetlenia.</p>
        )}
      </section>
    </main>
  );
}