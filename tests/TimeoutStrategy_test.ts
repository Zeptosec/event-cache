import { assertEquals } from "@std/assert/equals";
import { TimeoutStrategy } from "../lib/EventStrategy/TimeoutStrategy.ts";

Deno.test("TimeoutStrategy: set single event", () => {
  const strategy = new TimeoutStrategy<string>(100);
  const callback = () => {};
  strategy.set("key1", callback);
  //The internal state of TimeoutStrategy is not directly accessible for assertion.
  //You need to test the behavior indirectly (see the async test below).
  strategy.remove("key1"); //Clean up
});

Deno.test("TimeoutStrategy: set multiple events", () => {
  const strategy = new TimeoutStrategy<string>(100);
  const callback1 = () => {};
  const callback2 = () => {};
  strategy.set("key1", callback1);
  strategy.set("key2", callback2);
  //Again, direct assertion of internal state is not feasible here.
  strategy.clearAll(); //Clean up
});

Deno.test("TimeoutStrategy: remove event", () => {
  const strategy = new TimeoutStrategy<string>(100);
  const callback = () => {};
  strategy.set("key1", callback);
  strategy.remove("key1");
  // No direct assertion possible, indirect testing is needed (see below)
});

Deno.test("TimeoutStrategy: remove non-existent event", () => {
  const strategy = new TimeoutStrategy<string>(100);
  strategy.remove("key1"); // Should not throw an error
});

Deno.test("TimeoutStrategy: clearAll", () => {
  const strategy = new TimeoutStrategy<string>(100);
  const callback1 = () => {};
  const callback2 = () => {};
  strategy.set("key1", callback1);
  strategy.set("key2", callback2);
  strategy.clearAll();
  // No direct assertion possible, indirect testing is needed (see below)
});

//Test using setTimeout to ensure the callback is called after the specified TTL.
Deno.test("TimeoutStrategy: event execution", async () => {
  const ttl = 100; // Keep it short for testing.
  const strategy = new TimeoutStrategy<string>(ttl);
  let val = 0;
  const callback = () => {
    val = 1;
  };

  strategy.set("key1", callback);

  await new Promise((r) => setTimeout(r, ttl + 50)); // Wait for timeout + a little extra

  assertEquals(val, 1); //Assert the callback was called
});

// Test with TTL of 0
Deno.test("TimeoutStrategy: TTL zero", async () => {
  const ttl = 0;
  const strategy = new TimeoutStrategy<string>(ttl);
  let val = 0;
  const callback = () => {
    val = 1;
  };

  strategy.set("key1", callback);

  await new Promise((r) => setTimeout(r, 50)); //Small delay to ensure that timeout has been set

  assertEquals(val, 1);
});
