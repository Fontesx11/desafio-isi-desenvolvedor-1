import { ClubStanding } from '../interfaces/standing.interface.js';

export class StandingResponseDto {
  position: number;
  club_id: number;
  club_name: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  points: number;

  constructor(standing: ClubStanding) {
    this.position = standing.position;
    this.club_id = standing.clubId;
    this.club_name = standing.clubName;
    this.played = standing.played;
    this.wins = standing.wins;
    this.draws = standing.draws;
    this.losses = standing.losses;
    this.goals_for = standing.goalsFor;
    this.goals_against = standing.goalsAgainst;
    this.goal_difference = standing.goalDifference;
    this.points = standing.points;
  }
}
