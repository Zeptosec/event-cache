/**
 * Interface defining the structure of an event strategy.
 * @template K The type of the key.
 */
export type EventStrategy<K> = {
  /**
   * Sets an event with a key and a callback function.
   * @param key The key associated with the event.
   * @param onFinish The callback function to be executed when the event expires.
   */
  set: (key: K, onFinish: () => void) => void;

  /**
   * Removes an event based on its key.
   * @param key The key of the event to be removed.
   */
  remove: (key: K) => void;

  /**
   * Clears all events.
   */
  clearAll: () => void;
};

/**
 * A strategy for managing events using timeouts.
 * @template K The type of the key.
 */
export class TimeoutStrategy<K> implements EventStrategy<K> {
  /**
   * A map storing timeouts, keyed by event keys.
   * @private
   */
  private readonly timeouts: Map<K, number> = new Map();

  /**
   * The time-to-live (TTL) for each event, in milliseconds.
   * @readonly
   */
  public readonly ttl: number;

  /**
   * Creates a new TimeoutStrategy instance.
   * @param ttl The time-to-live (TTL) for each event, in milliseconds.
   */
  constructor(ttl: number) {
    this.ttl = ttl;
  }

  /**
   * Sets a timeout for an event.
   * @param key The key of the event.
   * @param onFinish The function to be executed when the timeout expires.
   */
  public set(key: K, onFinish: () => void): void {
    this.remove(key);
    const timeout = setTimeout(() => {
      this.timeouts.delete(key);
      onFinish();
    }, this.ttl);
    this.timeouts.set(key, timeout);
  }

  /**
   * Removes a timeout for an event.
   * @param key The key of the event to be removed.
   */
  public remove(key: K): void {
    const timeout = this.timeouts.get(key);
    if (timeout !== undefined) {
      clearTimeout(timeout);
      this.timeouts.delete(key);
    }
  }

  /**
   * Clears all timeouts.
   */
  public clearAll(): void {
    this.timeouts.forEach((timeout) => clearTimeout(timeout));
    this.timeouts.clear();
  }
}
