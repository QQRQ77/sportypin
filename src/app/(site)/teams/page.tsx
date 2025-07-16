import { createUser } from "@/lib/users.actions";
import { auth } from "@clerk/nextjs/server";

export default async function Page() {
  const session = await auth();
  if ( session.userId ) {await createUser()}

  return (
    <div className="flex items-center justify-center flex-col w-11/12 mx-auto mt-10 gap-4 mb-20">
      <h1 className="text-2xl font-bold">Zespoły</h1>
      <p className="text-lg">Lista zespołów sportowych</p>
      {/* Here you would typically render a list of events */}
    </div>
  );
}