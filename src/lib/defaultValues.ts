import { EventTeamMemberType } from "@/types";

export const defaultEventTeamMember: EventTeamMemberType = {
  id: "",
  athlete_id: "",
  name: "",
  start_number: "",
  goals: 0,
  yellowCards: 0,
  redCards: 0,
  penalties: 0
};

export const harmonogramDefaultItem = {
      id: "",
      description: "",
      team_1: "",
      team_1_id: "",
      team_1_players:[defaultEventTeamMember],
      team_2: "",
      team_2_id: "",
      team_2_players: [defaultEventTeamMember],
      athlete_1: "",
      athlete_1_id: "",
      athlete_2: "",
      athlete_2_id: "",
      date: "",
      start_time: "",
      end_time: "",
      cathegory: "",
      itemType: "",
      score: "",
      team_1_score: 0,
      team_2_score: 0,
      athlete_1_score: 0,
      athlete_2_score: 0,
      LP: 0,
}