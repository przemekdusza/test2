// components/Layout.js
import Head from 'next/head';

export default function Layout({ children, title = 'Sklep z Ręcznikami' }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Profesjonalne ręczniki włókninowe dla salonów" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gray-50">
        {children}
      </main>
    </>
  );
}