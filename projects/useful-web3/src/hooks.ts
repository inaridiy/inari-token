import { ethers } from "ethers";
import { useContext, useEffect, useState } from "react";
import { Web3Context } from "./components";
import { ChainParameter } from "./types";
import { isChainEq } from "./utils";

type contractFactory<T> = (provider: ethers.providers.Provider) => T;
type contractOptions =
  | {
      fallbackRpc?: string;
      fetchOnly?: false | undefined;
      chain: number | string | ChainParameter;
    }
  | { fallbackRpc: string; fetchOnly: true };
type useContractReturn<T, U extends contractOptions | undefined> = U extends {
  fetchOnly: true;
}
  ? T
  : T | null;

export const useWeb3 = () => useContext(Web3Context);

export const useJsonRpcProvider = (rpc: string) =>
  new ethers.providers.JsonRpcProvider(rpc);

export const useContract = <T>(
  contractFactory: contractFactory<T>,
  options: contractOptions
): useContractReturn<T, typeof options> => {
  const [contract, setContract] = useState<T | null>(null);
  const { instance, chainId } = useWeb3();
  useEffect(() => {
    if (
      (options?.fallbackRpc && !instance) ||
      (options?.fallbackRpc &&
        "chain" in options &&
        isChainEq(options.chain, chainId)) ||
      options?.fetchOnly
    ) {
      setContract(
        contractFactory(
          new ethers.providers.JsonRpcProvider(options.fallbackRpc)
        )
      );
    } else if (instance && isChainEq(options.chain, chainId)) {
      setContract(contractFactory(new ethers.providers.Web3Provider(instance)));
    } else {
      setContract(null);
    }
  }, [instance, chainId]);
  return contract;
};
