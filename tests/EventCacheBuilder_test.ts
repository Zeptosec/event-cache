import { EventCacheBuilder } from "../lib/EventCacheBuilder.ts";
import { TimeoutStrategy } from "../lib/EventStrategy/TimeoutStrategy.ts";
import { IntervalStrategy } from "../lib/EventStrategy/IntervalStrategy.ts";
import { EventCache } from "../lib/EventCache.ts";
import { assertEquals } from "@std/assert/equals";

Deno.test("EventCacheBuilder: build with TimeoutStrategy and default deleteOnExpire", () => {
  const builder = new EventCacheBuilder<string, number>();
  const strategy = new TimeoutStrategy<string>(1000);
  const eventCache = builder.withStrategy(strategy).build();

  //@ts-ignore More direct access to property
  assertEquals(eventCache.deleteOnExpire, true);
  //@ts-ignore More direct access to property
  assertEquals(eventCache.eventStrategy, strategy);
});

Deno.test("EventCacheBuilder: build with TimeoutStrategy and specified deleteOnExpire", () => {
  const builder = new EventCacheBuilder<string, number>();
  const strategy = new TimeoutStrategy<string>(1000);
  const eventCache = builder.withStrategy(strategy, false).build();

  //@ts-ignore More direct access to property
  assertEquals(eventCache.deleteOnExpire, false);
  //@ts-ignore More direct access to property
  assertEquals(eventCache.eventStrategy, strategy);
});

Deno.test("EventCacheBuilder: build with IntervalStrategy and default deleteOnExpire", () => {
  const builder = new EventCacheBuilder<number, string>();
  const strategy = new IntervalStrategy<number>(1000);
  const eventCache = builder.withStrategy(strategy).build();

  //@ts-ignore More direct access to property
  assertEquals(eventCache.deleteOnExpire, true);
  //@ts-ignore More direct access to property
  assertEquals(eventCache.eventStrategy, strategy);
});

Deno.test("EventCacheBuilder: build with IntervalStrategy and specified deleteOnExpire", () => {
  const builder = new EventCacheBuilder<number, string>();
  const strategy = new IntervalStrategy<number>(1000);
  const eventCache = builder.withStrategy(strategy, false).build();

  //@ts-ignore More direct access to property
  assertEquals(eventCache.deleteOnExpire, false);
  //@ts-ignore More direct access to property
  assertEquals(eventCache.eventStrategy, strategy);
});

Deno.test("EventCacheBuilder: handle different key and value types", () => {
  const builder = new EventCacheBuilder<symbol, boolean>();
  const strategy = new TimeoutStrategy<symbol>(1000);
  const eventCache = builder.withStrategy(strategy).build();

  assertEquals(eventCache instanceof EventCache, true);
});

//Helper function to simulate an async operation and resolve after a timeout.  This is useful for dealing with async behavior in the event strategies.
async function delay(ms: number): Promise<void> {
  return await new Promise((resolve) => setTimeout(resolve, ms));
}

Deno.test("EventCacheBuilder: TimeoutStrategy event execution", async () => {
  const ttl = 100;
  const strategy = new TimeoutStrategy<string>(ttl);
  const builder = new EventCacheBuilder<string, number>();
  let val = 0;

  const eventCache = builder.withStrategy(strategy).build();

  eventCache.on("expire", () => {
    val = 1;
  });

  eventCache.set("key1", 123);

  await delay(ttl + 50); // Wait for timeout + a little extra

  assertEquals(val, 1);
});

Deno.test("EventCacheBuilder: IntervalStrategy event execution", async () => {
  const ttl = 100;
  const intervalDelay = 50;
  const strategy = new IntervalStrategy<string>(ttl, intervalDelay);
  const builder = new EventCacheBuilder<string, number>();
  let val = 0;

  const eventCache = builder.withStrategy(strategy).build();

  eventCache.on("expire", () => {
    val = 1;
  });

  eventCache.set("key1", 123);

  await delay(ttl + 50); // Wait for timeout + a little extra

  assertEquals(val, 1);
});
