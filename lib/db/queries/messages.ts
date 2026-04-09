import { db } from '@/lib/db'
import { messages, conversations, matches, profiles, profilePhotos, profileInterests, interests } from '@/lib/db/schema'
import { eq, or, and, desc } from 'drizzle-orm'
import type { ConversationWithMessages } from '@/lib/types/api'

export async function getConversationsForUser(userId: string): Promise<ConversationWithMessages[]> {
  // Get all matches for user
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

  const conversationsWithData: ConversationWithMessages[] = []

  for (const record of matchRecords) {
    const otherUserId = record.match.userAId === userId ? record.match.userBId : record.match.userAId

    // Get other user's profile
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

    const profileInterestRecords = await db
      .select({
        interest: interests,
      })
      .from(profileInterests)
      .innerJoin(interests, eq(profileInterests.interestId, interests.id))
      .where(eq(profileInterests.profileId, otherProfile[0].id))

    const interestsList = profileInterestRecords.map(record => record.interest)

    // Get messages
    const messageRecords = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, record.conversation.id))
      .orderBy(desc(messages.createdAt))
      .limit(50) // Last 50 messages

    const messagesList = messageRecords.reverse().map(msg => ({
      id: msg.id,
      conversationId: msg.conversationId,
      senderUserId: msg.senderUserId,
      body: msg.body,
      createdAt: msg.createdAt.toISOString(),
      readAt: msg.readAt?.toISOString() || null,
    }))

    conversationsWithData.push({
      id: record.conversation.id,
      matchId: record.match.id,
      createdAt: record.conversation.createdAt.toISOString(),
      messages: messagesList,
      otherUser: {
        ...otherProfile[0],
        photos,
        interests: interestsList,
      },
    })
  }

  return conversationsWithData
}

export async function getMessagesForConversation(conversationId: string, userId: string) {
  // Verify user has access to this conversation
  const conversation = await db
    .select({
      conversation: conversations,
      match: matches,
    })
    .from(conversations)
    .where(eq(conversations.id, conversationId))
    .innerJoin(matches, eq(matches.id, conversations.matchId))
    .limit(1)

  if (!conversation[0]) {
    throw new Error('Conversation not found')
  }

  const match = conversation[0].match
  if (match.userAId !== userId && match.userBId !== userId) {
    throw new Error('Unauthorized')
  }

  const messageRecords = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(desc(messages.createdAt))
    .limit(100)

  return messageRecords.reverse()
}

export async function createMessage(data: typeof messages.$inferInsert) {
  const result = await db.insert(messages).values(data).returning()
  return result[0]
}