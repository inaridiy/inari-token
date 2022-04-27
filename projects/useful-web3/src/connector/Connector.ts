import { ChainParameter, ConnectorEvents, EIP1193 } from "../types";

export abstract class Connector {
  constructor() {}
  protected listeners: Map<
    keyof ConnectorEvents,
    ((...args: any[]) => void)[]
  > = new Map();

  public provider: EIP1193 | undefined;
  abstract connect(connectTo?: ChainParameter): Promise<EIP1193 | undefined>;
  abstract switchChain(chain: ChainParameter): Promise<void>;
  disconnect?(): Promise<void>;

  on<T extends keyof ConnectorEvents>(
    key: T,
    callback: (e: ConnectorEvents[T]) => void | Promise<void>
  ): void {
    this.listeners.has(key)
      ? (this.listeners.get(key) as ((...args: any[]) => void)[]).push(callback)
      : this.listeners.set(key, [callback]);
  }

  dispatch(
    key: keyof ConnectorEvents,
    event: ConnectorEvents[typeof key]
  ): void {
    this.listeners.has(key) &&
      (this.listeners.get(key) as ((...args: any[]) => void)[]).forEach((cb) =>
        cb(event)
      );
  }
}
