import type { EventStrategy } from "./TimeoutStrategy.ts";

/**
 * Data structure for the event queue.
 * @template K The type of the key.
 */
type QueueData<K> = {
  t: number;
  k: K;
  f: () => void;
};

/**
 * A strategy for managing events at intervals.
 * @template K The type of the key.
 */
export class IntervalStrategy<K> implements EventStrategy<K> {
  /**
   * The queue of events to be processed.
   * @private
   */
  private queue: QueueData<K>[] = [];

  /**
   * The interval ID, used to stop the interval.
   * @private
   */
  private interval: number | undefined;

  /**
   * The time-to-live (TTL) for each event, in milliseconds.
   * @public
   * @readonly
   */
  public readonly ttl: number;

  /**
   * The delay between each interval, in milliseconds.
   * @public
   * @readonly
   */
  public readonly intervalDelay: number;

  /**
   * Creates a new IntervalStrategy instance.
   * @param ttl The time-to-live (TTL) for each event, in milliseconds.
   */
  constructor(ttl: number, intervalDelay: number = 200) {
    this.ttl = ttl;
    this.intervalDelay = intervalDelay;
  }

  /**
   * Stops the interval.
   * @private
   */
  private stopInterval(): void {
    clearInterval(this.interval);
    this.interval = undefined;
  }

  /**
   * Starts the interval.
   * @private
   */
  private startInterval(): void {
    this.interval = setInterval(() => {
      while (true) {
        const firstElement = this.queue.at(0);
        if (!firstElement) {
          this.stopInterval();
          break;
        }

        if (firstElement.t - Date.now() <= 0) {
          firstElement.f();
          this.queue.shift();
        } else {
          break;
        }
      }
    }, Math.max(this.ttl, this.intervalDelay));
  }

  /**
   * Sets an event in the queue.
   * @param key The key of the event.
   * @param onFinish The function to be executed when the event expires.
   */
  public set(key: K, onFinish: () => void): void {
    this.queue.push({
      k: key,
      f: onFinish,
      t: Date.now() + this.ttl,
    });

    if (this.interval !== undefined) {
      return;
    }

    this.startInterval();
  }

  /**
   * Removes an event from the queue.
   * @param key The key of the event to be removed.
   */
  public remove(key: K): void {
    this.queue = this.queue.filter((x) => x.k !== key);

    if (this.queue.length > 0) {
      return;
    }

    this.stopInterval();
  }

  /**
   * Clears all events from the queue.
   */
  public clearAll(): void {
    this.queue = [];
    this.stopInterval();
  }
}
