'use server'

import { auth } from "@clerk/nextjs/server";
import createSupabaseClient from "./supabase";
import { CreateTeam } from "@/types";

export async function createEvent(formData: CreateTeam) {
  const { userId: creator } = await auth();
  const supabase = createSupabaseClient();

  const { data, error } = await supabase.from('Events').insert({...formData, creator}).select();
  if (error || !data || data.length === 0) {
    console.error('Error creating athlete:', error);
    throw new Error(error?.message || 'Failed to create athlete');
  }

  return data[0];
}

export async function getEventsSmall() {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('Events')
    .select('*')
    // .select('id, name, start, city'); // podaj tutaj tylko potrzebne kolumny

  if (error) {
    console.error('Error fetching events:', error);
    throw new Error(error.message || 'Failed to fetch events');
  }

  return data;
}