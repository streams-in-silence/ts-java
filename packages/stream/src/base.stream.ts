import type { AutoCloseable } from './auto-closaeble';

export interface BaseStream<T, S extends BaseStream<T, S>>
  extends AutoCloseable {
  iterator(): Iterator<T>;
  onClose(closeHandler: () => void): S;
  unordered(): S;
}
