/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2016, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
import {
  IIterator
} from './iterator';


/**
 * Create an iterator which yields a value a single time.
 *
 * @param value - The value to wrap in an iterator.
 *
 * @returns A new iterator which yields the value a single time.
 *
 * #### Example
 * ```typescript
 * import { once, toArray } from '@phosphor/algorithm';
 *
 * let stream = once(7);
 *
 * toArray(stream);  // [7]
 * ```
 */
export
function once<T>(value: T): RepeatIterator<T> {
  return new RepeatIterator<T>(value, 1);
}


/**
 * Create an iterator which repeats a value a number of times.
 *
 * @param value - The value to repeat.
 *
 * @param count - The number of times to repeat the value.
 *
 * @returns A new iterator which repeats the specified value.
 *
 * #### Example
 * ```typescript
 * import { repeat, toArray } from '@phosphor/algorithm';
 *
 * let stream = repeat(7, 3);
 *
 * toArray(stream);  // [7, 7, 7]
 * ```
 */
export
function repeat<T>(value: T, count: number): RepeatIterator<T> {
  return new RepeatIterator<T>(value, count);
}


/**
 * An iterator which repeats a value a specified number of times.
 */
export
class RepeatIterator<T> implements IIterator<T> {
  /**
   * Construct a new repeat iterator.
   *
   * @param value - The value to repeat.
   *
   * @param count - The number of times to repeat the value.
   */
  constructor(value: T, count: number) {
    this._value = value;
    this._count = count;
  }

  /**
   * Create an iterator over the object's values.
   *
   * @returns A reference to `this` iterator.
   */
  iter(): this {
    return this;
  }

  /**
   * Create an independent clone of the repeat iterator.
   *
   * @returns A new iterator starting with the current value.
   */
  clone(): RepeatIterator<T> {
    return new RepeatIterator<T>(this._value, this._count);
  }

  /**
   * Get the next value from the iterator.
   *
   * @returns The next value from the iterator, or `undefined` if
   *   the iterator is exhausted.
   */
  next(): T {
    if (this._count <= 0) {
      return void 0;
    }
    this._count--;
    return this._value;
  }

  private _value: T;
  private _count: number;
}
