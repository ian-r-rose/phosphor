/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2016, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
import {
  IterableOrArrayLike, iter
} from './iterable';


/**
 * Find the minimum value in an iterable.
 *
 * @param object - The iterable or array-like object to search.
 *
 * @param fn - The 3-way comparison function to apply to the values.
 *   It should return `< 0` if the first value is less than the second.
 *   `0` if the values are equivalent, or `> 0` if the first value is
 *   greater than the second.
 *
 * @returns The minimum value in the iterable. If multiple values are
 *   equivalent to the minimum, the left-most value is returned. If
 *   the iterable is empty, this returns `undefined`.
 *
 * #### Complexity
 * Linear.
 *
 * #### Example
 * ```typescript
 * import { min } from '@phosphor/algorithm';
 *
 * function numberCmp(a: number, b: number): number {
 *   return a - b;
 * }
 *
 * min([7, 4, 0, 3, 9, 4], numberCmp);  // 0
 * ```
 */
export
function min<T>(object: IterableOrArrayLike<T>, fn: (first: T, second: T) => number): T | undefined {
  let it = iter(object);
  let result = it.next();
  if (result === undefined) {
    return undefined;
  }
  let value: T | undefined;
  while ((value = it.next()) !== undefined) {
    if (fn(value, result) < 0) {
      result = value;
    }
  }
  return result;
}
