'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/auth/client'
import { LogOut, User, Shield } from 'lucide-react'

export default function Settings() {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <h1 className="text-2xl font-bold text-center text-pink-600">Settings</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Account Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold flex items-center">
              <User className="w-5 h-5 mr-2" />
              Account
            </h2>
          </div>
          <div className="p-4 space-y-2">
            <button className="w-full text-left p-3 rounded hover:bg-gray-50">
              Change Password
            </button>
            <button className="w-full text-left p-3 rounded hover:bg-gray-50">
              Privacy Settings
            </button>
          </div>
        </div>

        {/* Safety Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Safety
            </h2>
          </div>
          <div className="p-4 space-y-2">
            <button className="w-full text-left p-3 rounded hover:bg-gray-50">
              Blocked Users
            </button>
            <button className="w-full text-left p-3 rounded hover:bg-gray-50">
              Report History
            </button>
          </div>
        </div>

        {/* Sign Out */}
        <div className="bg-white rounded-lg shadow-sm">
          <button
            onClick={handleSignOut}
            className="w-full p-4 text-left text-red-600 hover:bg-red-50 rounded-lg flex items-center"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}