import { Html, Head, Main, NextScript } from 'next/document'
import { cn } from '@/lib/utils'

export default function Document() {
  return (
    <Html lang='en' suppressHydrationWarning>
      <Head>
        <link
          href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
          rel='stylesheet'
        />
      </Head>
      <body className={cn('min-h-screen bg-background font-sans antialiased')}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
