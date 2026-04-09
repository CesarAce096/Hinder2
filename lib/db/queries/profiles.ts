import { db } from '@/lib/db'
import { profiles, profilePhotos, profileInterests, interests } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function getProfileByUserId(userId: string) {
  const result = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1)

  return result[0] || null
}

export async function createProfile(data: typeof profiles.$inferInsert) {
  const result = await db.insert(profiles).values(data).returning()
  return result[0]
}

export async function updateProfile(userId: string, data: Partial<typeof profiles.$inferInsert>) {
  const result = await db
    .update(profiles)
    .set(data)
    .where(eq(profiles.userId, userId))
    .returning()
  return result[0]
}

export async function getProfileWithPhotos(userId: string) {
  const profile = await getProfileByUserId(userId)
  if (!profile) return null

  const photos = await db
    .select()
    .from(profilePhotos)
    .where(eq(profilePhotos.userId, userId))
    .orderBy(profilePhotos.displayOrder)

  const profileInterestRecords = await db
    .select({
      interest: interests,
    })
    .from(profileInterests)
    .innerJoin(interests, eq(profileInterests.interestId, interests.id))
    .where(eq(profileInterests.profileId, profile.id))

  const interestsList = profileInterestRecords.map(record => record.interest)

  return {
    ...profile,
    photos,
    interests: interestsList,
  }
}