

import { assertEquals } from "@std/assert/equals";
import { IntervalStrategy } from "../lib/EventStrategy/IntervalStrategy.ts";

Deno.test("IntervalStrategy: set single event", () => {
    const strategy = new IntervalStrategy<string>(100);
    const callback = () => { };
    strategy.set("key1", callback);

    //@ts-ignore More direct access to property
    assertEquals(strategy.queue.length, 1);
    //@ts-ignore More direct access to property
    assertEquals(strategy.queue[0].k, "key1");
    //@ts-ignore More direct access to property
    assertEquals(strategy.queue[0].f, callback);
    strategy.remove('key1');
});

Deno.test("IntervalStrategy: set multiple events", () => {
    const strategy = new IntervalStrategy<string>(100);
    const callback1 = () => { };
    const callback2 = () => { };
    strategy.set("key1", callback1);
    strategy.set("key2", callback2);

    //@ts-ignore More direct access to property
    assertEquals(strategy.queue.length, 2);
    strategy.clearAll();
});

Deno.test("IntervalStrategy: remove event", () => {
    const strategy = new IntervalStrategy<string>(100);
    const callback = () => { };
    strategy.set("key1", callback);
    strategy.remove("key1");
    //@ts-ignore More direct access to property
    assertEquals(strategy.queue.length, 0);
    //@ts-ignore More direct access to property
    assertEquals(strategy.interval, undefined);

});

Deno.test("IntervalStrategy: remove non-existent event", () => {
    const strategy = new IntervalStrategy<string>(100);
    strategy.remove("key1");
    //@ts-ignore More direct access to property
    assertEquals(strategy.queue.length, 0);
});

Deno.test("IntervalStrategy: clearAll", () => {
    const strategy = new IntervalStrategy<string>(100);
    const callback1 = () => { };
    const callback2 = () => { };
    strategy.set("key1", callback1);
    strategy.set("key2", callback2);
    strategy.clearAll();
    //@ts-ignore More direct access to property
    assertEquals(strategy.queue.length, 0);
    //@ts-ignore More direct access to property
    assertEquals(strategy.interval, undefined);
});

Deno.test("IntervalStrategy: Event is removed when it expires", async () => {
    const ttl = 500;
    const intervalStrategy = new IntervalStrategy<string>(ttl);

    intervalStrategy.set('test1', () => { });
    //@ts-ignore More direct access to property
    assertEquals(intervalStrategy.queue.length, 1);

    await new Promise(r => setTimeout(r, ttl + 50)); // Wait for expiration

    //@ts-ignore More direct access to property
    assertEquals(intervalStrategy.queue.length, 0);
});

Deno.test("IntervalStrategy: Multiple expired events are removed", async () => {
    const ttl = 300;
    const intervalStrategy = new IntervalStrategy<string>(ttl);

    for (let i = 0; i < 21; i++) {
        intervalStrategy.set('test' + i, () => { });
    }
    //@ts-ignore More direct access to property
    assertEquals(intervalStrategy.queue.length, 21);

    await new Promise(r => setTimeout(r, ttl + 50)); // Wait for expiration

    //@ts-ignore More direct access to property
    assertEquals(intervalStrategy.queue.length, 0);
});

Deno.test("IntervalStrategy: TTL zero", () => {
    const strategy = new IntervalStrategy<string>(0);
    const callback = () => { };
    strategy.set("key1", callback);
    //@ts-ignore More direct access to property
    assertEquals(strategy.queue.length, 1); //Event should still be added.
    //The event will likely execute almost immediately, so the assertion here is primarily
    //about successful queue addition
    strategy.clearAll();
});