import { useEffect, useState } from 'react'
import { ENTRYPOINT_ADDRESS_V06, createSmartAccountClient, walletClientToSmartAccountSigner } from 'permissionless'
import { signerToSimpleSmartAccount } from 'permissionless/accounts'
import { useWalletClient } from 'wagmi'
import { createPublicClient, http } from 'viem'
import { sepolia } from 'viem/chains'

const useSignIn = () => {
  const { data: walletClient } = useWalletClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const signIn = async () => {
    setIsLoading(true)
    try {
      if (!walletClient) throw new Error('Wallet client not found')

      const apiKey = process.env.NEXT_PUBLIC_PIMLICO_API_KEY
      const paymasterUrl = `https://api.pimlico.io/v2/sepolia/rpc?apikey=${apiKey}`
      const privateKey = process.env.PRIVATE_KEY

      const publicClient = createPublicClient({
        transport: http('https://rpc.ankr.com/eth_sepolia'),
      })

      // const paymasterClient = createPimlicoPaymasterClient({
      //   transport: http(paymasterUrl),
      //   entryPoint: ENTRYPOINT_ADDRESS_V07,
      // })

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
        // middleware: {
        //   sponsorUserOperation: paymasterClient.sponsorUserOperation, // optional, if using a paymaster
        // },
      })

      // Perform any necessary actions with the smartAccountClient

      setIsLoading(false)
    } catch (error) {
      setError(error as Error)
      setIsLoading(false)
    }
  }

  return { isLoading, error, signIn }
}

export default useSignIn
