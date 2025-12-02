import TeamCardSmall from "@/components/teams/TeamCardSmall";
import { getTeams } from "@/lib/teams.actions";
import { createUser } from "@/lib/users.actions";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";


export default async function Page() {
  const session = await auth();
  if ( session.userId ) {await createUser()}

  const teams = await getTeams()

  return (
    <main className="flex items-center justify-center flex-col w-11/12 mx-auto mt-10 gap-4 mb-20">
        <Image
          src="/images/logo_team.png"
          alt="Sport Teams Logo"
          width={500}
          height={500}
        />
      <h1 className="text-2xl font-bold">Zespoły</h1>
      <p className="text-lg">Lista zespołów sportowych</p>
      <section className="flex justify-center items-center gap-4">
        {teams && teams.length > 0 ? (
          
            teams.map((team) => (
              <TeamCardSmall key={team.id} team={team} />
            ))
          
        ) : (
          <p className="text-lg">Brak zespołów do wyświetlenia.</p>
        )}
      </section>
    </main>
  );
}