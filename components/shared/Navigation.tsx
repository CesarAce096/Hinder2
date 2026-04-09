'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Heart, MessageCircle, User, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/discover', label: 'Discover', icon: Heart },
  { href: '/matches', label: 'Matches', icon: MessageCircle },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center p-2 rounded-lg transition',
                isActive ? 'text-pink-500' : 'text-gray-500 hover:text-pink-500'
              )}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}