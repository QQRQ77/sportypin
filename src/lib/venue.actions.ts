'use server'

import { auth } from "@clerk/nextjs/server";
import createSupabaseClient from "./supabase";
import { formatAddressForGeocoding, googleGeocodeAddress } from "./maps";
import { CreateVenue } from "@/types";
import { getUserObservedVenuesIds } from "./users.actions";

export async function createVenue(formData: CreateVenue) {
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

  const { data, error } = await supabase.from('Venues').insert({...formData, creator, lat, lng, creator_name}).select();
  if (error || !data || data.length === 0) {
    console.error('Error creating venue:', error);
    throw new Error(error?.message || 'Failed to create venue');
  }

  return data[0];
}

export async function getVenues() {
  const supabase = createSupabaseClient();
  
  const { data, error } = await supabase
    .from('Venues')
    .select('*')
    .limit(20)
    // .select('id, name, start, city'); // podaj tutaj tylko potrzebne kolumny

  if (error) {
    console.error('Error fetching venues:', error);
    throw new Error(error.message || 'Failed to fetch venues');
  }

  return data;
}

export async function getUserVenues() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const supabase = createSupabaseClient();
  
  const { data, error } = await supabase
    .from('Venues')
    .select('*')
    .eq('creator', userId)
    .limit(20); // Pobierz maksymalnie 20 obiektów dodanych do bazy przez usera

  if (error) {
    console.error('Error fetching venues:', error);
    throw new Error(error.message || 'Failed to fetch venues');
  }

  return data;
}

export async function getObservedVenues() {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const observedVenues = await getUserObservedVenuesIds()

    if (!observedVenues || observedVenues.length === 0) return []

    const supabase = createSupabaseClient();
  
    const { data, error } = await supabase
      .from('Venues')
      .select('*')
      .in('id', observedVenues)
      .limit(20); // Pobierz maksymalnie 20 obiektów

    if (error) {
      console.error('Error fetching venues:', error);
      throw new Error(error.message || 'Failed to fetch venues');
    }

    return data;
}

export async function ToggleVenueFollower(eventId: string, followerId: string) {
  
  const supabase = createSupabaseClient();

// 1. Pobierz aktualną tablicę
  const { data: event, error: fetchError } = await supabase
    .from("Venues")
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
    .from("Venues")
    .update({ followers: updatedFollowers })
    .eq("id", eventId);

  if (updateError) {
    console.error(updateError);
  } else return "success"


}

export async function searchVenuesRanked(name = "") {
  const supabase = createSupabaseClient();

  // wszystkie słowa z nazwy i adresu
  const words = [...new Set([...name.split(/\s+/)])]
    .filter(Boolean)
    .map(w => w.toLowerCase());

  if (!words.length) return [];

  // jedno wywołanie RPC – ranking po stronie bazy
  const { data, error } = await supabase
    .rpc("venues_search_ranked", { search_terms: words });

  if (error) throw error;
  return data; // już posortowane po hits DESC
}

