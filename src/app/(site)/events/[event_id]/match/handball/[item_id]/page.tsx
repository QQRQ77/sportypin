import Link from "next/link";

export default async function HandballMatchPage({ params }: { params: Promise<{ event_id: string, item_id: string }> }) {

  const { event_id, item_id } = await params;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Link href={`/events/${event_id}`} className="text-blue-500 hover:underline ">
        Powrót do strony turnieju
      </Link>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Handball Match</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Event ID</h2>
              <p className="text-2xl font-mono text-blue-600">{event_id}</p>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Item ID</h2>
              <p className="text-2xl font-mono text-blue-600">{item_id}</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-gray-600">
            Event: <strong>{event_id}</strong>
          </p>
          <p className="text-gray-600">
            Match: <strong>{item_id}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}