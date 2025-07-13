'use server'

import { auth } from "@clerk/nextjs/server";
import createSupabaseClient from "./supabase";
import { CreateEvent, CreateTeam } from "@/types";
import { formatAddressForGeocoding, googleGeocodeAddress } from "./maps";

export async function createEvent(formData: CreateEvent) {
  const { userId: creator } = await auth();
  if (!creator) {
    throw new Error("User not authenticated");
  }

  const supabase = createSupabaseClient();

  const adress = formData.address || "";
  const city = formData.city || "";
  const postalCode = formData.zip_code || "";
  const country = formData.country || "Polska"; 

  const fullAdress = await formatAddressForGeocoding(adress, city, postalCode, country);

  const geocodeResult = await googleGeocodeAddress(fullAdress);
  const lat = Number(geocodeResult?.lat || 0);
  const lng = Number(geocodeResult?.lng || 0);

  const { data, error } = await supabase.from('Events').insert({...formData, creator, lat, lng}).select();
  if (error || !data || data.length === 0) {
    console.error('Error creating athlete:', error);
    throw new Error(error?.message || 'Failed to create athlete');
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
  // Sortuj eventy według start_date rosnąco (od najwcześniejszego)
  const today = new Date().toISOString().split('T')[0];
  
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