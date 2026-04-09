import { Navigation } from '@/components/shared/Navigation'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="pb-16"> {/* Add padding bottom for navigation */}
      {children}
      <Navigation />
    </div>
  )
}