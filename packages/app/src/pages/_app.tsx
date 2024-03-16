import { PropsWithChildren } from 'react'
import { Layout } from '@/components/Layout'
import { ToastProvider } from '@/context/Toaster'
import { DynamicContextProvider, DynamicWidget } from '@dynamic-labs/sdk-react-core'
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector'
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum'
import type { AppProps } from 'next/app'
import '@/styles/global.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: 'b4238e63-26c1-4254-a69a-a0a0a6873f50',
        walletConnectors: [EthereumWalletConnectors],
      }}>
      <DynamicWagmiConnector>
        <ToastProvider>
          <DynamicWidget />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ToastProvider>
      </DynamicWagmiConnector>
    </DynamicContextProvider>
  )
}
