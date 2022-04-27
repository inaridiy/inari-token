import { createContext, useState } from "react";
import { Connector } from "../connector";
import { ChainParameter, EIP1193, Web3Interface } from "../types";

export const Web3Context = createContext<Web3Interface>({
  isLoading: true,
  chainId: null,
  accounts: [],
  error: null,
  connector: null,
  instance: null,
  connectWallet: async () => {},
  switchChain: async () => {},
  disconnect: async () => {},
});

export const Web3Provider: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  const [connector, setConnector] = useState<Connector | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [instance, setInstance] = useState<EIP1193 | null>(null);
  const [chainId, setChainId] = useState<null | number>(null);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const connectWallet = async (
    newConnector: Connector,
    targetChain?: ChainParameter
  ) => {
    setIsLoading(true);
    connector?.disconnect && (await connector.disconnect());
    resetWeb3();
    newConnector.on("update", ({ chainId, accounts }) => {
      chainId && setChainId(chainId);
      accounts?.length && setAccounts(accounts);
    });
    newConnector.on("error", (e) => setError(e || new Error(e)));
    newConnector.on("disconnect", resetWeb3);
    setConnector(newConnector);
    setInstance((await newConnector.connect(targetChain)) || null);
    setIsLoading(false);
  };

  const switchChain = async (targetChain: ChainParameter) => {
    setIsLoading(true);
    await connector?.switchChain(targetChain);
    setIsLoading(false);
  };

  const disconnect = async () => {
    setIsLoading(true);
    connector?.disconnect && (await connector.disconnect());
    resetWeb3();
    setIsLoading(false);
  };

  const resetWeb3 = () => {
    setChainId(null);
    setAccounts([]);
    setError(null);
    setInstance(null);
  };
  return (
    <Web3Context.Provider
      value={{
        isLoading,
        chainId,
        accounts,
        error,
        connector,
        instance,
        connectWallet,
        switchChain,
        disconnect,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
