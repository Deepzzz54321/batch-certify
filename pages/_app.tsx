import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/argon-dashboard-react.scss";
import Admin from "../components/Layouts/Admin";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <title>Batch Certify✅</title>
        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css"
          rel="stylesheet"
        />
      </Head>
      <Admin>
        <Component {...pageProps} />
      </Admin>
    </>
  );
}

export default MyApp;
