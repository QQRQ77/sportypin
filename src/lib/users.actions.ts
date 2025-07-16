'use server'

import { auth } from "@clerk/nextjs/server";
import createSupabaseClient from "./supabase";
import { revalidatePath } from "next/cache";
import { ToggleEventFollower } from "./events.actions";

export async function createUser() {
  const session = await auth();
  if (!session) {
    throw new Error("Not authenticated")
  }
  const supabase = createSupabaseClient();

  const userId = session.userId;

  if (!(await checkUserExist(userId))) {

  const userFullName = session.sessionClaims?.userFullName;
  const userEmail = session.sessionClaims?.userEmail;
  const userName = session.sessionClaims?.userName;
  
  const { data, error } = await supabase.from('Users').insert({userId, userFullName, userEmail, userName}).select();
  if (error || !data || data.length === 0) {
    console.error('Error creating athlete:', error);
    throw new Error(error?.message || 'Failed to create athlete');
  }

  return "success"}
}

export async function checkUserExist(userId: string | null) {

  const supabase = createSupabaseClient();

  const { data, error } = await supabase.from("Users").select().eq('userId', userId);
    if (error) {
    console.error('Error checking user exist:', error);
    return true
  }

  if (!data || data.length === 0) return false

  if (data) return true 
  
}

export async function toggleObserveEvent({
  eventId,
}: {
  eventId: string;
}) {

  const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }

  const supabase = createSupabaseClient();

  // 1. Pobierz aktualną tablicę
  const { data: user, error: fetchError } = await supabase
    .from("Users")
    .select("observedEvents")
    .eq("userId", userId)
    .single();

  if (fetchError || !user) {
    console.error(fetchError);
    return;
  }

  const observedEvents: string[] = user.observedEvents || [];

  // 2. Przełącz obecność eventId
  const updatedEvents = observedEvents.includes(eventId)
    ? observedEvents.filter((id) => id !== eventId)
    : [...observedEvents, eventId];

  // 3. Zapisz
  const { error: updateError } = await supabase
    .from("Users")
    .update({ observedEvents: updatedEvents })
    .eq("userId", userId);

  const result = await ToggleEventFollower(eventId, userId)

  if (result != "success") {throw new Error("Adding Follower to Event failed.")}

  if (updateError) {
    console.error(updateError);
  } else {
    revalidatePath("/events"); 
  }
}

export async function getUserObservedEventsIds() {
  const { userId } = await auth();
  {if (!userId) {
    throw new Error("User not authenticated");
  }}

  const supabase = createSupabaseClient();

  // 1. Pobierz aktualną tablicę
  const { data, error: fetchError } = await supabase
    .from("Users")
    .select("observedEvents")
    .eq("userId", userId)
    .single();
      
  if (fetchError || !data) {
    console.error(fetchError);
    return;
  }

  return data.observedEvents || []
}