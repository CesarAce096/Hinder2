import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/guards'

export async function GET() {
  try {
    const user = await requireAuth()
    return NextResponse.json({ id: user.id, email: user.email })
  } catch (error: any) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}