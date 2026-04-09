import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/guards'
import { getCandidatesForUser } from '@/lib/services/discovery-service'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')

    const candidates = await getCandidatesForUser(user.id, limit)

    return NextResponse.json(candidates)
  } catch (error: any) {
    console.error('Discovery error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get discovery candidates' },
      { status: 500 }
    )
  }
}