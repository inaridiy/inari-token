import type IWeb3Modal from "web3modal";
import type { ICoreOptions } from "web3modal";
import type { ChainParameter, EIP1193 } from "../types";
import { formatChainHex, invariant, parseChainId } from "../utils";
import { Connector } from "./Connector";

export class Web3ModalConnector extends Connector {
  constructor(
    private options: Partial<ICoreOptions> | Promise<Partial<ICoreOptions>> = {}
  ) {
    super();
  }
  private web3Modal?: IWeb3Modal;

  static getWeb3Modal(options: Partial<ICoreOptions> = {}) {
    return import("web3modal").then(
      ({ default: Web3Modal }) => new Web3Modal(options)
    );
  }

  private async prepareProvider() {
    const web3modal = await Web3ModalConnector.getWeb3Modal(await this.options);
    const provider = (await web3modal.connect()) as EIP1193;
    if (provider) {
      this.web3Modal = web3modal;
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
      invariant(this.provider && this.provider.request, "Not Connect");
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
        "Web3Modal not connect"
      );
      const [chainId, accounts] = (await Promise.all([
        this.provider.request({ method: "eth_chainId" }),
        this.provider.request({ method: "eth_requestAccounts" }),
      ])) as [string, string[]];
      this.dispatch("update", { chainId: parseChainId(chainId), accounts });
      connectTo && (await this.switchChain(connectTo));
      return this.provider;
    } catch (e) {
      this.dispatch("error", e as Error);
    }
  }
}
