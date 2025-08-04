import Head from 'next/head';

const LandingPage = () => {
  return (
    <>
      <Head>
        <title>LIONCHAT</title>
        <meta name='description' content='LIONCHAT' />
        <meta property='og:title' content='LIONCHAT - 새로운 만남을 시작하다' />
        <meta property='og:description' content='개발자 커피챗 플랫폼 LIONCHAT' />
        <meta property='og:type' content='website' />
      </Head>

      <main className=''>
        <div className=''>
          <h1>LIONCHAT</h1>
          <p>개발자 커피챗 플랫폼 LIONCHAT에서 새로운 만남을 시작하세요!</p>
          <a href='/login'>시작하기</a>
        </div>
      </main>
    </>
  );
};

export default LandingPage;
