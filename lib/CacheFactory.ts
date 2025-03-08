import { CacheBuilder } from "./CacheBuilder.ts";
import type { EventCache } from "./Cache.ts";

/** Options for creating a cache. */
type CacheCreateOptions =
    | { strategy: 'timeout' | 'interval'; ttl: number; deleteOnExpire?: boolean }
    | { strategy?: never; ttl?: never; };

/** Factory for creating cache instances. */
export class CacheFactory {

    /**
     * Creates a new EventCache instance.
     * @template K The type of the key.
     * @template V The type of the value.
     * @param {CacheCreateOptions} options - Options for creating the cache.
     * @returns {EventCache<K, V>} - The newly created EventCache instance.
     * @throws {Error} If the TTL is negative.
     */
    public static create<K, V>(options: CacheCreateOptions = {}): EventCache<K, V> {
        if (options.ttl !== undefined && options.ttl < 0) {
            throw new Error("TTL cannot be negative.");
        }

        const builder = new CacheBuilder<K, V>()

        if (options.strategy === 'timeout' && options.ttl !== undefined) {
            return builder
                .withTimeoutStrategy(options.ttl, options.deleteOnExpire)
                .build();

        } else if (options.strategy === 'interval' && options.ttl !== undefined) {
            return builder.
                withIntervalStrategy(options.ttl, options.deleteOnExpire)
                .build();

        } else {
            //Handle cases where no strategy is specified.
            return builder.build();
        }
    }
}