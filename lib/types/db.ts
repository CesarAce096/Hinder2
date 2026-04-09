import { users, profiles, profilePhotos, interests, profileInterests, swipes, matches, conversations, messages, reports, blocks } from '@/lib/db/schema'

export type User = typeof users.$inferSelect
export type Profile = typeof profiles.$inferSelect
export type ProfilePhoto = typeof profilePhotos.$inferSelect
export type Interest = typeof interests.$inferSelect
export type ProfileInterest = typeof profileInterests.$inferSelect
export type Swipe = typeof swipes.$inferSelect
export type Match = typeof matches.$inferSelect
export type Conversation = typeof conversations.$inferSelect
export type Message = typeof messages.$inferSelect
export type Report = typeof reports.$inferSelect
export type Block = typeof blocks.$inferSelect

export type ProfileWithPhotos = Profile & {
  photos: ProfilePhoto[]
  interests: Interest[]
}