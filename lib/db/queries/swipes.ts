import { db } from '@/lib/db'
import { swipes } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function createSwipe(data: typeof swipes.$inferInsert) {
  const result = await db.insert(swipes).values(data).returning()
  return result[0]
}

export async function hasSwipedOnUser(swiperUserId: string, targetUserId: string): Promise<boolean> {
  const result = await db
    .select()
    .from(swipes)
    .where(and(
      eq(swipes.swiperUserId, swiperUserId),
      eq(swipes.targetUserId, targetUserId)
    ))
    .limit(1)

  return result.length > 0
}

export async function getSwipeDirection(swiperUserId: string, targetUserId: string): Promise<'like' | 'pass' | null> {
  const result = await db
    .select({ direction: swipes.direction })
    .from(swipes)
    .where(and(
      eq(swipes.swiperUserId, swiperUserId),
      eq(swipes.targetUserId, targetUserId)
    ))
    .limit(1)

  return (result[0]?.direction as 'like' | 'pass') || null
}