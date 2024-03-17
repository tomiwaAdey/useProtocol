import { useState } from 'react'
import useSignIn from '@/hooks/useSignIn'
import { DynamicWidget } from '@dynamic-labs/sdk-react-core'
import { Button } from '@/components/ui/button'

export default function SignInPage() {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const { isLoading, error, signIn } = useSignIn()

  const handleSignIn = async () => {
    try {
      await signIn()
      setIsSignedIn(true)
    } catch (error) {
      console.error('Sign-in failed:', error)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>Sign in to your account</h2>
        </div>
        {!isSignedIn ? (
          <div>
            {!isLoading && !error && <DynamicWidget variant='dropdown' />}
            {isLoading && <p className='mt-2 text-sm text-gray-500'>Signing in...</p>}
            {error && <p className='mt-2 text-sm text-red-600'>{error.message}</p>}
          </div>
        ) : (
          <div>
            <p className='text-center text-lg font-medium text-gray-900'>Welcome! You are now signed in.</p>
            <Button
              type='button'
              className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              onClick={() => setIsSignedIn(false)}>
              Sign Out
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
