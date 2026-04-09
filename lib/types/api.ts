import { ProfileWithPhotos } from './db'

export type DiscoveryCandidate = ProfileWithPhotos & {
  age: number
  distance?: number
}

export type MatchWithProfile = {
  id: string
  userAId: string
  userBId: string
  createdAt: string
  isActive: boolean
  profile: ProfileWithPhotos
}

export type ConversationWithMessages = {
  id: string
  matchId: string
  createdAt: string
  messages: {
    id: string
    conversationId: string
    senderUserId: string
    body: string
    createdAt: string
    readAt: string | null
  }[]
  otherUser: ProfileWithPhotos
}