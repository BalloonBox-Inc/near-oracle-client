import "@nearoracle/styles/styles.css";
import type { AppProps } from "next/app";
import { NearProvider } from "@nearoracle/src/context";
import Layout from "@nearoracle/src/components/Layout";

import "antd/dist/antd.dark.min.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NearProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </NearProvider>
  );
}

export default MyApp;
