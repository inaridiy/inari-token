import type { IWalletConnectProviderOptions } from "@walletconnect/types";
import type WalletConnectProvider from "@walletconnect/web3-provider";
import type { ChainParameter, EIP1193 } from "../types";
import { formatChainHex, invariant, parseChainId } from "../utils";
import { Connector } from "./Connector";

export class WalletConnectConnector extends Connector {
  constructor(
    private options:
      | IWalletConnectProviderOptions
      | Promise<IWalletConnectProviderOptions> = {}
  ) {
    super();
  }
  public provider: (EIP1193 & WalletConnectProvider) | undefined;

  static getWalletConnect(options: IWalletConnectProviderOptions) {
    return import("@walletconnect/web3-provider").then(
      ({ default: provider }) =>
        new provider(options) as EIP1193 & WalletConnectProvider
    );
  }

  private async prepareProvider() {
    const provider = await WalletConnectConnector.getWalletConnect(
      await this.options
    );
    if (provider) {
      this.provider = provider;
      this.provider.on("disconnect", () => this.dispatch("disconnect"));
      this.provider.on("chainChanged", (chainId) =>
        this.dispatch("update", { chainId: parseChainId(chainId) })
      );
      this.provider.on("accountsChanged", (accounts) =>
        accounts.length === 0
          ? this.dispatch("disconnect")
          : this.dispatch("update", { accounts })
      );
    }
  }
  async switchChain(chain: ChainParameter) {
    try {
      invariant(
        this.provider && this.provider.request,
        "WalletConnect not found"
      );
      await this.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: formatChainHex(chain.chainId) }],
      });
    } catch (e) {
      this.dispatch("error", e as Error);
    }
  }

  async connect(connectTo?: ChainParameter) {
    try {
      this.provider || (await this.prepareProvider());
      invariant(
        this.provider && this.provider.request,
        "WalletConnect not found"
      );
      const [chainId, accounts] = (await Promise.all([
        this.provider.request({ method: "eth_chainId" }),
        this.provider.enable(),
      ])) as [string, string[]];
      this.dispatch("update", { chainId: parseChainId(chainId), accounts });
      connectTo && (await this.switchChain(connectTo));
      return this.provider;
    } catch (e) {
      this.provider = undefined; //QRcode 関係のフラグをリセット
      this.dispatch("error", e as Error);
    }
  }

  async disconnect() {
    try {
      this.provider || (await this.prepareProvider());
      invariant(this.provider, "Metamask not found");
      await this.provider.disconnect();
    } catch (e) {
      this.dispatch("error", e as Error);
    }
  }
}
