'use server'

import { auth } from "@clerk/nextjs/server";
import createSupabaseClient from "./supabase";
import { CreateAthlete } from "@/types";

export async function createAthlete(formData: CreateAthlete) {
  const session = await auth();
  const creator = session.userId;
  if (!creator) {
    throw new Error("User not authenticated");
  }

  const creator_name = session.sessionClaims.userFullName || session.sessionClaims.userName || creator.slice(0, 16); // Fallback to first 8 characters of userId if fullName is not available

  const supabase = createSupabaseClient();

  const { data, error } = await supabase.from('Athletes').insert({...formData, creator, creator_name}).select();
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