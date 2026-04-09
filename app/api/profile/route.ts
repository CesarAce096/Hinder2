import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/guards'
import { createProfile, updateProfile, getProfileByUserId } from '@/lib/db/queries/profiles'
import { createProfileSchema, updateProfileSchema } from '@/lib/validation/profile'

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()

    const body = await request.json()
    const validatedData = createProfileSchema.parse(body)

    // Ensure user can only create profile for themselves
    if (validatedData.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const profile = await createProfile(validatedData)

    return NextResponse.json(profile)
  } catch (error: any) {
    console.error('Profile creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create profile' },
      { status: 400 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()

    const profile = await getProfileByUserId(user.id)

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    return NextResponse.json(profile)
  } catch (error: any) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth()

    const body = await request.json()
    const validatedData = updateProfileSchema.parse(body)

    const profile = await updateProfile(user.id, validatedData)

    return NextResponse.json(profile)
  } catch (error: any) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update profile' },
      { status: 400 }
    )
  }
}