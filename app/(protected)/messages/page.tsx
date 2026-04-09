'use client'

import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import type { ConversationWithMessages } from '@/lib/types/api'

export default function Messages() {
  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const response = await fetch('/api/messages')
      if (!response.ok) throw new Error('Failed to fetch conversations')
      return response.json() as Promise<ConversationWithMessages[]>
    },
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <h1 className="text-2xl font-bold text-center text-pink-600">Messages</h1>
      </div>

      {/* Conversations List */}
      <div className="divide-y divide-gray-200">
        {conversations.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No conversations yet. Start chatting with your matches!</p>
          </div>
        ) : (
          conversations.map((conversation) => {
            const primaryPhoto = conversation.otherUser.photos.find(p => p.isPrimary) || conversation.otherUser.photos[0]
            const lastMessage = conversation.messages[conversation.messages.length - 1]

            return (
              <Link
                key={conversation.id}
                href={`/messages/${conversation.matchId}`}
                className="flex items-center p-4 bg-white hover:bg-gray-50 transition"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  {primaryPhoto ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${primaryPhoto.storagePath}`}
                      alt={`${conversation.otherUser.firstName}'s photo`}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">
                        {conversation.otherUser.firstName[0]}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{conversation.otherUser.firstName}</p>
                  {lastMessage && (
                    <p className="text-sm text-gray-600 truncate">
                      {lastMessage.body}
                    </p>
                  )}
                </div>
                {lastMessage && (
                  <div className="text-xs text-gray-400">
                    {new Date(lastMessage.createdAt).toLocaleDateString()}
                  </div>
                )}
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}