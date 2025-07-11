// type User = {
//   name: string;
//   email: string;
//   image?: string;
//   accountId: string;
// };

import { EmailOtpType } from "@supabase/supabase-js";

enum Subject {
  maths = "maths",
  language = "language",
  science = "science",
  history = "history",
  coding = "coding",
  geography = "geography",
  economics = "economics",
  finance = "finance",
  business = "business",
}

type Companion = Models.DocumentList<Models.Document> & {
  $id: string;
  name: string;
  subject: Subject;
  topic: string;
  duration: number;
  bookmarked: boolean;
};

interface CreateAthlete {
  first_name: string;
  second_name?: string;
  teams?: string[];
  home_team?: string;
  birth_day?: number;
  birth_month?: number;
  birth_year?: number;
}

interface CreateTeam {
  name: string;
  host_city?: string;
  members?: string[];
  zip_code?: string;
  birth_day?: number;
  birth_month?: number;
  birth_year?: number;
}

interface CreateEvent{
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

interface GetAllCompanions {
  limit?: number;
  page?: number;
  subject?: string | string[];
  topic?: string | string[];
}

interface BuildClient {
  key?: string;
  sessionToken?: string;
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

interface Avatar {
  userName: string;
  width: number;
  height: number;
  className?: string;
}


interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

interface CompanionComponentProps {
  companionId: string;
  subject: string;
  topic: string;
  name: string;
  userName: string;
  userImage: string;
  voice: string;
  style: string;
}