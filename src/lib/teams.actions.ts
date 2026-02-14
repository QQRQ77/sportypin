'use server'

import { auth } from "@clerk/nextjs/server";
import createSupabaseClient from "./supabase";
import { CreateTeam } from "@/types";

export async function createTeam(formData: CreateTeam) {
  const session = await auth();
  const creator = session.userId;
  if (!creator) {
    throw new Error("User not authenticated");
  }
  const creator_name = session.sessionClaims.userFullName || session.sessionClaims.userName || creator.slice(0, 16); // Fallback to first 8 characters of userId if fullName is not available

  const supabase = createSupabaseClient();

  const { data, error } = await supabase.from('Teams').insert({...formData, creator, creator_name}).select();
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

export async function getTeamById(teamId: string) {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('Teams')
    .select('*')
    .eq('id', teamId);

  if (error) {
    console.error('Error fetching athlete:', error);
    throw new Error(error.message || 'Failed to fetch athlete');
  }

  return data[0];
}

export async function getTeams() {
  const supabase = createSupabaseClient();
  
  const { data, error } = await supabase
    .from('Teams')
    .select('id, name, host_city, imageUrls, sports, cathegories, logoUrl')
    .limit(20); // Pobierz maksymalnie 100 nadchodzących wydarzeń

  if (error) {
    console.error('Error fetching events:', error);
    throw new Error(error.message || 'Failed to fetch events');
  }

  return data;
}