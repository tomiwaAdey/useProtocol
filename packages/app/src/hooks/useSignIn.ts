import { useEffect } from 'react'
import { ENTRYPOINT_ADDRESS_V06, createSmartAccountClient, walletClientToSmartAccountSigner } from 'permissionless'
import { signerToSimpleSmartAccount } from 'permissionless/accounts'
import { useWalletClient } from 'wagmi'
import { createPublicClient, http } from 'viem'
import { generatePrivateKey } from 'viem/accounts'
import { writeFileSync } from 'fs'
import { sepolia } from 'viem/chains'

const useSignIn = () => {
  const { data: walletClient } = useWalletClient()

  useEffect(() => {
    const setupSmartAccount = async () => {
      if (!walletClient) return

      const apiKey = process.env.NEXT_PUBLIC_PIMLICO_API_KEY
      const paymasterUrl = `https://api.pimlico.io/v2/sepolia/rpc?apikey=${apiKey}`
      const privateKey =
        process.env.PRIVATE_KEY ??
        (() => {
          const pk = generatePrivateKey()
          writeFileSync('.env.local', `PRIVATE_KEY=${pk}`)
          return pk
        })()

      const publicClient = createPublicClient({
        transport: http('https://rpc.ankr.com/eth_sepolia'),
      })

      //   const paymasterClient = createPimlicoPaymasterClient({
      //     transport: http(paymasterUrl),
      //     entryPoint: ENTRYPOINT_ADDRESS_V07,
      //   })

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
    }

    setupSmartAccount()
  }, [walletClient])

  // Return whatever you need from the hook
}

export default useSignIn
