'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EventsList from "./EventsList";
import { useState } from "react";

export type Event = {
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
    creator_name?: string;
    contact_email?: string;
    contact_phone?: string;
    followers?: string[];
};

interface EventsTabProps {
    likedEvents?: Array<Event>;
    usersEvents?: Array<Event>;
    upcomingEvents?: Array<Event>;
    pastEvents?: Array<Event>;
    userId?: string | null;
}

export default function EventsTab({ likedEvents, usersEvents, upcomingEvents, pastEvents, userId }: EventsTabProps) {
  const [activeTab, setActiveTab] = useState((likedEvents && likedEvents.length > 0) ? 'likedEvents' : 'upcomingEvents');

  return (
    <div className="flex flex-col gap-2 items-start justify-center w-full h-full">
      <h1 className="text-2xl font-bold mb-4">Wydarzenia</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex gap-2">
        <TabsList className="bg-gray-300">
          {userId && <TabsTrigger value="likedEvents" className="cursor-pointer">Obserwowane</TabsTrigger>}
          {userId && <TabsTrigger value="userEvents" className="cursor-pointer">Twoje</TabsTrigger>}
          <TabsTrigger value="upcomingEvents" className="cursor-pointer">Nadchodzące</TabsTrigger>
          <TabsTrigger value="pastEvents" className="cursor-pointer">Archiwalne</TabsTrigger>
        </TabsList>
        {userId && <TabsContent value="likedEvents">
          <h2 className="my-2">Wydarzenia obserwowane przez ciebie.</h2>
          <EventsList events={likedEvents} userId={userId}/>
        </TabsContent>}
        {userId && <TabsContent value="userEvents">
          <h2 className="my-2">Wydarzenia dodane przez ciebie.</h2>
          <EventsList events={usersEvents} userId={userId}/>
        </TabsContent>}
        <TabsContent value="upcomingEvents">
          <h2 className="my-2">Wydarzenia aktualne i nadchodzące.</h2>
          <EventsList events={upcomingEvents} userId={userId}/>
        </TabsContent>
        <TabsContent value="pastEvents">
          <h2 className="my-2">Wydarzenia zakończone i archiwalne.</h2>
          <EventsList events={pastEvents} userId={userId}/>
        </TabsContent>
      </Tabs>
    </div>
  );

}
