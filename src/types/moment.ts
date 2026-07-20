import type { MomentType } from '@/lib/constants';

export type Moment = {
  id: number;
  matchId: number;
  title: string;
  momentType: MomentType;
  timeLabel: string | null;
  subject: string | null;
  description: string | null;
  memoryNote: string | null;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
};
