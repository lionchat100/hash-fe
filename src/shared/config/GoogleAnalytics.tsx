'use client';

import Script from 'next/script';

export const GoogleAnalytics = () => {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  // GTM ID가 없으면 컴포넌트를 렌더링하지 않음
  if (!gtmId) {
    console.warn('GTM ID가 설정되지 않았습니다. NEXT_PUBLIC_GTM_ID 환경변수를 확인해주세요.');
    return null;
  }

  return (
    <>
      {/* GTM 스크립트 */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `,
        }}
      />

      {/* GTM noscript (JavaScript 비활성화 시) */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </>
  );
};
