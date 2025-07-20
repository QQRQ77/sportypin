'use server'

import { auth } from "@clerk/nextjs/server";
import createSupabaseClient from "./supabase";
import { CreateTeam } from "@/types";

export async function createTeam(formData: CreateTeam) {
  const { userId: creator } = await auth();
  const supabase = createSupabaseClient();

  const { data, error } = await supabase.from('Teams').insert({...formData, creator}).select();
  if (error || !data || data.length === 0) {
    console.error('Error creating team:', error);
    throw new Error(error?.message || 'Failed to create team');
  }

  return data[0];
}