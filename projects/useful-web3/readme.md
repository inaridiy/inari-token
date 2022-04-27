# Useful-Web3

## Installation

with npm:

```bash
npm install --save @inaridiy/useful-web3 @metamask/detect-provider
```

with yarn:

```bash
yarn add @inaridiy/useful-web3 @metamask/detect-provider
```

## Usage

```tsx
import {
  Web3Provider,
  useWeb3,
  MetamaskConnector,
} from "@inaridiy/useful-web3";

function App() {
  const { connectWallet, accounts } = useWeb3();
  return (
    <Web3Provider>
      <button onClick={() => connectWallet(new MetamaskConnector())}>
        Connect Wallet
      </button>
      <p>{accounts[0]}</p>
    </Web3Provider>
  );
}
```

## Connector

This library allows you to connect to various Wallets by using connectors.
This library is equipped with `MetamaskConnector`, `WalletConnectConnector` and `Web3ModalConnector`.
And each connector requires a dependent library.

### MetamaskConnector

```bash
yarn add @inaridiy/useful-web3 @metamask/detect-provider
```

### WalletConnectConnector

```bash
yarn add @inaridiy/useful-web3 @walletconnect/web3-provider
```

### Web3ModalConnector

```bash
yarn add @inaridiy/useful-web3 web3modal
```

## useWeb3

Information about web3 can be accessed through `useWeb3`Hook.

```tsx
import { useWeb3 } from "@inaridiy/useful-web3";
const {
  accounts,
  isLoading,
  chainId,
  connector,
  instance,
  switchChain,
  disconnect,
  connectWallet,
} = useWeb3();
```

## Useful Components

### UsefulButton

A button that prompts you to `connect wallet` if you are not connected to the blockchain instead.

```tsx
import { UsefulButton, MetamaskConnector } from "@inaridiy/useful-web3";
import "@inaridiy/useful-web3/dist/cjs/index.css";

<UsefulButton connector={new MetamaskConnector()}>Mint</UsefulButton>;
```

### UsefulToast

It gives a nice display of connection status, etc. `react-toastify` is required.

```bash
yarn add react-toastify
```

```tsx
import { UsefulToast } from "@inaridiy/useful-web3";

<UsefulToast />;
```
