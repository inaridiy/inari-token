import {
  MetamaskConnector,
  UsefulModal,
  WalletConnectConnector,
} from "@inaridiy/useful-web3";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div className="w-full">
      <UsefulModal
        connectors={[
          {
            name: "Metamask",
            connector: new MetamaskConnector(),
            icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/1200px-MetaMask_Fox.svg.png",
          },
          {
            name: "Wallet Connect",
            connector: new WalletConnectConnector({ rpc: {} }),
            icon: "https://seeklogo.com/images/W/walletconnect-logo-EE83B50C97-seeklogo.com.png",
          },
        ]}
        open={true}
      />
    </div>
  );
};

export default Home;
