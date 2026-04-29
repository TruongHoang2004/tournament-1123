export type Category = 
  | "Advanced Men's Doubles"
  | "Mixed-Level Men's Doubles"
  | "Intermediate Men's Doubles"
  | "Advanced Mixed Doubles"
  | "Intermediate Mixed Doubles"
  | "Women's Doubles";

export type Round = "Group Stage" | "Semi-finals" | "Final";

export interface Team {
  id: number;
  name: string;
  group: "A" | "B";
  points: number; // Total accumulated points
  members: string[];
}

export interface Match {
  id: string;
  category: Category;
  round: Round;
  team1Id: number;
  team2Id: number;
  score1: number;
  score2: number;
  status: 'LIVE' | 'FINISHED' | 'UPCOMING';
  pointsEarned1: number;
  pointsEarned2: number;
}

export interface TournamentState {
  teams: Team[];
  matches: Match[];
}
