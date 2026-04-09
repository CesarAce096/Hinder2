import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/guards'
import { processSwipe } from '@/lib/services/swipe-service'
import { createSwipeSchema } from '@/lib/validation/swipe'

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()

    const body = await request.json()
    const validatedData = createSwipeSchema.parse(body)

    const result = await processSwipe(user.id, validatedData)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Swipe error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process swipe' },
      { status: 400 }
    )
  }
}