import { getConversationsForUser, getMessagesForConversation, createMessage } from '@/lib/db/queries/messages'
import { getMatchBetweenUsers } from '@/lib/db/queries/matches'
import type { ConversationWithMessages } from '@/lib/types/api'

export async function getUserConversations(userId: string): Promise<ConversationWithMessages[]> {
  return getConversationsForUser(userId)
}

export async function getConversationMessages(conversationId: string, userId: string) {
  return getMessagesForConversation(conversationId, userId)
}

export async function sendMessage(conversationId: string, senderUserId: string, body: string) {
  // Verify user can send to this conversation
  const messages = await getMessagesForConversation(conversationId, senderUserId)

  const message = await createMessage({
    conversationId,
    senderUserId,
    body,
  })

  return message
}