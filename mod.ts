import { EventCache } from "./lib/EventCache.ts";
import { EventCacheBuilder } from "./lib/EventCacheBuilder.ts";
import { EventCacheFactory } from "./lib/EventCacheFactory.ts";
import { IntervalStrategy } from "./lib/EventStrategy/IntervalStrategy.ts";
import { TimeoutStrategy } from "./lib/EventStrategy/TimeoutStrategy.ts";

/**
 * A Map implementation that emits events when items expire.  Provides methods for setting, getting, deleting, and clearing cached items.  Supports expiration strategies via the `CacheBuilder`.
 * @template K The type of the key.
 * @template V The type of the value.
 */
export { EventCache };

/**
 * Builder for creating configurable instances of `EventCache`. Allows setting expiration strategies and delete-on-expire behavior.
 * @template K The type of the key.
 * @template V The type of the value.
 */
export { EventCacheBuilder };

/**
 * Factory for creating `EventCache` instances with various configuration options.  Simplifies cache creation.
 */
export { EventCacheFactory };

/**
 * A strategy for managing events at intervals.  Used within `EventCache` to handle item expiration.
 * @template K The type of the key.
 */
export { IntervalStrategy };

/**
 * A strategy for managing events using timeouts. Used within `EventCache` to handle item expiration.
 * @template K The type of the key.
 */
export { TimeoutStrategy };