import type { TeamCode } from '@/lib/constants';

export type Match = {
  id: number;
  homeTeamCode: TeamCode;
  awayTeamCode: TeamCode;
  matchDate: string | null;
  homeScore: number | null;
  awayScore: number | null;
  createdAt: string;
  updatedAt: string;
};
