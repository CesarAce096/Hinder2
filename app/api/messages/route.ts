import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/guards'
import { getUserConversations } from '@/lib/services/message-service'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()

    const conversations = await getUserConversations(user.id)

    return NextResponse.json(conversations)
  } catch (error: any) {
    console.error('Messages error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get conversations' },
      { status: 500 }
    )
  }
}