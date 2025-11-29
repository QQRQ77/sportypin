'use server'

import { auth } from "@clerk/nextjs/server";
import createSupabaseClient from "./supabase";
import { CreateAthlete } from "@/types";

export async function createAthlete(formData: CreateAthlete) {
  const { userId: creator } = await auth();
  const supabase = createSupabaseClient();

  const { data, error } = await supabase.from('Athletes').insert({...formData, creator}).select();
  if (error || !data || data.length === 0) {
    console.error('Error creating athlete:', error);
    throw new Error(error?.message || 'Failed to create athlete');
  }

  return data[0];
}

export async function getAthleteById(athleteId: string) {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('Athletes')
    .select('*')
    .eq('id', athleteId);

  if (error) {
    console.error('Error fetching athlete:', error);
    throw new Error(error.message || 'Failed to fetch athlete');
  }

  return data[0];
}