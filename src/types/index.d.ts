interface CreateAthlete {
  id?: string;
  creator?: string;
  creator_name?: string;
  first_name: string;
  last_name?: string;
  teams?: string[];
  sports?: string[];
  cathegories?: string[];
  home_team_name?: string;
  home_team_id?: string;
  home_team_logo_URL?: string[];
  birth_day?: number;
  birth_month?: string;
  birth_year?: number;
  imageUrls?: string[];
  contact_email?: string;
  contact_phone?: string;
}

interface CreateTeam {
  name: string;
  host_city?: string;
  sports?: string[];
  creator_name?: string;
  cathegories?: string[];
  members?: string[];
  zip_code?: string;
  imageUrls?: string[];
  contact_email?: string;
  contact_phone?: string;
}

type TeamSmall = {
  id: string;
  name: string;
  host_city?: string;
  sports: string[];
  cathegories?: string[];
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
    creator: string;
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
    organizator?: string;
    event_type?: string;
    harmonogram?: HarmonogramItem[];
    participants?: Participant[];
    classification?: ClassificationItem[];
    followers?: string[];
    imageUrls?: string[];
    lat: number;
    lng: number;
};

export type HarmonogramItem = {
      id: string,
      description?: string,
      team_1?: string,
      team_1_id?: string,
      team_2?: string,
      team_2_id?: string,
      athlete_1?: string,
      athlete_1_id?: string,
      athlete_2?: string,
      athlete_2_id?: string,
      date: string,
      start_time?: string,
      end_time?: string,
      cathegory?: string,
      itemType?: string,
      score?: string,
      LP?: number,
}

export type Participant = {
      id?: string,
      athlete_id?: string,
      itemType?: string,
      first_name?: string,
      second_name?: string,
      team_name?: string,
      team_id?: string,
      imageUrls?: string[];
      birth_date?: string,
      start_number?: number | "",
      cathegory?: string,
      name?: string,
}

export type ClassificationItem = {
      id: string,
      description: string,
      place?: number,
      score?: string,
      cathegory?: string,
      team_id?: string,
      athlete_id?: string,
      imageUrls?: string[];
}

