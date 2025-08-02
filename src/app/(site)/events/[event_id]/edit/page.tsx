import { notFound } from "next/navigation";
import CreateEventForm from "@/components/forms/CreateEventForm";
import { getEventById } from "@/lib/events.actions";
import Image from "next/image";

export default async function EditEventPage({
  params,
}: {
  params: { event_id: string };
}) {

  const { event_id } = await params;

  const event = await getEventById(event_id);
  if (!event) notFound();

  // zwracamy ten sam formularz, tylko w trybie edycji
  return (
      <div className="flex items-center justify-center flex-col w-11/12 mx-auto mt-10 gap-4 mb-20">
        <Image
          src="/images/logo_events.png"
          alt="Sport Event Logo"
          width={140}
          height={140}
        />
        <h1 className="text-2xl font-bold">Edytuj zawody</h1>
        <p className="text-lg">Formularz edycji wydarzenia sportowego</p>
        <CreateEventForm eventToEdit={event} />
      </div>)
}