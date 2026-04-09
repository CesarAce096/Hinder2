'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

export default function EditProfile() {
  const [formData, setFormData] = useState({
    firstName: '',
    birthdate: '',
    bio: '',
    gender: '',
    interestedIn: '',
    city: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await fetch('/api/profile')
      if (!response.ok) throw new Error('Failed to fetch profile')
      return response.json()
    },
  })

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        birthdate: profile.birthdate || '',
        bio: profile.bio || '',
        gender: profile.gender || '',
        interestedIn: profile.interestedIn || '',
        city: profile.city || '',
      })
    }
  }, [profile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update profile')
      }

      router.push('/profile')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">Edit Profile</h2>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          <div>
            <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700">
              Birthdate
            </label>
            <input
              id="birthdate"
              name="birthdate"
              type="date"
              required
              value={formData.birthdate}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
              placeholder="Tell us about yourself..."
            />
          </div>
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              required
              value={formData.gender}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="interestedIn" className="block text-sm font-medium text-gray-700">
              Interested In
            </label>
            <select
              id="interestedIn"
              name="interestedIn"
              required
              value={formData.interestedIn}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
            >
              <option value="">Select preference</option>
              <option value="male">Men</option>
              <option value="female">Women</option>
              <option value="everyone">Everyone</option>
            </select>
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              id="city"
              name="city"
              type="text"
              value={formData.city}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
              placeholder="Your city"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}