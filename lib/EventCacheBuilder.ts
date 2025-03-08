import { EventCache } from "./EventCache.ts";
import type { EventStrategy } from "./EventStrategy/TimeoutStrategy.ts";

/**
 * Interface defining the structure of an event strategy.
 * @template K The type of the key.
 */
export interface EventCacheBuilderStrategy<K, V> {
    /**
    * Sets the event strategy and deleteOnExpire flag for the EventCache.
    * @param strategy The strategy to use for managing events (e.g., TimeoutStrategy, IntervalStrategy).
    * @param deleteOnExpire A boolean indicating whether expired events should be automatically deleted. Defaults to `true`.
    * @returns An EventCacheBuilderReady instance ready to build the EventCache.
    */
    withStrategy(strategy: EventStrategy<K>, deleteOnExpire: boolean): EventCacheBuilderReady<K, V>;
}

/**
 * Interface defining the structure of a builder that is ready to build an EventCache.
 * @template K The type of the key used to identify events.
 * @template V The type of the value associated with each event.
 */
export interface EventCacheBuilderReady<K, V> {
    /**
     * Builds and returns a new EventCache instance with the previously configured strategy and deleteOnExpire flag.
     * @returns A new EventCache instance.
     */
    build(): EventCache<K, V>;
}

/**
 * Builder class for creating instances of `EventCache`.
 * @template K The type of the key used to identify events.
 * @template V The type of the value associated with each event.
 */
export class EventCacheBuilder<K, V> implements EventCacheBuilderStrategy<K, V> {

    /**
     * Sets the event strategy and deleteOnExpire flag for the EventCache.
     * @param strategy The strategy to use for managing events (e.g., TimeoutStrategy, IntervalStrategy).
     * @param deleteOnExpire A boolean indicating whether expired events should be automatically deleted. Defaults to `true`.
     * @returns An EventCacheBuilderReady instance ready to build the EventCache.
     */
    withStrategy(strategy: EventStrategy<K>, deleteOnExpire: boolean = true): EventCacheBuilderReady<K, V> {
        return new ReadyEventCacheBuilder<K, V>(strategy, deleteOnExpire);
    }
}

/**
 * Internal class used by the EventCacheBuilder to hold the strategy and options before building the EventCache.
 * @template K The type of the key used to identify events.
 * @template V The type of the value associated with each event.
 */
export class ReadyEventCacheBuilder<K, V> implements EventCacheBuilderReady<K, V> {
    /**
     * Creates a new ReadyEventCacheBuilder instance.
     * @param strategy The event strategy to be used by the EventCache.
     * @param deleteOnExpire Whether to delete expired events automatically.
     */
    constructor(
        private strategy: EventStrategy<K>,
        private deleteOnExpire: boolean
    ) { }

    /**
     * Builds and returns a new EventCache instance.
     * @returns A new EventCache instance configured with the specified strategy and deleteOnExpire setting.
     */
    build(): EventCache<K, V> {
        return new EventCache<K, V>({
            deleteOnExpire: this.deleteOnExpire,
            eventStrategy: this.strategy,
        });
    }
}