// ─── Facebook Pixel ───────────────────────────────────────────────────────────
// لتغيير الـ Pixel: غيّر الـ PIXEL_ID بس وخلي باقي الكود زي ما هو
// ────────────────────────────────────────────────────────────────────────────

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PIXEL_ID = 'ضع_الـ_PIXEL_ID_هنا'; // ← غيّر هنا بس

export default function FacebookPixel() {
  const location = useLocation();

  useEffect(() => {
    // تحميل سكريبت الفيس بوك مرة واحدة بس
    if ((window as any).fbq) return;

    const script = document.createElement('script');
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${PIXEL_ID}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(script);

    // noscript fallback
    const noscript = document.createElement('noscript');
    noscript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1"/>`;
    document.head.appendChild(noscript);
  }, []);

  // تتبع كل صفحة بيدخل عليها الزبون
  useEffect(() => {
    if ((window as any).fbq) {
      (window as any).fbq('track', 'PageView');
    }
  }, [location.pathname]);

  return null;
}
