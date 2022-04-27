import "@/styles/global.css";
import { UsefulToast, Web3Provider } from "@inaridiy/useful-web3";
import "@inaridiy/useful-web3/dist/cjs/index.css";
import React from "react";
import "react-toastify/dist/ReactToastify.css";
function MyApp({
  Component,
  pageProps,
}: {
  Component: React.FC;
  pageProps: any;
}) {
  return (
    <Web3Provider>
      <UsefulToast />
      <Component {...pageProps} />
    </Web3Provider>
  );
}

export default MyApp;
