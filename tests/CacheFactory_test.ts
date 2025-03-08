import { assertEquals, assertThrows } from "@std/assert";
import { CacheFactory } from "../lib/CacheFactory.ts";
import { TimeoutStrategy } from "../lib/EventStrategy/TimeoutStrategy.ts";
import { IntervalStrategy } from "../lib/EventStrategy/IntervalStrategy.ts";


Deno.test("CacheFactory: create with timeout strategy", () => {
    const ttl = 400;
    const cache = CacheFactory.create<string, number>({ strategy: 'timeout', ttl });
    //@ts-ignore More direct access to property
    assertEquals(cache.eventStrategy instanceof TimeoutStrategy, true);
    //@ts-ignore More direct access to property
    assertEquals((cache.eventStrategy as TimeoutStrategy<string>).ttl, ttl);
});

Deno.test("CacheFactory: create with interval strategy", () => {
    const ttl = 400;
    const cache = CacheFactory.create<string, number>({ strategy: 'interval', ttl });
    //@ts-ignore More direct access to property
    assertEquals(cache.eventStrategy instanceof IntervalStrategy, true);
    //@ts-ignore More direct access to property
    assertEquals((cache.eventStrategy as IntervalStrategy<string>).ttl, ttl);
});

Deno.test("CacheFactory: create with deleteOnExpire false", () => {
    const cache = CacheFactory.create<string, number>({ strategy: 'timeout', ttl: 1000, deleteOnExpire: false });
    //@ts-ignore More direct access to property
    assertEquals(cache.deleteOnExpire, false);
});

Deno.test("CacheFactory: create with default deleteOnExpire", () => {
    const cache = CacheFactory.create<string, number>({ strategy: 'timeout', ttl: 1000 });
    //@ts-ignore More direct access to property
    assertEquals(cache.deleteOnExpire, true);
});

Deno.test("CacheFactory: create without strategy or ttl", () => {
    const cache = CacheFactory.create<string, number>();
    //@ts-ignore More direct access to property
    assertEquals(cache.eventStrategy, undefined);
    //@ts-ignore More direct access to property
    assertEquals(cache.deleteOnExpire, true);
});


Deno.test("CacheFactory: create with negative ttl", () => {
    assertThrows(
        () => CacheFactory.create<string, number>({ strategy: 'timeout', ttl: -100 }),
        Error,
        "TTL cannot be negative."
    );
});

Deno.test("CacheFactory: create with timeout strategy", () => {
    const ttl = 400;
    const cache = CacheFactory.create<string, number>({ strategy: 'timeout', ttl });
    //@ts-ignore More direct access to property
    assertEquals(cache.eventStrategy instanceof TimeoutStrategy, true);
    //@ts-ignore More direct access to property
    assertEquals((cache.eventStrategy as TimeoutStrategy<string>).ttl, ttl);
});

Deno.test("CacheFactory: create with interval strategy", () => {
    const ttl = 400;
    const cache = CacheFactory.create<string, number>({ strategy: 'interval', ttl });
    //@ts-ignore More direct access to property
    assertEquals(cache.eventStrategy instanceof IntervalStrategy, true);
    //@ts-ignore More direct access to property
    assertEquals((cache.eventStrategy as IntervalStrategy<string>).ttl, ttl);
});

Deno.test("CacheFactory: create with deleteOnExpire false for timeout", () => {
    const cache = CacheFactory.create<string, number>({ strategy: 'timeout', ttl: 1000, deleteOnExpire: false });
    //@ts-ignore More direct access to property
    assertEquals(cache.deleteOnExpire, false);
});

Deno.test("CacheFactory: create with deleteOnExpire false for interval", () => {
    const cache = CacheFactory.create<string, number>({ strategy: 'interval', ttl: 1000, deleteOnExpire: false });
    //@ts-ignore More direct access to property
    assertEquals(cache.deleteOnExpire, false);
});

Deno.test("CacheFactory: create with default deleteOnExpire for timeout", () => {
    const cache = CacheFactory.create<string, number>({ strategy: 'timeout', ttl: 1000 });
    //@ts-ignore More direct access to property
    assertEquals(cache.deleteOnExpire, true);
});

Deno.test("CacheFactory: create with default deleteOnExpire for interval", () => {
    const cache = CacheFactory.create<string, number>({ strategy: 'interval', ttl: 1000 });
    //@ts-ignore More direct access to property
    assertEquals(cache.deleteOnExpire, true);
});

Deno.test("CacheFactory: create without strategy or ttl", () => {
    const cache = CacheFactory.create<string, number>();
    //@ts-ignore More direct access to property
    assertEquals(cache.eventStrategy, undefined);
    //@ts-ignore More direct access to property
    assertEquals(cache.deleteOnExpire, true);
});

Deno.test("CacheFactory: create with negative ttl", () => {
    assertThrows(
        () => CacheFactory.create<string, number>({ strategy: 'timeout', ttl: -100 }),
        Error,
        "TTL cannot be negative."
    );
});

Deno.test("CacheFactory: create with negative ttl for interval", () => {
    assertThrows(
        () => CacheFactory.create<string, number>({ strategy: 'interval', ttl: -100 }),
        Error,
        "TTL cannot be negative."
    );
});