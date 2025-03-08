import { assertEquals } from "@std/assert/equals";
import { EventCacheBuilder } from "../lib/EventCacheBuilder.ts";
import { TimeoutStrategy } from "../lib/EventStrategy/TimeoutStrategy.ts";
import { IntervalStrategy } from "../lib/EventStrategy/IntervalStrategy.ts";

Deno.test("CacheBuilder: build with timeout strategy", () => {
    const ttl = 1000;
    const cache = new EventCacheBuilder<string, number>()
        .withTimeoutStrategy(ttl)
        .build();
    //@ts-ignore More direct access to property
    assertEquals(cache.eventStrategy instanceof TimeoutStrategy, true);
    //@ts-ignore More direct access to property
    assertEquals((cache.eventStrategy as TimeoutStrategy<string>).ttl, ttl);
});

Deno.test("CacheBuilder: build with interval strategy", () => {
    const ttl = 1000;
    const cache = new EventCacheBuilder<string, number>()
        .withIntervalStrategy(ttl)
        .build();
    //@ts-ignore More direct access to property
    assertEquals(cache.eventStrategy instanceof IntervalStrategy, true);
    //@ts-ignore More direct access to property
    assertEquals((cache.eventStrategy as IntervalStrategy<string>).ttl, ttl);
});

Deno.test("CacheBuilder: build with no strategy", () => {
    const cache = new EventCacheBuilder<string, number>().build();
    //@ts-ignore More direct access to property
    assertEquals(cache.eventStrategy, undefined);
});

Deno.test("CacheBuilder: chaining methods", () => {
    const ttl = 500;
    const cache = new EventCacheBuilder<string, number>()
        .withTimeoutStrategy(ttl, false)
        .build();
    //@ts-ignore More direct access to property
    assertEquals(cache.deleteOnExpire, false);
    //@ts-ignore More direct access to property
    assertEquals(cache.eventStrategy instanceof TimeoutStrategy, true);
    //@ts-ignore More direct access to property
    assertEquals((cache.eventStrategy as TimeoutStrategy<string>).ttl, ttl);
});

Deno.test("CacheBuilder: default deleteOnExpire", () => {
    const cache = new EventCacheBuilder<string, number>().build();
    //@ts-ignore More direct access to property
    assertEquals(cache.deleteOnExpire, true);
});