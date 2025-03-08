import { EventCache, type EventCacheProps } from "./EventCache.ts";
import { TimeoutStrategy } from "./EventStrategy/TimeoutStrategy.ts";
import { IntervalStrategy } from "./EventStrategy/IntervalStrategy.ts";

/**
 * Builder for creating EventCache instances.
 * @template K The type of the key.
 * @template V The type of the value.
 */
export class EventCacheBuilder<K, V> {
    /** Internal state of the builder. */
    private state: EventCacheProps<K> = {
        deleteOnExpire: true,
        eventStrategy: undefined
    };

    /**
     * Sets the timeout strategy.
     * @param ttl The time-to-live (TTL) for each event, in milliseconds.
     * @param deleteOnExpire Whether to delete expired items from the cache. Defaults to true.
     * @returns {EventCacheBuilder<K, V>} The CacheBuilder instance (for chaining).
     */
    public withTimeoutStrategy(ttl: number, deleteOnExpire: boolean = true): EventCacheBuilder<K, V> {
        this.state.eventStrategy = new TimeoutStrategy<K>(ttl);
        this.state.deleteOnExpire = deleteOnExpire;
        return this;
    }

    /**
     * Sets the interval strategy.
     * @param ttl The time-to-live (TTL) for each event, in milliseconds.
     * @param deleteOnExpire Whether to delete expired items from the cache. Defaults to true.
     * @returns {EventCacheBuilder<K, V>} The CacheBuilder instance (for chaining).
     */
    public withIntervalStrategy(ttl: number, deleteOnExpire: boolean = true): EventCacheBuilder<K, V> {
        this.state.eventStrategy = new IntervalStrategy<K>(ttl);
        this.state.deleteOnExpire = deleteOnExpire;
        return this;
    }

    /**
     * Builds the EventCache instance.
     * @returns {EventCache<K, V>} The built EventCache instance.
     */
    public build(): EventCache<K, V> {
        return new EventCache<K, V>(this.state);
    }
}
