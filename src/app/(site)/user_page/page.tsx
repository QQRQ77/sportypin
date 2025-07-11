import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function UserPage() {
  
  const { userId } = await auth();
  if (!userId) redirect("/login");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">User Page</h1>
      <p className="text-lg">This is the user page content.</p>
    </div>
  );
}