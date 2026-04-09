import { db } from '@/lib/db'
import { profiles, profilePhotos, profileInterests, interests, swipes, blocks, users } from '@/lib/db/schema'
import { eq, and, or, notInArray, not, sql, desc } from 'drizzle-orm'
import { calculateDistance } from '@/lib/utils/distance'
import { calculateAge } from '@/lib/utils/dates'
import type { DiscoveryCandidate } from '@/lib/types/api'

export async function getDiscoveryCandidates(currentUserId: string, limit = 20): Promise<DiscoveryCandidate[]> {
  // Get current user's profile
  const currentProfile = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, currentUserId))
    .limit(1)

  if (!currentProfile[0]) {
    return []
  }

  const profile = currentProfile[0]

  // Get users already swiped on
  const swipedUserIds = await db
    .select({ targetUserId: swipes.targetUserId })
    .from(swipes)
    .where(eq(swipes.swiperUserId, currentUserId))

  const swipedIds = swipedUserIds.map(s => s.targetUserId)

  // Get blocked users (both directions)
  const blockedUserIds = await db
    .select({ blockedUserId: blocks.blockedUserId })
    .from(blocks)
    .where(or(
      eq(blocks.blockerUserId, currentUserId),
      eq(blocks.blockedUserId, currentUserId)
    ))

  const blockedIds = blockedUserIds.map(b => b.blockedUserId)

  // Exclude current user, swiped, blocked, incomplete profiles, inactive users
  const excludeIds = [currentUserId, ...swipedIds, ...blockedIds]

  // Build query for candidates
  const candidatesQuery = db
    .select({
      profile: profiles,
      primaryPhoto: profilePhotos,
    })
    .from(profiles)
    .leftJoin(
      profilePhotos,
      and(
        eq(profilePhotos.userId, profiles.userId),
        eq(profilePhotos.isPrimary, true)
      )
    )
    .where(and(
      eq(profiles.isComplete, true),
      eq(users.status, 'active'),
      notInArray(profiles.userId, excludeIds),
      // Gender preferences
      profile.interestedIn === 'everyone' ?
        sql`true` :
        profile.interestedIn === 'male' ?
          eq(profiles.gender, 'male') :
          eq(profiles.gender, 'female'),
      // Age preferences
      sql`${profiles.birthdate} >= ${new Date(Date.now() - (profile.maxAgePreference + 1) * 365 * 24 * 60 * 60 * 1000)}`,
      sql`${profiles.birthdate} <= ${new Date(Date.now() - profile.minAgePreference * 365 * 24 * 60 * 60 * 1000)}`
    ))
    .innerJoin(users, eq(users.id, profiles.userId))
    .orderBy(sql`RANDOM()`)
    .limit(limit * 2) // Get more to filter distance

  const candidates = await candidatesQuery

  // Enrich with photos and interests
  const enrichedCandidates: DiscoveryCandidate[] = []

  for (const candidate of candidates) {
    // Filter distance
    if (profile.latitude && profile.longitude && candidate.profile.latitude && candidate.profile.longitude) {
      const dist = calculateDistance(
        profile.latitude,
        profile.longitude,
        candidate.profile.latitude,
        candidate.profile.longitude
      )
      if (dist > profile.maxDistanceKm) continue
    }

    const photos = await db
      .select()
      .from(profilePhotos)
      .where(eq(profilePhotos.userId, candidate.profile.userId))
      .orderBy(profilePhotos.displayOrder)

    const profileInterestRecords = await db
      .select({
        interest: interests,
      })
      .from(profileInterests)
      .innerJoin(interests, eq(profileInterests.interestId, interests.id))
      .where(eq(profileInterests.profileId, candidate.profile.id))

    const interestsList = profileInterestRecords.map(record => record.interest)

    const age = calculateAge(candidate.profile.birthdate)

    let distance: number | undefined
    if (profile.latitude && profile.longitude && candidate.profile.latitude && candidate.profile.longitude) {
      distance = calculateDistance(
        profile.latitude,
        profile.longitude,
        candidate.profile.latitude,
        candidate.profile.longitude
      )
    }

    enrichedCandidates.push({
      ...candidate.profile,
      photos,
      interests: interestsList,
      age,
      distance,
    })

    if (enrichedCandidates.length >= limit) break
  }

  return enrichedCandidates
}