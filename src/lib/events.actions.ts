'use server'

import { auth } from "@clerk/nextjs/server";
import createSupabaseClient from "./supabase";
import { CreateEvent, HarmonogramItem } from "@/types";
import { formatAddressForGeocoding, googleGeocodeAddress } from "./maps";
import { getUserObservedEventsIds } from "./users.actions";
import { Event } from "@/types";

export async function createEvent(formData: CreateEvent) {
  const session = await auth();
  const creator = session.userId;
  if (!creator) {
    throw new Error("User not authenticated");
  }
  const creator_name = session.sessionClaims.userFullName || session.sessionClaims.userName || creator.slice(0, 16); // Fallback to first 8 characters of userId if fullName is not available

  const supabase = createSupabaseClient();

  const adress = formData.address || "";
  const city = formData.city || "";
  const postalCode = formData.zip_code || "";
  const country = formData.country || "Polska"; 

  const fullAdress = await formatAddressForGeocoding(adress, city, postalCode, country);

  const geocodeResult = await googleGeocodeAddress(fullAdress);
  const lat = Number(geocodeResult?.lat || 0);
  const lng = Number(geocodeResult?.lng || 0);

  const { data, error } = await supabase.from('Events').insert({...formData, creator, lat, lng, creator_name}).select();
  if (error || !data || data.length === 0) {
    console.error('Error creating event:', error);
    throw new Error(error?.message || 'Failed to create event');
  }

  return data[0];
}

export async function getUpcomingEvents() {
  const supabase = createSupabaseClient();
  // Sortuj eventy według start_date rosnąco (od najwcześniejszego)
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('Events')
    .select('*')
    .order('start_date', { ascending: true })
    .filter('start_date', 'gte', today)
    .limit(20); // Pobierz maksymalnie 100 nadchodzących wydarzeń
    // .select('id, name, start, city'); // podaj tutaj tylko potrzebne kolumny

  if (error) {
    console.error('Error fetching events:', error);
    throw new Error(error.message || 'Failed to fetch events');
  }

  return data;
}

export async function getPastEvents() {
  const supabase = createSupabaseClient();
  // Sortuj eventy według start_date rosnąco (od najwcześniejszego)
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('Events')
    .select('*')
    .order('start_date', { ascending: false })
    .filter('start_date', 'lte', today)
    .limit(20)
    // .select('id, name, start, city'); // podaj tutaj tylko potrzebne kolumny

  if (error) {
    console.error('Error fetching events:', error);
    throw new Error(error.message || 'Failed to fetch events');
  }

  return data;
}

export async function getUserEvents() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const supabase = createSupabaseClient();
  
  const { data, error } = await supabase
    .from('Events')
    .select('*')
    .eq('creator', userId)
    .order('start_date', { ascending: false })
    .limit(20); // Pobierz maksymalnie 20 nadchodzących wydarzeń stworzonych przez usera

  if (error) {
    console.error('Error fetching events:', error);
    throw new Error(error.message || 'Failed to fetch events');
  }

  return data;
}

export async function getObservedEvents() {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const observedEvents = await getUserObservedEventsIds()

    if (!observedEvents || observedEvents.length === 0) return []

    const supabase = createSupabaseClient();
  
    const { data, error } = await supabase
      .from('Events')
      .select('*')
      .in('id', observedEvents)
      .order('start_date', { ascending: false })
      .limit(20); // Pobierz maksymalnie 20 nadchodzących wydarzeń stworzonych przez usera

    if (error) {
      console.error('Error fetching events:', error);
      throw new Error(error.message || 'Failed to fetch events');
    }

    return data;
}

export async function ToggleEventFollower(eventId: string, followerId: string) {
  
  const supabase = createSupabaseClient();

// 1. Pobierz aktualną tablicę
  const { data: event, error: fetchError } = await supabase
    .from("Events")
    .select("followers")
    .eq("id", eventId)
    .single();

  if (fetchError || !event) {
    console.error(fetchError);
    return;
  }

  const followers: string[] = event.followers || [];

  // 2. Przełącz obecność userId
  const updatedFollowers = followers.includes(followerId)
    ? followers.filter((id) => id !== followerId)
    : [...followers, followerId];

  // 3. Zapisz
  const { error: updateError } = await supabase
    .from("Events")
    .update({ followers: updatedFollowers })
    .eq("id", eventId);

  if (updateError) {
    console.error(updateError);
  } else return "success"


}

export async function getEventById(eventId: string) {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from('Events')
    .select('*')
    .eq('id', eventId);

  // Usuń pole "creator" z wyniku
  if (data && data.length > 0) {
    delete data[0].creator;
    delete data[0].followers; // Usuń również creator_name, jeśli istnieje
  }

  if (error) {
    console.error('Error fetching events:', error);
    throw new Error(error.message || 'Failed to fetch events');
  }

  return data[0];

}

export async function updateEvent(formData: CreateEvent, eventId: string, eventCreatorId: string) {
  const session = await auth();
  const creator = session.userId;
  if (!creator) {
      throw new Error("User not authenticated");
  }

  if (creator != eventCreatorId) {
    throw new Error("User is not event's creator")
  }

  const adress = formData.address || "";
  const city = formData.city || "";
  const postalCode = formData.zip_code || "";
  const country = formData.country || "Polska"; 

  const fullAdress = await formatAddressForGeocoding(adress, city, postalCode, country);

  const geocodeResult = await googleGeocodeAddress(fullAdress);
  const lat = Number(geocodeResult?.lat || 0);
  const lng = Number(geocodeResult?.lng || 0);

  const supabase = createSupabaseClient();

  const { data, error } = await supabase.from('Events').update({...formData, creator, lat, lng}).eq('id', eventId).select('*');
  
  if (error || !data || data.length === 0) {
    console.error('Error updating event:', error);
    throw new Error(error?.message || 'Failed to update event');
  }

  return data[0];
}

export async function reorderHarmonogram(eventId: string, newHarmonogram: HarmonogramItem[]) {
  const session = await auth();
  const user = session.userId;
  if (!user) {
      throw new Error("User not authenticated");
  }

  const creator = await findEventCreatorId(eventId);
  if (user !== creator) {
    throw new Error("User is not event's creator");
  }
  

  
}

export async function findEventCreatorId(eventId: string) {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from('Events')
    .select('creator')
    .eq('id', eventId)
    .single();

  if (error || !data) {
    console.error('Error fetching event creator:', error);
    throw new Error(error?.message || 'Failed to fetch event creator');
  }

  return data.creator || "";
}

export async function saveHarmonogram(eventId: string, harmonogram: HarmonogramItem[]) {
  const session = await auth();
  const user = session.userId;
  if (!user) {
      throw new Error("User not authenticated");
  }

  const creator = await findEventCreatorId(eventId);
  if (user !== creator) {
    throw new Error("User is not event's creator");
  }

  const supabase = createSupabaseClient();

  const {data, error} = await supabase
    .from('Events')
    .update({ harmonogram })
    .eq('id', eventId)
    .select('harmonogram');
  
  if (error || !data) {
    console.error('Error fetching event creator:', error);
    throw new Error(error?.message || 'Failed to fetch event creator');
  }

  return "success";
} 