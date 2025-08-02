import Head from "next/head";

const LandingPage = () => {
  return (
    <>
      <Head>
        <title>Hash</title>
        <meta name="description" content="Hash" />
        <meta property="og:title" content="Hash - 새로운 인연을 만나보세요" />
        <meta property="og:description" content="개발자 커피챗 플랫폼 Hash" />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="">
        <div className="">
          <h1>Hash</h1>
          <p>개발자 커피챗 플랫폼 해쉬에서 새로운 인연을 만나보세요!</p>
          <a href="/login">시작하기</a>
        </div>
      </main>
    </>
  );
};

export default LandingPage;