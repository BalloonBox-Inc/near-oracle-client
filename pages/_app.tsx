import "@nearoracle/styles/styles.css";
import type { AppProps } from "next/app";
import { NearProvider } from "@nearoracle/src/context";
import Layout from "@nearoracle/src/components/Layout";

import "antd/dist/antd.dark.min.css";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>NearOracle</title>
      </Head>
      <NearProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </NearProvider>
    </>
  );
}

export default MyApp;
