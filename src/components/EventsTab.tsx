'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EventsList from "./EventsList";
import { useState } from "react";

type Event = {
    id: string;
    name: string;
    start_date: string;
    end_date?: string;
    city: string;
    address: string;
    place_name: string;
    description?: string;
    sports?: string[];
    cathegories?: string[];
};

interface EventsTabProps {
    likedEvents?: Array<Event>;
    usersEvents?: Array<Event>;
    upcomingEvents?: Array<Event>;
    pastEvents?: Array<Event>;
    isUserId: boolean;
}

export default function EventsTab({ likedEvents, usersEvents, upcomingEvents, pastEvents, isUserId }: EventsTabProps) {
  const [activeTab, setActiveTab] = useState((likedEvents && likedEvents.length > 0) ? 'likedEvents' : 'upcomingEvents');

  return (
    <div className="flex flex-col gap-2 items-start justify-center w-full h-full">
      <h1 className="text-2xl font-bold mb-4">Wydarzenia</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex gap-2">
        <TabsList className="bg-gray-300">
          {isUserId && <TabsTrigger value="likedEvents">Obserwowane</TabsTrigger>}
          {isUserId && <TabsTrigger value="userEvents">Twoje</TabsTrigger>}
          <TabsTrigger value="upcomingEvents">Nadchodzące</TabsTrigger>
          <TabsTrigger value="pastEvents">Archiwalne</TabsTrigger>
        </TabsList>
        {isUserId && <TabsContent value="likedEvents">
          <h2 className="my-2">Wydarzenia obserwowane przez ciebie.</h2>
          <EventsList events={likedEvents} />
        </TabsContent>}
        {isUserId && <TabsContent value="userEvents">
          <h2 className="my-2">Wydarzenia stworzone przez ciebie.</h2>
          <EventsList events={usersEvents} />
        </TabsContent>}
        <TabsContent value="upcomingEvents">
          <h2 className="my-2">Wydarzenia aktualne i nadchodzące.</h2>
          <EventsList events={upcomingEvents} />
        </TabsContent>
        <TabsContent value="pastEvents">
          <h2 className="my-2">Wydarzenia zakończone i archiwalne.</h2>
          <EventsList events={pastEvents} />
        </TabsContent>
      </Tabs>
    </div>
  );

}
