import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function FacebookPixel() {
  const location = useLocation();
  const [pixelId, setPixelId] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('settings')
      .select('value')
      .eq('key', 'facebook_pixel_id')
      .single()
      .then(({ data }) => {
        if (data?.value) setPixelId(data.value);
      });
  }, []);

  useEffect(() => {
    if (!pixelId) return;
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
      fbq('init', '${pixelId}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(script);
  }, [pixelId]);

  useEffect(() => {
    if ((window as any).fbq) {
      (window as any).fbq('track', 'PageView');
    }
  }, [location.pathname]);

  return null;
}
