import { z } from 'zod'

export const createProfileSchema = z.object({
  userId: z.string().uuid(),
  firstName: z.string().min(1).max(50),
  birthdate: z.string().refine((date) => {
    const d = new Date(date)
    const age = new Date().getFullYear() - d.getFullYear()
    return age >= 18
  }, 'Must be at least 18 years old'),
  bio: z.string().max(500).optional(),
  gender: z.enum(['male', 'female', 'other']),
  interestedIn: z.enum(['male', 'female', 'everyone']),
  city: z.string().max(100).optional(),
  maxDistanceKm: z.number().min(1).max(1000).default(50),
  minAgePreference: z.number().min(18).max(99).default(18),
  maxAgePreference: z.number().min(18).max(99).default(99),
  isComplete: z.boolean().default(false),
})

export const updateProfileSchema = createProfileSchema.partial().omit({ userId: true })

export type CreateProfileInput = z.infer<typeof createProfileSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>