import { createUser } from "@/lib/users.actions";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";


export default async function Page() {
  
  const session = await auth();
  
  if ( session.userId ) {await createUser()}

  return (
    <main className="flex items-center justify-center flex-col w-11/12 mx-auto mt-10 gap-4 mb-20">
      <Image
          src="/images/logo_athlete.png"
          alt="Sport Athlete Logo"
          width={500}
          height={500}
        />      
      <h1 className="text-2xl font-bold">Sportowcy</h1>
      <p className="text-lg">Lista sportowców - zawodników</p>
    </main>
  );
}