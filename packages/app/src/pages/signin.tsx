import { useState } from 'react'
import { DynamicWidget } from '@dynamic-labs/sdk-react-core'
import { Button } from '@/components/ui/button'
import { useAuth } from '../context/AuthContext'

export default function SignInPage() {
  const { isLoggedIn, setIsLoggedIn } = useAuth()
  const handleLogout = () => {
    setIsLoggedIn(false)
  }
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>Sign in to your account</h2>
        </div>
        {!isLoggedIn ? (
          <div>{<DynamicWidget variant='dropdown' />}</div>
        ) : (
          <div>
            <p className='text-center text-lg font-medium text-gray-900'>Welcome! You are already signed in.</p>
            <Button
              type='button'
              className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
