import { useParams } from 'next/navigation';

'use client';


export default function HandballMatchPage() {
  const params = useParams();
  const eventId = params.event_id;
  const itemId = params.item_id;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Handball Match</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Event ID</h2>
              <p className="text-2xl font-mono text-blue-600">{eventId}</p>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Item ID</h2>
              <p className="text-2xl font-mono text-blue-600">{itemId}</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-gray-600">
            Event: <strong>{eventId}</strong>
          </p>
          <p className="text-gray-600">
            Match: <strong>{itemId}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}