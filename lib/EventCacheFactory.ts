import type { EventCache } from "./EventCache.ts";
import { EventCacheBuilder } from "./EventCacheBuilder.ts";
import { IntervalStrategy } from "./EventStrategy/IntervalStrategy.ts";
import { TimeoutStrategy } from "./EventStrategy/TimeoutStrategy.ts";

/**
 * Factory for creating cache instances. Items are removed from the cache when they expire.
 * @example
 * ```typescript
 * import { EventCacheFactory } from "./EventCacheFactory";
 *
 * // create EventCache with timeout strategy
 * const timeoutCache = EventCacheFactory.createEventCacheTimeout<string, number>(5000); // Items expire after 5 seconds
 * timeoutCache.set('myKey', 123);
 *
 * // create EventCache with interval strategy
 * const intervalCache = EventCacheFactory.createEventCacheInterval<string, string>(2000); // Items checked every 2 seconds
 * intervalCache.set('myKey', 'hello');
 * ```
 */
export class EventCacheFactory {
  /**
   * Creates an `EventCache` instance using a timeout strategy.  Items expire after a specified time-to-live (TTL).
   * @template K The type of the key used in the cache.
   * @template V The type of the value stored in the cache.
   * @param ttl The time-to-live (TTL) for each item in the cache, in milliseconds.  Must be a non-negative number.
   * @throws {Error} If the provided `ttl` is negative.
   * @returns {EventCache<K, V>} A new `EventCache` instance configured with a timeout strategy.  Expired items are automatically deleted by default.
   */

  public static createEventCacheTimeout<K, V>(ttl: number): EventCache<K, V> {
    if (ttl < 0) {
      throw new Error("TTL cannot be negative.");
    }

    return new EventCacheBuilder<K, V>()
      .withStrategy(new TimeoutStrategy(ttl))
      .build();
  }

  /**
   * Creates an `EventCache` instance using an interval strategy. The cache periodically checks for expired items.
   * @template K The type of the key used in the cache.
   * @template V The type of the value stored in the cache.
   * @param ttl The time-to-live (TTL) for each item in the cache, in milliseconds. Must be a non-negative number.
   * @throws {Error} If the provided `ttl` is negative.
   * @returns {EventCache<K, V>} A new `EventCache` instance configured with an interval strategy. Expired items are automatically deleted by default.
   */
  public static createEventCacheInterval<K, V>(ttl: number): EventCache<K, V> {
    if (ttl < 0) {
      throw new Error("TTL cannot be negative.");
    }

    return new EventCacheBuilder<K, V>()
      .withStrategy(new IntervalStrategy(ttl), true)
      .build();
  }
}
