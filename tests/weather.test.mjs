import test from 'node:test';
import assert from 'node:assert/strict';
import { WindSystem } from '../src/weather/WindSystem.js';

test('wind is deterministic for a fixed tick', () => {
  const a = new WindSystem({ seed:1234 });
  const b = new WindSystem({ seed:1234 });
  for (const tick of [0,1,19,83,240,999]) assert.deepEqual(a.sample(tick), b.sample(tick));
});

test('wind strength stays normalized', () => {
  const wind = new WindSystem();
  for (let tick=0; tick<2000; tick++) {
    const { strength } = wind.sample(tick);
    assert.ok(strength >= 0 && strength <= 1);
  }
});

test('streak descriptors are deterministic', () => {
  assert.deepEqual(new WindSystem({seed:7}).streaks, new WindSystem({seed:7}).streaks);
});
