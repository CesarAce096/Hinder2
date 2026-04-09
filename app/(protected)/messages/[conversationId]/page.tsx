'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Send } from 'lucide-react'
import Image from 'next/image'

export default function Chat() {
  const { conversationId } = useParams() as { conversationId: string }
  const [message, setMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await fetch('/api/auth/me')
      if (!response.ok) throw new Error('Failed to get current user')
      return response.json()
    },
  })

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      const response = await fetch(`/api/messages/${conversationId}`)
      if (!response.ok) throw new Error('Failed to fetch messages')
      return response.json()
    },
    enabled: !!conversationId,
  })

  const sendMutation = useMutation({
    mutationFn: async (body: string) => {
      const response = await fetch(`/api/messages/${conversationId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body }),
      })
      if (!response.ok) throw new Error('Failed to send message')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] })
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
      setMessage('')
    },
  })

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !sendMutation.isPending) {
      sendMutation.mutate(message.trim())
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <h1 className="text-xl font-bold text-center text-pink-600">Chat</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg: any) => (
          <div
            key={msg.id}
            className={`flex ${msg.senderUserId === currentUser?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.senderUserId === currentUser?.id
                  ? 'bg-pink-500 text-white'
                  : 'bg-white text-gray-800'
              }`}
            >
              <p>{msg.body}</p>
              <p className={`text-xs mt-1 ${
                msg.senderUserId === currentUser?.id ? 'text-pink-100' : 'text-gray-400'
              }`}>
                {new Date(msg.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t p-4">
        <form onSubmit={handleSend} className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500"
            disabled={sendMutation.isPending}
          />
          <button
            type="submit"
            disabled={!message.trim() || sendMutation.isPending}
            className="px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  )
}