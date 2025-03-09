import { EventEmitter } from "node:events";
import type { EventStrategy } from "./EventStrategy/TimeoutStrategy.ts";

/**
 * Defines the events emitted by the `EventCache`.
 * @template K The type of the key.
 * @template V The type of the value.
 */
export type EventCacheEvents<K, V> = {
  /**
   * Emitted when an item expires.
   * @param {key: K, value: V} The key and value of the expired item.
   */
  expire: [{
    key: K;
    value: V;
  }];
};

/**
 * Properties for configuring an `EventCache` instance.
 * @template K The type of the key.
 */
export type EventCacheProps<K> = {
  /** Whether to delete expired items from the cache. Defaults to `true`. */
  deleteOnExpire?: boolean;
  /** The strategy for managing event expiration. */
  eventStrategy: EventStrategy<K>;
};

/**
 * A Map implementation that emits events when items expire.
 *
 * @template K The type of the key.
 * @template V The type of the value.
 */
export class EventCache<K, V> extends EventEmitter<EventCacheEvents<K, V>>
  implements Map<K, V> {
  /** The underlying Map storing the cached data. */
  private cache: Map<K, V> = new Map();
  /** Whether to delete expired items from the cache. */
  private deleteOnExpire: boolean;
  /** The strategy for managing event expiration. */
  private eventStrategy: EventStrategy<K>;

  /**
   * Creates a new EventCache instance.
   * @param {EventCacheProps<K>} options - Configuration options for the cache.
   * @example
   * ```typescript
   * import { EventCache } from "./EventCache";
   * import { TimeoutStrategy } from "./EventStrategy/TimeoutStrategy";
   *
   * const cache = new EventCache({
   *   deleteOnExpire: true,
   *   eventStrategy: new TimeoutStrategy(5000) //Items expire after 5 seconds
   * });
   *
   * cache.on('expire', (expiredItem) => {
   *   console.log(`Item '${expiredItem.key}' expired. Value: ${expiredItem.value}`);
   * });
   *
   * cache.set('myKey', 123);
   *
   * setTimeout(() => {
   *   console.log(cache.get('myKey')); // Access the value before expiration
   * }, 3000);
   *
   * setTimeout(() => {
   *   console.log(cache.get('myKey')); // Access the value after expiration (should be undefined if deleteOnExpire is true)
   * }, 7000);
   * ```
   */
  constructor(options: EventCacheProps<K>) {
    super();
    this.deleteOnExpire = options.deleteOnExpire ?? true;
    this.eventStrategy = options.eventStrategy;
  }

  /** Iterator for the cache. */
  [Symbol.iterator](): MapIterator<[K, V]> {
    return this.cache[Symbol.iterator]();
  }

  /** String representation of the EventCache. */
  [Symbol.toStringTag]: string = "EventCache";

  /** Removes an event from the event strategy.  */
  private removeEvent(key: K): void {
    this.eventStrategy?.remove(key);
  }

  /** Adds an event to the event strategy. */
  private addEvent(key: K, value: V): void {
    this.eventStrategy?.set(key, () => {
      this.emit("expire", {
        key: key,
        value: value,
      });

      if (this.deleteOnExpire) {
        this.delete(key);
      }
    });
  }

  /**
   * Sets a value in the cache.
   * @param key - The key of the item to add to the cache.
   * @param value - The value of the item to add to the cache.
   * @returns {this} - The EventCache instance.
   */
  public set(key: K, value: V): this {
    this.removeEvent(key);

    this.addEvent(key, value);

    this.cache.set(key, value);
    return this;
  }

  /**
   * Deletes a value from the cache.
   * @param key - The key of the item to delete from the cache.
   * @returns {boolean} - True if the item was successfully deleted, false otherwise.
   */
  public delete(key: K): boolean {
    this.removeEvent(key);
    return this.cache.delete(key);
  }

  /**
   * Gets a value from the cache.
   * @param key - The key of the item to retrieve from the cache.
   * @returns {V | undefined} - The value of the item, or undefined if the key is not found.
   */
  public get(key: K): V | undefined {
    return this.cache.get(key);
  }

  /** Clears the cache. */
  public clear(): void {
    this.eventStrategy?.clearAll();
    this.cache.clear();
  }

  /** The number of items in the cache. */
  public get size(): number {
    return this.cache.size;
  }

  /**
   * Returns an iterator over the cache entries.
   * @returns {MapIterator<[K, V]>} - An iterator over the cache entries.
   */
  public entries(): MapIterator<[K, V]> {
    return this.cache.entries();
  }

  /**
   * Returns an iterator over the cache keys.
   * @returns {MapIterator<K>} - An iterator over the cache keys.
   */
  public keys(): MapIterator<K> {
    return this.cache.keys();
  }

  /**
   * Returns an iterator over the cache values.
   * @returns {MapIterator<V>} - An iterator over the cache values.
   */
  public values(): MapIterator<V> {
    return this.cache.values();
  }

  /**
   * Checks if the cache has a specific key.
   * @param key - The key to check for.
   * @returns {boolean} - True if the key exists in the cache, false otherwise.
   */
  public has(key: K): boolean {
    return this.cache.has(key);
  }

  /**
   * Executes a callback for each key/value pair in the cache.
   * @param callback - The callback function to execute for each key/value pair.  The callback is invoked with three arguments: the value of the element, the key of the element, and the Map object being traversed.
   */
  public forEach(callback: (value: V, key: K, map: Map<K, V>) => void): void {
    this.cache.forEach((value, key) => callback(value, key, this));
  }
}
