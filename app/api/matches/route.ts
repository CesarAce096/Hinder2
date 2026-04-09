import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/guards'
import { getUserMatches } from '@/lib/services/match-service'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()

    const matches = await getUserMatches(user.id)

    return NextResponse.json(matches)
  } catch (error: any) {
    console.error('Matches error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get matches' },
      { status: 500 }
    )
  }
}