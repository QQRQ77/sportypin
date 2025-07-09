import CreateEventForm from "@/components/forms/CreateEventForm";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function Page() {

  const { userId } = await auth();
  if (!userId) redirect("/login");

  return (
    <div className="flex items-center justify-center flex-col w-11/12 mx-auto mt-10 gap-4 mb-20">
      <Image
        src="/images/logo_events.png"
        alt="Sport Event Logo"
        width={140}
        height={140}
      />
      <h1 className="text-2xl font-bold">Dodaj zawody</h1>
      <p className="text-lg">Formularz dodawania wydarzenia sportowego</p>
      <CreateEventForm />
    </div>
  );
}