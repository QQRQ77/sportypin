import VenueSearchFormAndCards from "@/components/forms/VenueSearchFormAndCards";
import { createUser } from "@/lib/users.actions";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";

export default async function Page() {
    const { userId } = await auth();
    if ( userId ) {await createUser()} 
    
    return (
      <main className="flex items-center justify-center flex-col w-11/12 mx-auto mt-4 gap-4 mb-20">
        <div className="w-full flex items-center justify-center gap-5 flex-col lg:flex-row">
          <Image
          src="/images/logo_place.png"
          alt="Sport Venues Logo"
          width={300}
          height={300}
          />
          <h1>OBIEKTY SPORTOWE</h1>
        </div>
        <VenueSearchFormAndCards userId={userId || ""}/>
      </main>
  )
}