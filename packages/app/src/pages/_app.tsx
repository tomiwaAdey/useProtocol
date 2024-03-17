import { PropsWithChildren } from 'react'
import { Layout } from '@/components/Layout'
import { ToastProvider } from '@/context/Toaster'
import { DynamicContextProvider, DynamicWidget } from '@dynamic-labs/sdk-react-core'
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector'
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum'
import { getCsrfToken } from 'next-auth/react'
import type { AppProps } from 'next/app'
import '@/styles/global.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID ?? '',
        walletConnectors: [EthereumWalletConnectors],
        eventsCallbacks: {
          onAuthSuccess: async (event) => {
            const { authToken } = event

            const csrfToken = (await getCsrfToken()) || ''

            fetch('/api/auth/callback/credentials', {
              mode: 'no-cors',
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: `csrfToken=${encodeURIComponent(csrfToken)}&token=${encodeURIComponent(authToken)}`,
            })
              .then((res) => {
                if (res.ok) {
                  console.log('LOGGED IN', res)
                  // Handle success - maybe redirect to the home page or user dashboard
                } else {
                  // Handle any errors - maybe show an error message to the user
                  console.error('Failed to log in')
                }
              })
              .catch((error) => {
                // Handle any exceptions
                console.error('Error logging in', error)
              })
          },
        },
      }}>
      <DynamicWagmiConnector>
        <ToastProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ToastProvider>
      </DynamicWagmiConnector>
    </DynamicContextProvider>
  )
}
