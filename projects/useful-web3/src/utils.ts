export const defaultChainList = {};

export function invariant(value: unknown, message: string): asserts value {
  if (value) {
    return;
  } else {
    throw new Error(message);
  }
}

export const parseChainId = (chainId: any): number =>
  typeof chainId === "number"
    ? chainId
    : chainId.chainId
    ? parseChainId(chainId.chainId)
    : parseInt(chainId, 16);

export const isChainEq = (chain1: any, chain2: any) =>
  parseChainId(chain1) === parseChainId(chain2);

export const formatChainHex = (chainId: number) => `0x${chainId.toString(16)}`;

export const stopPropagation = (e: React.MouseEvent<HTMLElement>) =>
  e.stopPropagation();
