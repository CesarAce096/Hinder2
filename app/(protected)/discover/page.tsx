'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { Heart, X, MapPin, Calendar } from 'lucide-react'
import type { DiscoveryCandidate } from '@/lib/types/api'

export default function Discover() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const { data: candidates = [], isLoading, refetch } = useQuery({
    queryKey: ['discovery'],
    queryFn: async () => {
      const response = await fetch('/api/discovery')
      if (!response.ok) throw new Error('Failed to fetch candidates')
      return response.json() as Promise<DiscoveryCandidate[]>
    },
  })

  const currentCandidate = candidates[currentIndex]

  const handleSwipe = async (direction: 'like' | 'pass') => {
    if (!currentCandidate) return

    try {
      const response = await fetch('/api/swipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId: currentCandidate.userId,
          direction,
        }),
      })

      if (!response.ok) {
        console.error('Swipe failed')
        return
      }

      // Move to next candidate
      if (currentIndex < candidates.length - 1) {
        setCurrentIndex(currentIndex + 1)
      } else {
        // Refetch more candidates
        setCurrentIndex(0)
        refetch()
      }
    } catch (error) {
      console.error('Swipe error:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Finding matches...</p>
        </div>
      </div>
    )
  }

  if (!currentCandidate) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No more candidates right now.</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600"
          >
            Refresh
          </button>
        </div>
      </div>
    )
  }

  const primaryPhoto = currentCandidate.photos.find(p => p.isPrimary) || currentCandidate.photos[0]

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <h1 className="text-2xl font-bold text-center text-pink-600">Discover</h1>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm h-[600px] overflow-hidden relative">
          {primaryPhoto && (
            <div className="relative h-3/4">
              <Image
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${primaryPhoto.storagePath}`}
                alt={`${currentCandidate.firstName}'s photo`}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold">
                {currentCandidate.firstName}, {currentCandidate.age}
              </h2>
              {currentCandidate.distance && (
                <div className="flex items-center text-gray-500 text-sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  {Math.round(currentCandidate.distance)} km
                </div>
              )}
            </div>

            {currentCandidate.city && (
              <p className="text-gray-600 mb-2">{currentCandidate.city}</p>
            )}

            {currentCandidate.bio && (
              <p className="text-gray-700 mb-4">{currentCandidate.bio}</p>
            )}

            {currentCandidate.interests.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {currentCandidate.interests.slice(0, 3).map((interest) => (
                  <span
                    key={interest.id}
                    className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm"
                  >
                    {interest.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 flex justify-center space-x-8">
        <button
          onClick={() => handleSwipe('pass')}
          className="w-16 h-16 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center hover:border-red-500 hover:text-red-500 transition"
        >
          <X className="w-8 h-8" />
        </button>
        <button
          onClick={() => handleSwipe('like')}
          className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center hover:bg-pink-600 transition"
        >
          <Heart className="w-8 h-8 text-white" />
        </button>
      </div>
    </div>
  )
}