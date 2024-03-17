// src/app/dashboard.tsx
import { LinkComponent } from '@/components/LinkComponent'
import { useAuth } from '../context/AuthContext'

export default function DashboardPage() {
  const { isLoggedIn } = useAuth()

  if (!isLoggedIn) {
    return (
      <>
        <div>Please sign in to access the dashboard.</div>
        <button>
          <LinkComponent href='/signin'>Sign In</LinkComponent>
        </button>
      </>
    )
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <div className='flex'>
        <div className='w-1/4'>
          {/* Left Sidebar */}
          <nav>
            <ul>
              <li>Home</li>
              <li>My Works</li>
              <li>Settings</li>
            </ul>
          </nav>
        </div>
        <div className='w-3/4'>
          {/* Dashboard Content */}
          <h2>Tasks to Complete</h2>
          <ul>
            <li>Complete your profile</li>
            <li>Register your first IP</li>
            <li>Sell your first license</li>
            <li>Set up payment preferences</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
