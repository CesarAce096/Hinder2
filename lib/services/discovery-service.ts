import { getDiscoveryCandidates } from '@/lib/db/queries/discovery'
import type { DiscoveryCandidate } from '@/lib/types/api'

export async function getCandidatesForUser(userId: string, limit = 20): Promise<DiscoveryCandidate[]> {
  return getDiscoveryCandidates(userId, limit)
}