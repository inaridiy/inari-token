import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Connector } from "../connector";
import { useWeb3 } from "../hooks";
import { ChainParameter, EIP1193 } from "../types";
import { formatChainHex, isChainEq } from "../utils";

export const UsefulButton: React.FC<
  JSX.IntrinsicElements["button"] & {
    readonly onConnect?: (instance: EIP1193) => void | Promise<void>;
    readonly connector: Connector;
    readonly targetChain?: ChainParameter;
    readonly loadingBtnProps?: JSX.IntrinsicElements["button"];
  }
> = ({ connector, targetChain, loadingBtnProps, onConnect, ...btnProps }) => {
  const { connectWallet, accounts, switchChain, isLoading, chainId, instance } =
    useWeb3();
  useEffect(() => {
    instance && onConnect && void onConnect(instance);
  }, [instance]);
  if (isLoading) {
    return loadingBtnProps ? (
      <button {...loadingBtnProps} />
    ) : (
      <button className="btn loading">Loading</button>
    );
  } else if (targetChain && isChainEq(targetChain.chainId, chainId)) {
    return (
      <button
        className="btn btn-error"
        onClick={() => switchChain(targetChain)}
      >{`Switch To ${targetChain.chainName}`}</button>
    );
  } else if (accounts.length) {
    return <button {...btnProps} />;
  } else {
    return (
      <button
        className="btn"
        onClick={() => connectWallet(connector, targetChain)}
      >
        Collect Wallet
      </button>
    );
  }
};

export const UsefulToast: React.FC<{
  error?: boolean;
  info?: boolean;
}> = ({ error: showError = true, info: showInfo = true }) => {
  const { error, chainId } = useWeb3();
  useEffect(() => {
    error && showError && toast.error(error.message);
    chainId &&
      showInfo &&
      toast.success(`Connected to ${formatChainHex(chainId)}`);
  }, [error, chainId]);

  return <ToastContainer />;
};

const Connectors: React.FC<{
  connectors: { name: string; icon?: string; connector: Connector }[];
}> = ({ connectors }) => {
  const { connectWallet, isLoading } = useWeb3();
  return (
    <>
      <h2 className="text-xl sm:text-3xl font-bold mb-4">
        Connect Wallet With
      </h2>
      <div className="menu">
        {connectors.map((data, i) => (
          <li key={data.name + i} className={`${isLoading && "disabled"}`}>
            <button
              className="font-bold text-2xl sm:text-3xl items-center rounded-box"
              disabled={isLoading}
              onClick={() => connectWallet(data.connector)}
            >
              {data.icon && (
                <img className="aspect-square w-12 sm:w-16" src={data.icon} />
              )}
              {data.name}
            </button>
          </li>
        ))}
      </div>
    </>
  );
};

const ModalBase: React.FC<{
  open?: boolean;
  onChange?: (v: boolean) => void;
  pos?: "middle" | "bottom" | "auto";
  children?: React.ReactNode;
}> = ({ open, onChange, children, pos = "auto" }) => (
  <div
    className={`modal ${open ? "modal-open" : ""} ${
      pos === "auto"
        ? "modal-bottom sm:modal-middle"
        : pos === "bottom"
        ? " modal-bottom"
        : ""
    }`}
    onClick={() => onChange && onChange(false)}
  >
    <div className="modal-box">{children}</div>
  </div>
);

const Web3Info = () => {
  const { accounts, disconnect } = useWeb3();
  return (
    <>
      <h2 className="text-xl sm:text-3xl font-bold mb-4">Connection Info</h2>
      {accounts.length && (
        <div className="btn btn-ghost w-full text-2xl">{`${accounts[0].slice(
          0,
          5
        )}...${accounts[0].slice(-3)}`}</div>
      )}
      <div className="modal-action">
        <button className="btn btn-error btn-outline" onClick={disconnect}>
          Disconnect
        </button>
      </div>
    </>
  );
};

export const UsefulModal: React.FC<{
  pos?: "auto" | "middle" | "bottom";
  connectors: { name: string; icon?: string; connector: Connector }[];
  open?: boolean;
  onChange?: (open: boolean) => void;
}> = ({ connectors, ...modalProps }) => {
  const { instance } = useWeb3();
  return (
    <ModalBase {...modalProps}>
      {instance ? <Web3Info /> : <Connectors connectors={connectors} />}
    </ModalBase>
  );
};
