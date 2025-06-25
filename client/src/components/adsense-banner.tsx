import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export function AdSenseBanner() {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <div className="w-full max-w-md mx-auto mt-8 mb-4">
      <div className="border border-border rounded-lg p-4 bg-muted/20">
        <div className="text-center">
          <ins
            className="adsbygoogle block"
            style={{ display: 'block', minHeight: '90px' }}
            data-ad-client="ca-pub-6627209561720449"
            data-ad-slot="9591460073"
            data-ad-format="horizontal"
            data-full-width-responsive="true"
          />
        </div>
      </div>
    </div>
  );
}