import { db } from '@/lib/db'
import { createSwipe, hasSwipedOnUser, getSwipeDirection } from '@/lib/db/queries/swipes'
import { createMatch, createConversation, getMatchBetweenUsers } from '@/lib/db/queries/matches'
import type { CreateSwipeInput } from '@/lib/validation/swipe'

export async function processSwipe(swiperUserId: string, input: CreateSwipeInput) {
  const { targetUserId, direction } = input

  // Check if already swiped
  if (await hasSwipedOnUser(swiperUserId, targetUserId)) {
    throw new Error('Already swiped on this user')
  }

  // Create swipe in transaction
  const swipe = await db.transaction(async (tx) => {
    const swipe = await createSwipe({
      swiperUserId,
      targetUserId,
      direction,
    })

    // Check if mutual like
    if (direction === 'like') {
      const theirSwipe = await getSwipeDirection(targetUserId, swiperUserId)
      if (theirSwipe === 'like') {
        // Create match
        const match = await createMatch({
          userAId: swiperUserId < targetUserId ? swiperUserId : targetUserId,
          userBId: swiperUserId < targetUserId ? targetUserId : swiperUserId,
        })

        // Create conversation
        await createConversation({
          matchId: match.id,
        })

        return { swipe, matchCreated: true, match }
      }
    }

    return { swipe, matchCreated: false }
  })

  return swipe
}