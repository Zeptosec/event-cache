import { assertEquals, assertThrows } from "@std/assert";
import { EventCacheFactory } from "../lib/EventCacheFactory.ts";
import { TimeoutStrategy } from "../lib/EventStrategy/TimeoutStrategy.ts";
import { IntervalStrategy } from "../lib/EventStrategy/IntervalStrategy.ts";


Deno.test("CacheFactory: create with timeout strategy", () => {
    const ttl = 400;
    const cache = EventCacheFactory.createEventCacheTimeout<string, number>(ttl);
    //@ts-ignore More direct access to property
    assertEquals(cache.eventStrategy instanceof TimeoutStrategy, true);
    //@ts-ignore More direct access to property
    assertEquals((cache.eventStrategy as TimeoutStrategy<string>).ttl, ttl);
});

Deno.test("CacheFactory: create with interval strategy", () => {
    const ttl = 400;
    const cache = EventCacheFactory.createEventCacheInterval<string, number>(ttl);
    //@ts-ignore More direct access to property
    assertEquals(cache.eventStrategy instanceof IntervalStrategy, true);
    //@ts-ignore More direct access to property
    assertEquals((cache.eventStrategy as IntervalStrategy<string>).ttl, ttl);
});

Deno.test("CacheFactory: create with default deleteOnExpire", () => {
    const cache = EventCacheFactory.createEventCacheTimeout<string, number>(1000);
    //@ts-ignore More direct access to property
    assertEquals(cache.deleteOnExpire, true);
});

Deno.test("CacheFactory: create with timeout strategy", () => {
    const ttl = 400;
    const cache = EventCacheFactory.createEventCacheTimeout<string, number>(ttl);
    //@ts-ignore More direct access to property
    assertEquals(cache.eventStrategy instanceof TimeoutStrategy, true);
    //@ts-ignore More direct access to property
    assertEquals((cache.eventStrategy as TimeoutStrategy<string>).ttl, ttl);
});

Deno.test("CacheFactory: create with interval strategy", () => {
    const ttl = 400;
    const cache = EventCacheFactory.createEventCacheInterval<string, number>(ttl);
    //@ts-ignore More direct access to property
    assertEquals(cache.eventStrategy instanceof IntervalStrategy, true);
    //@ts-ignore More direct access to property
    assertEquals((cache.eventStrategy as IntervalStrategy<string>).ttl, ttl);
});

Deno.test("CacheFactory: create with default deleteOnExpire for timeout", () => {
    const cache = EventCacheFactory.createEventCacheTimeout<string, number>(1000);
    //@ts-ignore More direct access to property
    assertEquals(cache.deleteOnExpire, true);
});

Deno.test("CacheFactory: create with default deleteOnExpire for interval", () => {
    const cache = EventCacheFactory.createEventCacheInterval<string, number>(1000);
    //@ts-ignore More direct access to property
    assertEquals(cache.deleteOnExpire, true);
});

Deno.test("CacheFactory: create with negative ttl", () => {
    assertThrows(
        () => EventCacheFactory.createEventCacheTimeout<string, number>(-100),
        Error,
        "TTL cannot be negative."
    );
});

Deno.test("CacheFactory: create with negative ttl for interval", () => {
    assertThrows(
        () => EventCacheFactory.createEventCacheInterval<string, number>(-100),
        Error,
        "TTL cannot be negative."
    );
});