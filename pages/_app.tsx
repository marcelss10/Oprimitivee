import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAdmin = router.pathname === '/admin';

  return (
    <>
      {!isAdmin && <Navbar />}
      <Component {...pageProps} />
      {!isAdmin && <Footer />}
    </>
  );
}
