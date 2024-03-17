import { useState } from 'react'
import { useRouter } from 'next/router'
import { useAccount, useSignMessage } from 'wagmi'
import { createPublicClient, http } from 'viem'
import { sepolia } from 'viem/chains'
import { ENTRYPOINT_ADDRESS_V06, createSmartAccountClient, walletClientToSmartAccountSigner } from 'permissionless'
import { signerToSimpleSmartAccount } from 'permissionless/accounts'
import { useWalletClient } from 'wagmi'
import { WorkerRequest } from '@/types'
import { useFetch } from '@/hooks/useFetch'
import { useDebounce } from '@/hooks/useDeBounce'

export default function SetUsername() {
  const router = useRouter()
  const { address } = useAccount()
  const [username, setUsername] = useState('')
  const { data: walletClient } = useWalletClient()
  const debouncedName = useDebounce(username, 500)

  const { data, isLoading, signMessage, variables } = useSignMessage({
    message: `Register ${debouncedName}.rightclickuse.eth`,
  })

  const requestBody: WorkerRequest = {
    name: `${debouncedName}.rightclickuse.eth`,
    owner: address!,
    addresses: { '60': address },
    texts: { description: '' },
    signature: {
      hash: data!,
      message: variables?.message!,
    },
  }

  const {
    data: gatewayData,
    error: gatewayError,
    isLoading: gatewayIsLoading,
  } = useFetch(
    data ? 'https://ens-gateway.rcu.workers.dev/set' : undefined,
    data
      ? {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      : undefined
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!walletClient) throw new Error('Wallet client not found')

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

    // Save the smart account address and username
    // You can use a database or API to store this information
    // For demonstration purposes, we'll just log it
    console.log('Smart Account Address:', smartAccountClient.account.address)
    console.log('Username:', username)

    // Trigger the message signing
    signMessage()

    // Redirect to the next page, e.g., KYC page
    router.push('/kyc')
  }

  return (
    <div>
      <h1>Set Username</h1>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder='Enter your username'
        />
        <p>.rightclickuse.eth</p>
        <button type='submit' disabled={isLoading || gatewayIsLoading}>
          Submit
        </button>
      </form>
      {gatewayError && <p>Error: {gatewayError.message}</p>}
    </div>
  )
}
