import { LinkComponent } from '@/components/LinkComponent'
import { SITE_DESCRIPTION, SITE_NAME } from '@/utils/site'
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>{SITE_NAME}</title>
        <meta name='description' content={SITE_DESCRIPTION} />
      </Head>
      <h2 className='text-xl'>Join the Waitlist</h2>

      <p className='mb-4'>
        As we continue to build out the platform, we’re working closely with a small group of creators to get things
        right. If you’re interested in joining up, get on our creator waitlist by submitting a quick proposal.
      </p>
      <button>
        <LinkComponent href='/waitlist'>Join now</LinkComponent>
      </button>

      {/*<p className='mt-4'>
        <LinkComponent href='/examples'>View examples</LinkComponent> to bootstrap development.
  </p>*/}
    </>
  )
}
