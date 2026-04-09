'use client'

import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import type { MatchWithProfile } from '@/lib/types/api'

export default function Matches() {
  const { data: matches = [], isLoading } = useQuery({
    queryKey: ['matches'],
    queryFn: async () => {
      const response = await fetch('/api/matches')
      if (!response.ok) throw new Error('Failed to fetch matches')
      return response.json() as Promise<MatchWithProfile[]>
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
        <h1 className="text-2xl font-bold text-center text-pink-600">Matches</h1>
      </div>

      {/* Matches Grid */}
      <div className="p-4">
        {matches.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No matches yet. Keep swiping!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {matches.map((match) => {
              const primaryPhoto = match.profile.photos.find(p => p.isPrimary) || match.profile.photos[0]

              return (
                <Link
                  key={match.id}
                  href={`/messages/${match.id}`}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition"
                >
                  <div className="aspect-square relative">
                    {primaryPhoto ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${primaryPhoto.storagePath}`}
                        alt={`${match.profile.firstName}'s photo`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-2xl">
                          {match.profile.firstName[0]}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-sm">{match.profile.firstName}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}