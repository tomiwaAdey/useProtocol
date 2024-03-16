import { CardList } from '@/components/CardList'

import EtherIcon from '@/assets/icons/ethereum.png'
import TokenIcon from '@/assets/icons/token.png'

const ExampleItems = [
  {
    title: 'Send Ether',
    description: 'Sending Ether to another address is the most basic, common transaction that you can do.',
    image: EtherIcon.src,
    url: '/examples/send-ether',
  },
  {
    title: 'Send ERC20 Token',
    description:
      'ERC20 introduces a standard interface for fungible tokens. Use this example to send any ERC20 to another address.',
    image: TokenIcon.src,
    url: '/examples/send-token',
  },
]

export default function Home() {
  return (
    <>
      <h2 className='text-xl'>Join the Waitlist</h2>

      <p className='mb-4'>
        As we continue to build out the platform, we’re working closely with a small group of creators to get things
        right. If you’re interested in joining up, get on our creator waitlist by submitting a quick proposal.
      </p>

      <CardList title='Examples' items={ExampleItems} />
    </>
  )
}
