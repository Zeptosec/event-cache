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
