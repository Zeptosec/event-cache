# Event Cache

A simple, efficient, and extensible in-memory cache with event-driven
expiration. This library provides a flexible caching solution for managing data
with time-based or interval-based expiration, triggering events when items
expire.

## Features

- **Time-based expiration (TimeoutStrategy):** Items expire after a specified
  time-to-live (TTL).
- **Interval-based expiration (IntervalStrategy):** Items are checked for
  expiration at regular intervals.
- **Event-driven expiration:** Events are emitted when items expire, allowing
  you to perform cleanup or other actions.
- **Configurable deleteOnExpire:** Choose whether to automatically remove
  expired items from the cache or retain them.
- **Extensible:** Easily create custom expiration strategies.
- **Simple API:** Easy to use and integrate into your projects.

## Examples

The `EventCacheFactory` provides convenient methods to create caches with
predefined strategies:

```ts
import { EventCacheFactory } from "@zeptosec/event-cache";

// Time-based expiration using TimeoutStrategy
const timeoutCache = EventCacheFactory.createEventCacheTimeout<string, number>(
  5000,
); // Items expire after 5 seconds

timeoutCache.on("expire", (expiredItem) => {
  console.log(`Item '${expiredItem.key}' expired. Value: ${expiredItem.value}`);
});

timeoutCache.set("myKey", 123);

setTimeout(() => {
  console.log(`myKey (3000 ms): ${timeoutCache.get("myKey")}`);
  // Access the value before expiration
}, 3000);

setTimeout(() => {
  console.log(`myKey (7000 ms): ${timeoutCache.get("myKey")}`);
  // Access the value after expiration
}, 7000);

// Interval-based expiration using IntervalStrategy
const intervalCache = EventCacheFactory.createEventCacheInterval<
  string,
  string
>(2000); // Items are checked every 2 seconds

intervalCache.on("expire", (expiredItem) => {
  console.log(`Item '${expiredItem.key}' expired. Value: ${expiredItem.value}`);
});

intervalCache.set("key2", "hello");

setTimeout(() => {
  console.log(`key2 (1000 ms): ${intervalCache.get("anotherKey")}`);
  // Access the value before expiration
}, 1000);

setTimeout(() => {
  console.log(`key2 (3000 ms): ${intervalCache.get("anotherKey")}`);
  // Access the value after expiration
}, 3000);
```

Using `EventCacheBuilder` to build your own `EventCache`:

```ts
import { EventCacheBuilder, IntervalStrategy } from "@zeptosec/event-cache";

const builder = new EventCacheBuilder<number, string>();
// Items are checked every 500ms, TTL is 1000ms, and expired items are NOT deleted.
const intervalCacheCustom = builder
  .withStrategy(
    new IntervalStrategy(1000, 500),
    false,
  ).build();

intervalCacheCustom.on("expire", (expiredItem) => {
  console.log(`Item '${expiredItem.key}' expired. Value: ${expiredItem.value}`);
});

intervalCacheCustom.set(1, "test");

setTimeout(() => {
  console.log(`1 (2000ms): ${intervalCacheCustom.get(1)}`); // Value should still be present even after expiration.
}, 2000);

setTimeout(() => {
  console.log(`1 (3000ms): ${intervalCacheCustom.get(1)}`); // Value should still be present even after expiration.
}, 3000);
```

Using `EventCache` with strategy directly:

```ts
import { EventCache, TimeoutStrategy } from "@zeptosec/event-cache";

const eventCache = new EventCache<number, string>({
  deleteOnExpire: false, // do not delete after expired
  eventStrategy: new TimeoutStrategy(1000), // TTL: 1 second
});

eventCache.set(42, "answer");

eventCache.on("expire", ({ key, value }) => {
  console.log(`expired: ${key}: ${value}`);
});

setTimeout(() => {
  console.log(`Before expired: ${eventCache.get(42)}`);
  // value is defined
}, 500);

setTimeout(() => {
  console.log(`After expired: ${eventCache.get(42)}`);
  // value is still defined
}, 2000);
```
