import { db } from '@/lib/db'
import { matches, conversations, profiles, profilePhotos, users } from '@/lib/db/schema'
import { eq, or, and } from 'drizzle-orm'
import type { MatchWithProfile } from '@/lib/types/api'

export async function createMatch(data: typeof matches.$inferInsert) {
  const result = await db.insert(matches).values(data).returning()
  return result[0]
}

export async function createConversation(data: typeof conversations.$inferInsert) {
  const result = await db.insert(conversations).values(data).returning()
  return result[0]
}

export async function getMatchBetweenUsers(userAId: string, userBId: string) {
  const result = await db
    .select()
    .from(matches)
    .where(or(
      and(eq(matches.userAId, userAId), eq(matches.userBId, userBId)),
      and(eq(matches.userAId, userBId), eq(matches.userBId, userAId))
    ))
    .limit(1)

  return result[0] || null
}

export async function getMatchesForUser(userId: string): Promise<MatchWithProfile[]> {
  const matchRecords = await db
    .select({
      match: matches,
      conversation: conversations,
    })
    .from(matches)
    .where(and(
      or(eq(matches.userAId, userId), eq(matches.userBId, userId)),
      eq(matches.isActive, true)
    ))
    .innerJoin(conversations, eq(conversations.matchId, matches.id))

  const matchesWithProfiles: MatchWithProfile[] = []

  for (const record of matchRecords) {
    const otherUserId = record.match.userAId === userId ? record.match.userBId : record.match.userAId

    const otherProfile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, otherUserId))
      .limit(1)

    if (!otherProfile[0]) continue

    const photos = await db
      .select()
      .from(profilePhotos)
      .where(eq(profilePhotos.userId, otherUserId))
      .orderBy(profilePhotos.displayOrder)

    const profileWithPhotos = {
      ...otherProfile[0],
      photos,
      interests: [], // Could add interests if needed
    }

    matchesWithProfiles.push({
      ...record.match,
      createdAt: record.match.createdAt.toISOString(),
      profile: profileWithPhotos,
    })
  }

  return matchesWithProfiles
}