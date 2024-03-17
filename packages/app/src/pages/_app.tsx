import { useEffect, useState } from 'react'
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
import { ENTRYPOINT_ADDRESS_V06, createSmartAccountClient, walletClientToSmartAccountSigner } from 'permissionless'
import { signerToSimpleSmartAccount } from 'permissionless/accounts'
import { useWalletClient } from 'wagmi'
import { createPublicClient, http } from 'viem'
import { sepolia } from 'viem/chains'

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const { isLoggedIn, setIsLoggedIn } = useAuth()

  // State to trigger the post-login logic
  const [authSuccess, setAuthSuccess] = useState(false)

  const { data: walletClient, error: walletClientError } = useWalletClient()

  useEffect(() => {
    if (!authSuccess || !walletClient) return

    const doPostLoginLogic = async () => {
      const apiKey = process.env.NEXT_PUBLIC_PIMLICO_API_KEY
      const paymasterUrl = `https://api.pimlico.io/v2/sepolia/rpc?apikey=${apiKey}`
      const privateKey = process.env.PRIVATE_KEY

      const publicClient = createPublicClient({
        transport: http('https://rpc.ankr.com/eth_sepolia'),
      })

      const signer = walletClientToSmartAccountSigner(walletClient)
      const simpleSmartAccountClient = await signerToSimpleSmartAccount(publicClient, {
        entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
        signer: signer,
        factoryAddress: '0x9406Cc6185a346906296840746125a0E44976454',
      })

      const smartAccountClient = createSmartAccountClient({
        account: simpleSmartAccountClient,
        chain: sepolia,
        bundlerTransport: http('<bundler_endpoint>'),
        entryPoint: ENTRYPOINT_ADDRESS_V06,
      })

      // create ens username with smartAccountClient
      // ...
      router.push('/kyc')
    }

    doPostLoginLogic().catch(console.error)
  }, [authSuccess]) // This effect depends on authSuccess state

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

                  setAuthSuccess(true)
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
