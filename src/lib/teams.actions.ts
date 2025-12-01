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

export async function searchTeams(query: string): Promise<{ id: string; name: string }[]> {
  if (!query) return [];
  const supabase = createSupabaseClient();
  const { data } = await supabase
    .from('Teams')
    .select('id, name')
    .ilike('name', `%${query}%`)
    .limit(8);
  return (data ?? []).map((i) => ({ id: i.id, name: i.name }));
}

export async function getTeamLogoURL(teamId: string) {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('Teams')
    .select('imageUrls')
    .eq('id', teamId)
    .single();
  if (error) {
    console.error('Error fetching team logo URL:', error);
    throw new Error(error.message || 'Failed to fetch team logo URL');
  }
  return data?.imageUrls || null;
}