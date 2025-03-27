export interface BaseStream<T, S extends BaseStream<T, S>> {
  close(): void;
  isParallel(): boolean;
  iterator(): Iterator<T>;
  onClose(closeHandler: () => void): S;
  parallel(): S;
  sequential(): S;
  unordered(): S;
}
