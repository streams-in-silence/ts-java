import { IllegalStateException } from '@ts-java/common/exception/illegal-state';
import { isFunction } from '@ts-java/common/typeguards';
import type { Stream } from '../stream';

/**
 * A simple decorator, that checks if the stream has already been closed
 * before calling the method.
 * If it was closed, the method will throw an {@link IllegalStateException}.
 *
 * @throws TypeError if the decorated property is not a function
 */
export function IsNotClosed(
  _target: Stream<unknown>,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  if (!isFunction(descriptor.value)) {
    throw new TypeError(`${propertyKey} is not a function`);
  }

  const original = descriptor.value;

  descriptor.value = function (this: Stream<unknown>, ...args: unknown[]) {
    if (this.isClosed) {
      throw new IllegalStateException();
    }

    return original.call(this, ...args);
  };
}
