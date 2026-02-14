import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/router';

function setCookie(name: string, value: string, minutes: number) {
  const expires = new Date(Date.now() + minutes * 60 * 1000).toUTCString();
  document.cookie = `${name}=${value}; path=/; expires=${expires}; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useEffect(() => {
    // set visitorId cookie if not exist
    let visitorId = getCookie('visitorId');
    if (!visitorId) {
      visitorId = uuidv4();
      // expires in 1 year
      const expDate = new Date();
      expDate.setFullYear(expDate.getFullYear() + 1);
      document.cookie = `visitorId=${visitorId}; path=/; expires=${expDate.toUTCString()}; SameSite=Lax`;
    }
    // set sessionId cookie with 30 minute expiry
    let sessionId = getCookie('sessionId');
    if (!sessionId) {
      sessionId = uuidv4();
    }
    setCookie('sessionId', sessionId, 30);
    const sendPageview = (url: string) => {
      fetch('/api/analytics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'pageview', path: url, referrer: document.referrer }),
      }).catch(() => {});
    };
    sendPageview(window.location.pathname);
    router.events.on('routeChangeComplete', sendPageview);
    return () => {
      router.events.off('routeChangeComplete', sendPageview);
    };
  }, [router]);
  return <Component {...pageProps} />;
}