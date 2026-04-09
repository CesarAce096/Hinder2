import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/guards'
import { getConversationMessages, sendMessage } from '@/lib/services/message-service'

interface RouteParams {
  params: Promise<{ conversationId: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { conversationId } = await params
  try {
    const user = await requireAuth()

    const messages = await getConversationMessages(conversationId, user.id)

    return NextResponse.json(messages)
  } catch (error: any) {
    console.error('Get messages error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get messages' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { conversationId } = await params
  try {
    const user = await requireAuth()

    const { body } = await request.json()

    if (!body || typeof body !== 'string' || body.trim().length === 0) {
      return NextResponse.json({ error: 'Message body is required' }, { status: 400 })
    }

    const message = await sendMessage(conversationId, user.id, body.trim())

    return NextResponse.json(message)
  } catch (error: any) {
    console.error('Send message error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send message' },
      { status: 400 }
    )
  }
}