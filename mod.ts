import { EventCache } from "./lib/Cache.ts";
import { CacheBuilder } from "./lib/CacheBuilder.ts";
import { CacheFactory } from "./lib/CacheFactory.ts";
import { IntervalStrategy } from "./lib/EventStrategy/IntervalStrategy.ts";
import { TimeoutStrategy } from "./lib/EventStrategy/TimeoutStrategy.ts";

export default {
    EventCache,
    CacheBuilder,
    CacheFactory,
    IntervalStrategy,
    TimeoutStrategy
}