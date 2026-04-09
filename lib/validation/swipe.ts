import { z } from 'zod'

export const createSwipeSchema = z.object({
  targetUserId: z.string().uuid(),
  direction: z.enum(['like', 'pass']),
})

export type CreateSwipeInput = z.infer<typeof createSwipeSchema>