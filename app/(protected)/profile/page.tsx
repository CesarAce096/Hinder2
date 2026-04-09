'use client'

import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import { Edit, MapPin, Calendar } from 'lucide-react'
import { calculateAge } from '@/lib/utils/dates'

export default function Profile() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await fetch('/api/profile')
      if (!response.ok) throw new Error('Failed to fetch profile')
      return response.json()
    },
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Profile not found</p>
      </div>
    )
  }

  const primaryPhoto = profile.photos?.find((p: any) => p.isPrimary) || profile.photos?.[0]
  const age = calculateAge(profile.birthdate)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-pink-600">Profile</h1>
        <Link
          href="/profile/edit"
          className="p-2 bg-pink-500 text-white rounded-full hover:bg-pink-600"
        >
          <Edit className="w-5 h-5" />
        </Link>
      </div>

      <div className="p-4">
        {/* Photos */}
        {primaryPhoto && (
          <div className="mb-6">
            <Image
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${primaryPhoto.storagePath}`}
              alt="Profile photo"
              width={200}
              height={200}
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Info */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-2">
            {profile.firstName}, {age}
          </h2>

          {profile.city && (
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              {profile.city}
            </div>
          )}

          {profile.bio && (
            <p className="text-gray-700 mb-4">{profile.bio}</p>
          )}

          <div className="space-y-2">
            <p><strong>Gender:</strong> {profile.gender}</p>
            <p><strong>Interested in:</strong> {profile.interestedIn}</p>
          </div>
        </div>
      </div>
    </div>
  )
}