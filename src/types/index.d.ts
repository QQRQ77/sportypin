import { EmailOtpType } from "@supabase/supabase-js";

interface CreateAthlete {
  first_name: string;
  second_name?: string;
  teams?: string[];
  home_team?: string;
  birth_day?: number;
  birth_month?: string;
  birth_year?: number;
  imageUrls?: string[];
}

interface CreateTeam {
  name: string;
  host_city?: string;
  members?: string[];
  zip_code?: string;
  birth_day?: number;
  birth_month?: number;
  birth_year?: number;
  imageUrls?: string[];
}

interface CreateEvent{
  name: string;
  event_type?: string;
  description?: string;
  organizator?: string;
  start_date: timestamp;
  end_date?: timestamp;
  sports?: string[];
  cathegories?: string[];
  contact_email?: string;
  contact_phone?: string;
  place_name?: string;
  city: string;
  address?: string;
  zip_code?: string;
  country?: string;
  imageUrls?: string[];
}

type EventSmall = {
  id: string;
  creator: string;
  name: string;
  event_type: string;
  description?: string;
  organizator?: string;
  start_date: timestamp;
  end_date?: timestamp;
  sports: string[];
  cathegories?: string[];
  contact_email?: string;
  contact_phone?: string;
  place_name?: string;
  city: string;
  address?: string;
  zip_code?: string;
}

interface CreateVenue{
  name: string;
  venue_type?: string;
  description?: string;
  organizator?: string;
  sports?: string[];
  contact_email?: string;
  contact_phone?: string;
  accessibility?: string;
  city: string;
  address?: string;
  zip_code?: string;
  country?: string;
  imageUrls?: string[];
}

type CreateUser = {
  userId: string;
  userName?: string;
  userFullName?: string;
  userEmail: string;
}


interface CreateUser {
  email: string;
  name: string;
  image?: string;
  accountId: string;
}

interface SearchParams {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export type Venue = {
    id: string;
    name: string;
    venue_type?: string;
    organizator?: string;
    city: string;
    zip_code?: string;
    address?: string;
    lng: number;
    lat: number;
    description?: string;
    accessibility?: string;
    sports?: string[];
    creator?: string;
    creator_name?: string;
    contact_email?: string;
    contact_phone?: string;
    followers?: string[];
    imageUrls?: string[]
};

export type Event = {
    id: string;
    name: string;
    start_date: string;
    end_date?: string;
    city: string;
    zip_code?: string;
    address?: string;
    place_name?: string;
    description?: string;
    sports?: string[];
    cathegories?: string[];
    creator_name?: string;
    contact_email?: string;
    contact_phone?: string;
    followers?: string[];
    imageUrls?: string[]
};


