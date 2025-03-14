![Tests](https://github.com/zeptosec/event-cache/actions/workflows/test.yml/badge.svg)
[![codecov](https://codecov.io/gh/Zeptosec/event-cache/graph/badge.svg?token=QEGCXKRS8P)](https://codecov.io/gh/Zeptosec/event-cache)
[![JSR](https://jsr.io/badges/@zeptosec/event-cache)](https://jsr.io/@zeptosec/event-cache)
![Publish](https://github.com/zeptosec/event-cache/actions/workflows/publish.yml/badge.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](/LICENSE)
![GitHub last commit (branch)](https://img.shields.io/github/last-commit/zeptosec/event-cache/main)

# Event Cache

The main purpose of this libary is to store key-value pairs while also managing
the expiration of those entries and emitting events when items expire. This is
useful for scenarios where you need a cache that automatically removes stale
data and notifies other parts of your application when that happens.

# Library description

## Provided functions

A table documenting all public methods of each class

### EventCache class

| Method Name      | Parameters                                                                                                                                                                          | Description                                                                                                                                   |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| constructor      | `options: EventCacheProps<K> - deleteOnExpire?: boolean`: Whether to delete expired items (defaults to `true`). - `eventStrategy: EventStrategy<K>`: The event expiration strategy. | Initializes a new EventCache instance, setting the deleteOnExpire option and the eventStrategy.                                               |
| set              | `key: K` `value: V`. `key`: The key to add/update in the cache. `value`: The value to store associated with the key.                                                                | Adds or updates a key-value pair in the cache. It also manages the expiration event for the item. Returns `this` (the `EventCache` instance). |
| delete           | `key: K`. The key to remove from the cache.                                                                                                                                         | Removes a key-value pair from the cache and the associated expiration event. Returns `true` if an item was removed, false otherwise.          |
| get              | `key: K`. The key to retrieve from the cache.                                                                                                                                       | Retrieves the value associated with the given key. Returns the value if found, `undefined` otherwise.                                         |
| clear            | None                                                                                                                                                                                | Clears all key-value pairs from the cache and removes all expiration events.                                                                  |
| size             | None                                                                                                                                                                                | A getter that returns the number of items currently in the cache.                                                                             |
| entries          | Returns an iterator of `[key, value]` pairs for each entry in the cache                                                                                                             | Returns an iterator of `[key, value]` pairs for each entry in the cache.                                                                      |
| keys             | None                                                                                                                                                                                | Returns an iterator of keys for each entry in the cache.                                                                                      |
| values           | None                                                                                                                                                                                | Returns an iterator of values for each entry in the cache.                                                                                    |
| has              | `key: K`. The key to check for.                                                                                                                                                     | Checks if the cache contains a key. Returns `true` if the key exists, `false` otherwise.                                                      |
| forEach          | `callback: (value: V, key: K, map: Map<K, V>) => void` A function to execute for each key-value pair. It receives the value, key, and the map as arguments.                         | Iterates over each key-value pair in the cache and executes the provided callback function.                                                   |
| addEventListener | `type: T extends keyof EventCacheEvents<K, V> listener: (event: EventCacheEvents<K, V>[T]) => void` options?: boolean                                                               | A function that will be called when an item in a cache expires.                                                                               |

## Business problems that library solves

This library helps to solve several business problems related to caching and
event management:

- **Managing expired data:** Many applications need to cache data for
  permormance, but that data often has a limited lifespan. This library
  automates removal of old data while still working as a cache.
- **Event based notifications:** Provides a convenient way of knowing when data
  becomes outdated through events.
- **Flexible expiration strategies:** For better performance there's `interval`
  based strategy which can handle many more events. For more accuracy there's
  `timeout` based strategy.

## Intended use

This library is intended for use in applications that requires caching with data
expiration.

- **Real-time data:** frequently updated data, such as price discounts, weather
  information. Once data expires it can easily be updated again when event is
  received.
- **Rate-limiting:** Caching responses from APIs with rate limits. It can cache
  frequently fetched responses so that the database isn't used on every request.
- **Web applications:** Caching frequently used data to improve performance and
  user expirience. Caching API responses on the front end.

This library is useful in any situation where data needs to be cached for
performance while expired data is removed.

## Restrictions for library usage

Here are outlined the main restrictions for using the library

### Technical restrictions

- **Event Listener Management:** `addEventListener` provides a way to attach an
  event to an object to receive events after the data expired. This event should
  be removed with `AbortController` after it is no longer needed.
- **Implementation limitations:** `EventCache` triggers events asynchronously.
  This means that expiration events are not guaranteed to happen **exactly** at
  specified time. Slight delays should be expected.

### Business restrictions

- **Expiry requirement:** This libary is primarily for caching data that will
  expire. If your data never expires then a simpler caching solutions might be
  more appropriate.

- **Data sensitivy:** This library doesn't provide any data encryption. It is
  stored as provided.

## Other important information

### Performance

The performance of event cache is directly related to `EventStrategy`. So it is
very important to choose event strategy that you need. `IntervalStrategy` is
more performant, but events may not be received on time. `TimeoutStrategy`
should be more accurate than `IntervalStrategy`, but it may consume more memory
when there's a lot of data.

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

// Create AbortController for removing event listener if needed
const abortController = new AbortController();

timeoutCache.addEventListener("expire", (expiredItem) => {
  console.log(`Item '${expiredItem.key}' expired. Value: ${expiredItem.value}`);
}, {
  signal: abortController.signal,
});

timeoutCache.set("myKey", 123);

setTimeout(() => {
  console.log(`myKey (3000 ms): ${timeoutCache.get("myKey")}`);
  // Access the value before expiration
}, 3000);

setTimeout(() => {
  console.log(`myKey (7000 ms): ${timeoutCache.get("myKey")}`);
  // Access the value after expiration

  abortController.abort(); // Remove event listener
}, 7000);

// Interval-based expiration using IntervalStrategy
const intervalCache = EventCacheFactory.createEventCacheInterval<
  string,
  string
>(2000); // Items are checked every 2 seconds

intervalCache.addEventListener("expire", (expiredItem) => {
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

intervalCacheCustom.addEventListener("expire", (expiredItem) => {
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

eventCache.addEventListener("expire", ({ key, value }) => {
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
