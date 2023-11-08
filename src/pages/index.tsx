import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import AppHeader from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Raffle Lottery</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppHeader />

      <main className={`${styles.main} ${inter.className}`}>
        <h2>Main</h2>
      </main>
    </>
  )
}
