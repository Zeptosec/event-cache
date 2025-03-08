import { assertEquals } from "@std/assert/equals";
import { EventCache } from "../lib/Cache.ts";
import { assertAlmostEquals } from "@std/assert/almost-equals";
import { TimeoutStrategy } from "../lib/EventStrategy/TimeoutStrategy.ts";
import { IntervalStrategy } from "../lib/EventStrategy/IntervalStrategy.ts";

Deno.test("EventCache: Get an existing value by key", () => {
    const eventCache = new EventCache<string, number>();

    assertEquals(eventCache.get('test1'), undefined);
    assertEquals(eventCache.get('test2'), undefined);

    eventCache.set('test1', 1);
    eventCache.set('test2', 2);

    assertEquals(eventCache.get('test1'), 1);
    assertEquals(eventCache.get('test2'), 2);

    eventCache.clear()
});

Deno.test("EventCache: Get a non-existing value by key", () => {
    const eventCache = new EventCache<string, number>();

    assertEquals(eventCache.get('test1'), undefined);
    assertEquals(eventCache.get('test2'), undefined);

    eventCache.clear()
});

Deno.test("EventCache: Delete an existing value by key", () => {
    const eventCache = new EventCache<string, number>();

    eventCache.set('test1', 1);
    eventCache.set('test2', 2);

    assertEquals(eventCache.get('test1'), 1);
    assertEquals(eventCache.get('test2'), 2);

    assertEquals(eventCache.delete('test1'), true);
    assertEquals(eventCache.delete('test2'), true);

    assertEquals(eventCache.get('test1'), undefined);
    assertEquals(eventCache.get('test2'), undefined);

    eventCache.clear();
});

Deno.test("EventCache: Delete a non-existing value by key", () => {
    const eventCache = new EventCache<string, number>();

    assertEquals(eventCache.get('test1'), undefined);

    assertEquals(eventCache.delete('test1'), false);

    assertEquals(eventCache.get('test1'), undefined);
})

Deno.test("EventCache: Get event with timeout strategy when key expires", async () => {
    const ttl = 300;
    let insertedAt = 0;
    const timeoutStrategy = new TimeoutStrategy(ttl);
    const eventCache = new EventCache<string, number>({ eventStrategy: timeoutStrategy });

    await new Promise(r => {
        eventCache.on('expire', event => {
            assertEquals(event.key, 'test1');
            assertEquals(event.value, 1);
            assertAlmostEquals(Date.now() - insertedAt, ttl, 25);
            r(undefined);
        })

        eventCache.set('test1', 1);
        insertedAt = Date.now();
    })
})

Deno.test("EventCache: Get event with interval strategy when key expires", async () => {
    const ttl = 300;
    let insertedAt = 0;
    const intervalStrategy = new IntervalStrategy(ttl);
    const eventCache = new EventCache<string, number>({ eventStrategy: intervalStrategy });

    await new Promise(r => {
        eventCache.on('expire', event => {
            assertEquals(event.key, 'test1');
            assertEquals(event.value, 1);
            assertAlmostEquals(Date.now() - insertedAt, ttl, 25);
            r(undefined);
        })

        eventCache.set('test1', 1);
        insertedAt = Date.now();
    })
})

Deno.test("EventCache: Get event with interval strategy when key expired", async () => {
    const ttl = 1000;
    let insertedAt = 0;
    const intervalStrategy = new IntervalStrategy(ttl);
    const eventCache = new EventCache<string, number>({ eventStrategy: intervalStrategy });

    await new Promise(r => {
        eventCache.on('expire', event => {
            assertEquals(event.key, 'test1');
            assertEquals(event.value, 1);
            assertAlmostEquals(Date.now() - insertedAt, ttl, 15);
            r(undefined);
        })

        eventCache.set('test1', 1);
        insertedAt = Date.now();
    })
})

Deno.test("EventCache: Iterate over cache", () => {
    const eventCache = new EventCache<string, number>();
    eventCache.set('test1', 1);
    eventCache.set('test2', 2);
    eventCache.set('test3', 3);

    let count = 0;
    for (const [key, value] of eventCache) {
        count++;
        if (key === 'test1') assertEquals(value, 1);
        if (key === 'test2') assertEquals(value, 2);
        if (key === 'test3') assertEquals(value, 3);
    }
    assertEquals(count, 3);
});


Deno.test("EventCache: Check size", () => {
    const eventCache = new EventCache<string, number>();
    eventCache.set('test1', 1);
    eventCache.set('test2', 2);
    assertEquals(eventCache.size, 2);
    eventCache.delete('test1');
    assertEquals(eventCache.size, 1);
    eventCache.clear();
    assertEquals(eventCache.size, 0);
});

Deno.test("EventCache: Test has()", () => {
    const eventCache = new EventCache<string, number>();
    eventCache.set('test1', 1);
    assertEquals(eventCache.has('test1'), true);
    assertEquals(eventCache.has('test2'), false);
});


Deno.test("EventCache: Test forEach()", () => {
    const eventCache = new EventCache<string, number>();
    eventCache.set('test1', 1);
    eventCache.set('test2', 2);

    let sum = 0;
    eventCache.forEach((value) => {
        sum += value;
    });
    assertEquals(sum, 3);
});


Deno.test("EventCache: Delete with deleteOnExpire false timeout strategy", async () => {
    const ttl = 300;
    const timeoutStrategy = new TimeoutStrategy(ttl);
    const eventCache = new EventCache<string, number>({ eventStrategy: timeoutStrategy, deleteOnExpire: false });

    eventCache.set('test1', 1);
    await new Promise(r => setTimeout(r, ttl + 50)); // Wait for expiration

    assertEquals(eventCache.get('test1'), 1); // Value should still be present
});

Deno.test("EventCache: Delete with deleteOnExpire false interval strategy", async () => {
    const ttl = 300;
    const intervalStrategy = new IntervalStrategy(ttl);
    const eventCache = new EventCache<string, number>({ eventStrategy: intervalStrategy, deleteOnExpire: false });

    eventCache.set('test1', 1);
    await new Promise(r => setTimeout(r, ttl + 50)); // Wait for expiration

    assertEquals(eventCache.get('test1'), 1); // Value should still be present
});


Deno.test("EventCache: No eventStrategy", () => {
    const eventCache = new EventCache<string, number>();
    eventCache.set('test1', 1);
    eventCache.set('test2', 2);
    assertEquals(eventCache.get('test1'), 1);
    assertEquals(eventCache.get('test2'), 2);
    eventCache.delete('test1');
    assertEquals(eventCache.get('test1'), undefined);
});

Deno.test("EventCache: clearAll with timeout strategy", () => {
    const ttl = 100;
    const timeoutStrategy = new TimeoutStrategy(ttl);
    const eventCache = new EventCache<string, number>({ eventStrategy: timeoutStrategy });
    eventCache.set("test1", 1);
    eventCache.clear();
    assertEquals(eventCache.size, 0);
});

Deno.test("EventCache: clearAll with interval strategy", () => {
    const ttl = 100;
    const intervalStrategy = new IntervalStrategy(ttl);
    const eventCache = new EventCache<string, number>({ eventStrategy: intervalStrategy });
    eventCache.set("test1", 1);
    eventCache.clear();
    assertEquals(eventCache.size, 0);
});

