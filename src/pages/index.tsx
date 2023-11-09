import Head from 'next/head'
import AppHeader from '@/components/Header'
import LotteryEntrance from '@/components/LotteryEntrance'

export default function Home() {
  return (
    <>
      <Head>
        <title>Raffle Lottery</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppHeader />

      <main className="max-w-screen-md mx-auto">
        <LotteryEntrance />
      </main>
    </>
  )
}
