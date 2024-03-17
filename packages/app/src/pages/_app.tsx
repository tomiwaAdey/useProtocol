import { PropsWithChildren } from 'react'
import { Layout } from '@/components/Layout'
import { ToastProvider } from '@/context/Toaster'
import { DynamicContextProvider, DynamicWidget } from '@dynamic-labs/sdk-react-core'
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector'
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum'
import { getCsrfToken } from 'next-auth/react'
import type { AppProps } from 'next/app'
import '@/styles/global.css'
import { useRouter } from 'next/router'
import { AuthProvider, useAuth } from '../context/AuthContext'

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const { isLoggedIn, setIsLoggedIn } = useAuth()

  return (
    <AuthProvider>
      <DynamicContextProvider
        settings={{
          environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID ?? '',
          walletConnectors: [EthereumWalletConnectors],
          eventsCallbacks: {
            onAuthSuccess: async (event) => {
              const { authToken } = event
              const csrfToken = (await getCsrfToken()) || ''

              try {
                const response = await fetch('/api/auth/callback/credentials', {
                  mode: 'no-cors',
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                  },
                  body: `csrfToken=${encodeURIComponent(csrfToken)}&token=${encodeURIComponent(authToken)}`,
                })

                if (response.ok) {
                  console.log('LOGGED IN', response)
                  setIsLoggedIn(true)
                  router.push('/set-username')
                } else {
                  console.error('Failed to log in')
                }
              } catch (error) {
                console.error('Error logging in', error)
              }
            },
          },
        }}>
        <DynamicWagmiConnector>
          <ToastProvider>
            <Layout>
              {isLoggedIn && <DynamicWidget />}
              <Component {...pageProps} />
            </Layout>
          </ToastProvider>
        </DynamicWagmiConnector>
      </DynamicContextProvider>
    </AuthProvider>
  )
}
