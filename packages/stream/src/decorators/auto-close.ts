import { isFunction } from '@ts-java/common/typeguards';
import type { Stream } from '../stream';

/**
 * A simple decorator, that automatically closes a Stream after executing a
 * function.
 *
 * @throws TypeError if the decorated property is not a function
 */
export function AutoClose(
  _target: Stream<unknown>,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  if (!isFunction(descriptor.value)) {
    throw new TypeError(`${propertyKey} is not a function`);
  }

  const original = descriptor.value;

  descriptor.value = function (this: Stream<unknown>, ...args: unknown[]) {
    const result = original.call(this, ...args);

    this.close();

    return result;
  };
}
