import { getMatchesForUser } from '@/lib/db/queries/matches'
import type { MatchWithProfile } from '@/lib/types/api'

export async function getUserMatches(userId: string): Promise<MatchWithProfile[]> {
  return getMatchesForUser(userId)
}